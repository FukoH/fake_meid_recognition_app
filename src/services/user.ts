import request from '@/utils/request';
import { User } from '../models/user';

export async function query(): Promise<any> {
  return request('/api/user');
}

export async function find(id: string): Promise<any> {
  return request(`/api/user/${id}`);
}

export async function add(data: User): Promise<any> {
  return request('/api/user', {
    method: 'POST',
    data
  });
}

export async function update(data: User): Promise<any> {
  return request('/api/user', {
    method: 'PUT',
    data
  });
}

export async function remove(id: string): Promise<any> {
  return request(`/api/user/${id}`, {
    method: 'DELETE'
  });
}
