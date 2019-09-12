import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable, {
  StandardTableColumnProps
} from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import { Pagination } from '@/models/common';
import { Item, StateType, QueryParams } from '@/models/user';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  user: StateType;
}

interface TableListState {
  addVisible: boolean;
  updateVisible: boolean;
  selectedRows: Item[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<Item>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    user,
    loading
  }: {
    user: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    user,
    loading: loading.models.rule
  })
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    addVisible: false,
    updateVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {}
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '账号',
      dataIndex: 'account'
    },
    {
      title: '用户名',
      dataIndex: 'name'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '组织',
      dataIndex: 'organization'
    },
    {
      title: '角色',
      dataIndex: 'role'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateVisible(true, record)}>
            管理
          </a>
          <Divider type='vertical' />
          <a href=''>重置密码</a>
          <Divider type='vertical' />
          <a href=''>删除</a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch'
    });
  }

  handleStandardTableChange = (
    pagination: Partial<Pagination>,
    filtersArg: Record<keyof Item, string[]>,
    sorter: SorterResult<Item>
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<QueryParams> = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters
    };
    dispatch({
      type: 'user/fetch',
      payload: params
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: 'user/fetch',
      payload: {}
    });
  };

  // handleMenuClick = (e: { key: string }) => {
  //   const { dispatch } = this.props;
  //   const { selectedRows } = this.state;

  //   if (!selectedRows) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'user/remove',
  //         payload: {
  //           key: selectedRows.map(row => row.id)
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: []
  //           });
  //         }
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  handleSelectRows = (rows: Item[]) => {
    this.setState({
      selectedRows: rows
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState({
        formValues: values
      });

      dispatch({
        type: 'user/fetch',
        payload: values
      });
    });
  };

  handleAddVisible = (flag?: boolean) => {
    this.setState({
      addVisible: !!flag
    });
  };

  handleUpdateVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateVisible: !!flag,
      stepFormValues: record || {}
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/add',
      payload: {
        desc: fields.desc
      }
    });

    message.success('添加成功');
    this.handleAddVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: {
        // name: fields.name,
        // desc: fields.desc,
        // key: fields.key,
      }
    });

    message.success('配置成功');
    this.handleUpdateVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label='账号'>
              {getFieldDecorator('account')(<Input placeholder='请输入' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='角色'>
              {getFieldDecorator('status')(
                <Select placeholder='请选择' style={{ width: '100%' }}>
                  <Option value='0'>管理员</Option>
                  <Option value='1'>经销商</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type='primary' htmlType='submit'>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { data },
      loading
    } = this.props;

    const {
      selectedRows,
      addVisible,
      updateVisible,
      stepFormValues
    } = this.state;

    const addMethods = {
      handleAdd: this.handleAdd,
      handleAddVisible: this.handleAddVisible
    };

    const updateMethods = {
      handleUpdateVisible: this.handleUpdateVisible,
      handleUpdate: this.handleUpdate
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon='plus'
                type='primary'
                onClick={() => this.handleAddVisible(true)}
              >
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...addMethods} addVisible={addVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateVisible={updateVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
