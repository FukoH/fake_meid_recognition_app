import { Form, Input, Drawer, Button, Select, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Item } from '@/models/user';
import { ROLES } from '@/constants';
import OrganizationSelect from '@/components/OrganizationSelect';
const FormItem = Form.Item;
const Option = Select.Option;

export interface FormValsType extends Partial<Item> {}

interface CreateFormProps extends FormComponentProps {
  addVisible: boolean;
  loading: boolean;
  handleAdd: (fieldsValue: FormValsType) => void;
  handleAddVisible: () => void;
}
interface CreateFormState {
  formVals: FormValsType;
}

class CreateForm extends React.Component<CreateFormProps, CreateFormState> {
  constructor(props: CreateFormProps) {
    super(props);
    this.okHandle = this.okHandle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      formVals: {},
    };
  }
  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue)
      if (err) return;
      this.props.form.resetFields();
      this.props.handleAdd(fieldsValue);
    });
  };

  onClose = () => {
    this.props.handleAddVisible();
  };

  handleOrganizationChange (val: string) {
    this.setState({
      formVals: Object.assign({}, this.state.formVals, { organization_id: val})
    })
  };

  render() {
    return (
      <div>
        <Drawer
          title='新增用户'
          placement='right'
          closable={false}
          onClose={this.onClose}
          visible={this.props.addVisible}
          width={600}
        >
          <Spin spinning={this.props.loading}>
            <Form>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='角色'
              >
                {this.props.form.getFieldDecorator('role', {
                  initialValue: this.state.formVals.role,
                  rules: [
                    {
                      required: true,
                      message: '用户角色是必填项'
                    }
                  ]
                })(
                  <Select style={{ width: 120 }}>
                    {ROLES.map((r: any) => (
                      <Option value={r.value}>{r.label}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='所属组织'
              >
                {this.props.form.getFieldDecorator('organization_id', {
                  rules: [
                    {
                      required: true,
                      message: '所属组织是必填项'
                    }
                  ]
                })(
                  <OrganizationSelect onChange={() => this.handleOrganizationChange}></OrganizationSelect>
                )}
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='账号'
              >
                {this.props.form.getFieldDecorator('account', {
                  rules: [
                    {
                      required: true,
                      message: '账号是必填项'
                    }
                  ]
                })(<Input placeholder='请输入' />)}
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='密码'
              >
                {this.props.form.getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '密码是必填项'
                    }
                  ]
                })(<Input type='password' placeholder='请输入' />)}
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='用户名'
              >
                {this.props.form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '用户名是必填项'
                    }
                  ]
                })(<Input placeholder='请输入' />)}
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label='手机号'
              >
                {this.props.form.getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '手机号是必填项'
                    },
                    {
                      message: '手机号格式不正确',
                      pattern: /^[1-9]{1}\d{10}$/g
                    }
                  ]
                })(<Input placeholder='请输入' />)}
              </FormItem>
            </Form>
          </Spin>
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
              borderRadius: '0 0 4px 4px'
            }}
          >
            <Button style={{ marginRight: 8 }} onClick={this.onClose}>
              取消
            </Button>
            <Button onClick={this.okHandle} type='primary'>
              创建
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);
