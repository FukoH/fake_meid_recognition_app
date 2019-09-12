import { Form, Input, Drawer, Button, Select, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Item } from '@/models/user';
import { query as queryOrganization } from '@/services/organization'
import { Organization, QueryParams as QueryOrganizationParams } from '@/models/organization';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const Option = Select.Option;

export interface FormValsType extends Partial<Item> {}

interface CreateFormProps extends FormComponentProps {
  addVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleAddVisible: () => void;
}
interface CreateFormState {
  formVals: FormValsType;
  fetching: boolean;
  organizations: Array<Organization>;
}

class CreateForm extends React.Component<CreateFormProps, CreateFormState> {
  constructor (props: CreateFormProps) {
    super(props);
    this.okHandle = this.okHandle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      formVals: {},
      fetching: false,
      organizations: [],
    }
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleOrganizationChange = this.handleOrganizationChange.bind(this);
    this.fetchOrganization = debounce(this.fetchOrganization.bind(this), 800);
  }
  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      // this.props.form.resetFields();
      // this.props.handleAdd(fieldsValue);
      console.log('fieldsValue', fieldsValue)
    });
  };

  onClose = () => {
    this.props.handleAddVisible()
  };

  handleRoleChange = (value: any) => {
    this.setState({
      formVals: Object.assign({}, this.state.formVals, {role: value})
    })
  }

  handleOrganizationChange = (value: any) => {
    this.setState({
      formVals: Object.assign({}, this.state.formVals, {organizationId: value})
    })
  }
  // 查询组织信息
  fetchOrganization () {
    let params :QueryOrganizationParams = {};
    this.setState({ organizations: [], fetching: true });
    queryOrganization(params).then((res: any) => {
      this.setState({organizations: res.data,  fetching: false})
    })
  }
  render () {
    const { fetching, organizations } = this.state;
    return (
      <div>
        <Drawer
          title="新增用户"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.props.addVisible}
          width={600}
        >
          <Form>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='角色'>
              {this.props.form.getFieldDecorator('role', {
                initialValue: this.state.formVals.role,
                rules: [
                  {
                    required: true,
                    message: '用户角色是必填项',
                  }
                ]
              })(
                <Select style={{ width: 120 }}>
                  <Option value={0}>管理员</Option>
                  <Option value={1}>经销商</Option>
                </Select>
              )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='所属组织'>
              {this.props.form.getFieldDecorator('organizationId', {
                initialValue: this.state.formVals.organizationId,
                rules: [
                  {
                    required: true,
                    message: '所属组织是必填项',
                  }
                ]
              })(
                <Select
                  showSearch
                  labelInValue
                  placeholder="搜索组织"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchOrganization}
                  style={{ width: '100%' }}>
                    {organizations.map(d => (
                      <Option key={d.id}>{d.name}</Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='账号'>
              {this.props.form.getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: '账号是必填项',
                  }
                ]
              })(<Input placeholder='请输入' />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='用户名'>
              {this.props.form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '用户名是必填项',
                    min: 5
                  }
                ]
              })(<Input placeholder='请输入' />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='手机号'>
              {this.props.form.getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '手机号是必填项',
                    min: 5
                  }
                ]
              })(<Input placeholder='请输入' />)}
            </FormItem>
          </Form>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button style={{ marginRight: 8 }} onClick={this.onClose}>取消</Button>
            <Button onClick={this.okHandle} type="primary">创建</Button>
          </div>
        </Drawer>
      </div>
    );
  }
};

export default Form.create<CreateFormProps>()(CreateForm);