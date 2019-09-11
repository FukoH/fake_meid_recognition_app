import request from '@/utils/request';
import { FormData } from '@/models/login';

export async function login(params: FormData) {
  return request('/api/login', {
    method: 'POST',
    data: params
  });
}
