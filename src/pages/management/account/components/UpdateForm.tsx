import { Button, Drawer, Form, Input, Select, Spin } from "antd";
import React, { Component } from "react";

import { FormComponentProps } from "antd/es/form";
import { query as queryOrganization } from "@/services/organization";
import {
  Organization,
  QueryParams as QueryOrganizationParams
} from "@/models/organization";
import { Item } from "@/models/user";
import { ROLES } from "@/constants";
import debounce from "lodash/debounce";

export interface FormValsType extends Partial<Item> {}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleUpdate: (values: FormValsType) => void;
  updateVisible: boolean;
  value: Partial<Item>;
  loading: boolean;
}
const FormItem = Form.Item;
const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValsType;
  fetching: boolean;
  organizations: Array<Organization>;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateVisible: () => {},
    value: {},
    loading: false
  };

  constructor(props: UpdateFormProps) {
    super(props);
    this.state = {
      formVals: this.props.value,
      fetching: false,
      organizations: []
    };
    this.okHandle = this.okHandle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.fetchOrganization = debounce(this.fetchOrganization.bind(this), 800);
  }

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 合并id并提交修改请求
      this.props.handleUpdate(
        Object.assign({}, { id: this.props.value.id }, fieldsValue)
      );
    });
  };

  onClose = () => {
    this.props.handleUpdateVisible();
  };

  // 查询组织信息
  fetchOrganization(value: string) {
    let params: QueryOrganizationParams = { name: value };
    this.setState({ organizations: [], fetching: true });
    queryOrganization(params).then((res: any) => {
      this.setState({ organizations: res.data.list, fetching: false });
    });
  }

  render() {
    const { fetching, organizations } = this.state;
    return (
      <Drawer
        title="修改用户"
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={this.props.updateVisible}
        width={600}
      >
        <Spin spinning={this.props.loading}>
          <Form>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="角色"
            >
              {this.props.form.getFieldDecorator("role", {
                initialValue: this.state.formVals.role,
                rules: [
                  {
                    required: true,
                    message: "用户角色是必填项"
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
              label="所属组织"
            >
              {this.props.form.getFieldDecorator("organizationId", {
                initialValue: this.state.formVals.organizationId,
                rules: [
                  {
                    required: true,
                    message: "所属组织是必填项"
                  }
                ]
              })(
                <Select
                  allowClear
                  showSearch
                  placeholder="搜索组织"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchOrganization}
                  style={{ width: "100%" }}
                >
                  {organizations.length > 0 ? (
                    organizations.map(d => (
                      <Option value={d.id}>{d.name}</Option>
                    ))
                  ) : (
                    <Option value={this.state.formVals.organizationId}>
                      {this.state.formVals.organizationName}
                    </Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="账号"
            >
              {this.props.form.getFieldDecorator("account", {
                initialValue: this.state.formVals.account,
                rules: [
                  {
                    required: true,
                    message: "账号是必填项"
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="用户名"
            >
              {this.props.form.getFieldDecorator("name", {
                initialValue: this.state.formVals.name,
                rules: [
                  {
                    required: true,
                    message: "用户名是必填项"
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="手机号"
            >
              {this.props.form.getFieldDecorator("phone", {
                initialValue: this.state.formVals.phone,
                rules: [
                  {
                    required: true,
                    message: "手机号是必填项"
                  },
                  {
                    message: "手机号格式不正确",
                    pattern: /^[1-9]{1}\d{10}$/g
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        </Spin>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e8e8e8",
            padding: "10px 16px",
            textAlign: "right",
            left: 0,
            background: "#fff",
            borderRadius: "0 0 4px 4px"
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={this.onClose}>
            取消
          </Button>
          <Button onClick={this.okHandle} type="primary">
            修改
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
