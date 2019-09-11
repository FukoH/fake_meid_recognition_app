import request from '@/utils/request';
import { QueryParams } from '@/models/analysis';

export async function query(params: QueryParams) {
  return request('/api/analysis', {
    params
  });
}
