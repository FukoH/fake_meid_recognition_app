import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
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
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable, {
  StandardTableColumnProps
} from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import { Pagination } from '@/models/common';
import { Item, StateType, QueryParams } from '@/models/credential';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  credential: StateType;
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
    credential,
    loading
  }: {
    credential: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    credential,
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
      title: '凭证号',
      dataIndex: 'id'
    },
    {
      title: '代理商',
      dataIndex: 'organization'
    },
    {
      title: '金额',
      dataIndex: 'money',
      sorter: true,
      render: (val: string) => (
        <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: '0'
        },
        {
          text: status[1],
          value: '1'
        },
        {
          text: status[2],
          value: '2'
        },
        {
          text: status[3],
          value: '3'
        }
      ],
      render(val: IStatusMapType) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateVisible(true, record)}>
            配置
          </a>
          <Divider type='vertical' />
          <a href=''>订阅警报</a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'credential/fetch'
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
      // newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<Item> = {
      // currentPage: pagination.current,
      // pageSize: pagination.pageSize,
      ...formValues,
      ...filters
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'credential/fetch',
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
      type: 'credential/fetch',
      payload: {}
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'credential/remove',
          payload: {
            key: selectedRows.map(row => row.id)
          },
          callback: () => {
            this.setState({
              selectedRows: []
            });
          }
        });
        break;
      default:
        break;
    }
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
        type: 'credential/fetch',
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
      type: 'credential/add',
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
      type: 'credential/update',
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
            <FormItem label='凭证号码'>
              {getFieldDecorator('name')(<Input placeholder='请输入' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='凭证状态'>
              {getFieldDecorator('status')(
                <Select placeholder='请选择' style={{ width: '100%' }}>
                  <Option value='0'>关闭</Option>
                  <Option value='1'>运行中</Option>
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
      credential: { data },
      loading
    } = this.props;

    const {
      selectedRows,
      addVisible,
      updateVisible,
      stepFormValues
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key='remove'>删除</Menu.Item>
        <Menu.Item key='approval'>批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
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
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type='down' />
                    </Button>
                  </Dropdown>
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
        <CreateForm {...parentMethods} addVisible={addVisible} />
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
