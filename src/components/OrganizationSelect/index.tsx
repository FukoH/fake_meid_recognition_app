import { Select, Spin } from 'antd';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { query as queryOrganization } from '@/services/organization';
import { Organization, QueryParams as QueryOrganizationParams } from '@/models/organization';

const {Option} = Select;

export interface OrganizationProps {
    initialValue?: any;
    onChange?: (val: string) => {};
}

export interface OrganizationState {
    fetching: boolean;
    organizations: Array<Organization>;
}

export default class OrganizationSelect extends Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
        super(props);
        this.fetchOrganization = debounce(this.fetchOrganization.bind(this), 800);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            fetching: false,
            organizations: [],
        }
    }

    // 查询组织信息
    fetchOrganization(value: string) {
        let params: QueryOrganizationParams = { name: value };
        this.setState({ organizations: [], fetching: true });
        queryOrganization(params).then((res: any) => {
            this.setState({ organizations: res.data.list, fetching: false });
        });
    }

    handleChange (val: string) {
        this.props.onChange && this.props.onChange(val);
    }
    render () {
        console.log('props', this.props)
        const { fetching, organizations } = this.state
        return (
            <Select
                allowClear
                showSearch
                placeholder='搜索组织'
                notFoundContent={fetching ? <Spin size='small' /> : null}
                filterOption={false}
                onSearch={this.fetchOrganization}
                onChange={this.handleChange}
                style={{ width: '100%' }}
                defaultValue={this.props.initialValue ? this.props.initialValue.value : ''}
              >
                {organizations.length > 0 ? (
                    organizations.map(d => (
                        <Option key={d.id} value={d.id}>{d.name}</Option>
                    ))
                ) : this.props.initialValue ? (
                    <Option value={this.props.initialValue.value}>
                        {this.props.initialValue.label}
                    </Option>
                ) : null}
            </Select>
        )
    }
}