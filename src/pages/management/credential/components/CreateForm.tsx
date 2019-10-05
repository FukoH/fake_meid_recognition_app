import { Form, Input, Drawer, Button, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Item } from '@/models/credential';
import OrganizationSelect from '@/components/OrganizationSelect';

const FormItem = Form.Item;

export interface FormValsType extends Partial<Item> {}

interface CreateFormProps extends FormComponentProps {
  addVisible: boolean;
  handleAdd: (fieldsValue: FormValsType, callback: any) => void;
  handleAddVisible: () => void;
  loading: boolean;
}

class CreateForm extends React.Component<CreateFormProps> {
  constructor (props: CreateFormProps) {
    super(props);
    this.okHandle = this.okHandle.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.handleAdd(fieldsValue, () => {
        this.props.form.resetFields();
      });
    });
  };

  onClose = () => {
    this.props.handleAddVisible()
  };

  render () {
    return (
      <div>
        <Drawer
          title="新增凭证"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.props.addVisible}
          width={600}
        >

          <Spin spinning={this.props.loading}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='凭证号'>
              {this.props.form.getFieldDecorator('credential_no', {
                rules: [
                  {
                    required: true,
                    message: '请输入凭证号！',
                  }
                ]
              })(<Input placeholder='请输入' />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='描述'>
              {this.props.form.getFieldDecorator('description')(<Input.TextArea placeholder='请输入' />)}
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
                <OrganizationSelect></OrganizationSelect>
              )}
            </FormItem>
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
            <Button style={{ marginRight: 8 }} onClick={this.onClose}>取消</Button>
            <Button onClick={this.okHandle} type='primary'>确定</Button>
          </div>
        </Drawer>
      </div>
    );
  }
};

export default Form.create<CreateFormProps>()(CreateForm);