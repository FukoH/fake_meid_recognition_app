import request from '@/utils/request';
import { Organization, QueryParams } from '@/models/organization';

export async function query(params: QueryParams) {
  return request('/api/organization', {
    params
  });
}

export async function find(id: string) {
  return request(`/api/organization/${id}`);
}

export async function add(data: Organization) {
  return request('/api/organization', {
    method: 'POST',
    data: data
  });
}

export async function update(data: Organization) {
  return request('/api/organization', {
    method: 'PUT',
    data: data
  });
}

export async function remove(id: string) {
  return request(`/api/organization/${id}`, {
    method: 'DELETE'
  });
}
