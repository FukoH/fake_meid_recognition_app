import request from '@/utils/request';
import { QueryParams, Item } from '@/models/credential';
import { toQueryString } from '@/utils/utils';

export async function query(params: QueryParams) {
  return request(`/api/credential${toQueryString(params)}`);
}

export async function find(id: string) {
  return request(`/api/credential/${id}`);
}

export async function add(data: Item) {
  return request('/api/credential', {
    method: 'POST',
    data
  });
}

export async function update(data: Item) {
  return request('/api/credential', {
    method: 'PUT',
    data
  });
}

export async function remove(id: string) {
  return request(`/api/credential/${id}`, {
    method: 'DELETE'
  });
}
