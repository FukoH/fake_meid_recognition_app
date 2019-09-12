import { Form, Input, Drawer, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Item } from '@/models/credential';

const FormItem = Form.Item;

export interface FormValsType extends Partial<Item> {}

interface CreateFormProps extends FormComponentProps {
  addVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleAddVisible: () => void;
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
      this.props.form.resetFields();
      this.props.handleAdd(fieldsValue);
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
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label='描述'>
            {this.props.form.getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  message: '请输入至少五个字符的规则描述！',
                  min: 5
                }
              ]
            })(<Input placeholder='请输入' />)}
          </FormItem>
          <Button onClick={this.okHandle}>确定</Button>
          <Button onClick={this.onClose}>取消</Button>
        </Drawer>
      </div>
    );
  }
};

export default Form.create<CreateFormProps>()(CreateForm);