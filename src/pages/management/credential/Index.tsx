import {
  Divider,
  Button,
  Card,
  Col,
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
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable, {StandardTableColumnProps} from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import { Pagination } from '@/models/common';
import { Item, StateType, QueryParams } from '@/models/credential';
import { CREDENTIAL_STATUS } from '@/constants'
import OrganizationSelect from '@/components/OrganizationSelect';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

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
  detail: Partial<Item>;
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
    loading: loading.models.credential
  })
)
class TableList extends Component<TableListProps, TableListState> {
  constructor (props: TableListProps) {
    super(props);
  }
  state: TableListState = {
    addVisible: false,
    updateVisible: false,
    selectedRows: [],
    formValues: {},
    detail: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '凭证号',
      dataIndex: 'credential_no'
    },
    {
      title: '代理商',
      dataIndex: 'organization_name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      sorter: true,
      render: (val: string) => (
        <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      title: '金额',
      dataIndex: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val: string) {
        let obj = CREDENTIAL_STATUS.find(s => s.value === val)
        return obj ? obj.label : ''
      }
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateVisible(true, record)}>
            详情
          </a>
          <Divider type='vertical' />
          <a onClick={() => this.handleRemove(record)}>
            删除
          </a>
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

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params: Partial<QueryParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues
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

  // handleMenuClick = (e: { key: string }) => {
  //   const { dispatch } = this.props;
  //   const { selectedRows } = this.state;

  //   if (!selectedRows) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'credential/remove',
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
      detail: record || {}
    });
  };

  handleAdd = (fields: FormValsType, callback: () => {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'credential/add',
      payload: fields,
      callback: (res: any) => {
        if (res.success) {
          message.success('添加成功');
          callback();
          this.handleAddVisible();
          dispatch({
            type: 'credential/fetch',
            payload: {}
          });
        } else {
          message.error(res.errMsg);
        }
      }
    });

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

  handleRemove (record: FormValsType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'credential/remove',
      payload: record.id,
      callback: (res: any) => {
        if (res.success) {
          message.success('删除成功');
          dispatch({
            type: 'credential/fetch',
            payload: {}
          });
        } else {
          message.error('删除失败');
        }
      }
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout='inline'>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label='凭证号码'>
              {getFieldDecorator('credential_no')(<Input placeholder='请输入' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='凭证状态'>
              {getFieldDecorator('status')(
                <Select placeholder='请选择' style={{ width: '100%' }} allowClear>
                  {CREDENTIAL_STATUS.map(s => (
                    <Option value={s.value}>{s.label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label='所属组织'>
              {getFieldDecorator('organization_id')(
                <OrganizationSelect></OrganizationSelect>
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
      detail
    } = this.state;
    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key='remove'>删除</Menu.Item>
    //     <Menu.Item key='approval'>批量审批</Menu.Item>
    //   </Menu>
    // );

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
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type='down' />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='id'
            />
          </div>
        </Card>
        <CreateForm loading={loading} {...parentMethods} addVisible={addVisible} />
        {detail && Object.keys(detail).length ? (
          <UpdateForm
            {...updateMethods}
            updateVisible={updateVisible}
            values={detail}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
