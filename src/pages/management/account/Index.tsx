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
import { ROLES } from '@/constants';
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
  detail: Partial<Item>;
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
    loading: loading.models.user
  })
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    addVisible: false,
    updateVisible: false,
    selectedRows: [],
    formValues: {},
    detail: {}
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
      dataIndex: 'organizationName'
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (text, record) => {
        let role = ROLES.find(r => String(r.value) === text);
        return role ? role.label : '';
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateVisible(true, record)}>管理</a>
          <Divider type='vertical' />
          <a onClick={() => this.handleResetPwd(record)}>重置密码</a>
          <Divider type='vertical' />
          <a onClick={() => this.handleRemove(record)}>删除</a>
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

  handleBatchRemove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'user/batchRemove',
      payload: {
        ids: selectedRows.map(row => row.id)
      },
      callback: (res: any) => {
        if (res.success) {
          this.setState({
            selectedRows: []
          });
          dispatch({
            type: 'user/fetch'
          });
        } else {
          message.error('批量删除失败');
        }
      }
    });
  };
  handleRemove = (record: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: record.id,
      callback: (res: any) => {
        if (res.success) {
          dispatch({
            type: 'user/fetch'
          });
        } else {
          message.error('删除失败');
        }
      }
    });
  };
  handleResetPwd = (record: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/resetPwd',
      payload: record.id,
      callback: (res: any) => {
        if (res.success) {
          dispatch({
            type: 'user/fetch'
          });
          message.success('重置密码成功');
        } else {
          message.error('重置密码失败');
        }
      }
    });
  };

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
      detail: record || {}
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/add',
      payload: fields,
      callback: (res: any) => {
        if (res.success) {
          message.success('添加成功');
          this.handleAddVisible();
          this.handleFormReset();
        } else {
          message.error('添加失败');
        }
      }
    });
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: fields,
      callback: (res: any) => {
        if (res.success) {
          message.success('修改成功');
          this.handleUpdateVisible();
          this.handleFormReset();
        } else {
          message.error('修改失败');
        }
      }
    });
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
            <FormItem label='名字'>
              {getFieldDecorator('name')(<Input placeholder='请输入' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='角色'>
              {getFieldDecorator('role')(
                <Select
                  placeholder='请选择'
                  style={{ width: '100%' }}
                  allowClear
                >
                  {ROLES.map((r: any) => (
                    <Option value={r.value}>{r.label}</Option>
                  ))}
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

    const { selectedRows, addVisible, updateVisible, detail } = this.state;

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
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon='plus'
                type='primary'
                onClick={() => this.handleAddVisible(true)}
              >
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleBatchRemove()}>
                    批量删除
                  </Button>
                </span>
              )}
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
        <CreateForm loading={loading} {...addMethods} addVisible={addVisible} />
        {detail && detail.id ? (
          <UpdateForm
            loading={loading}
            {...updateMethods}
            updateVisible={updateVisible}
            value={detail}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
