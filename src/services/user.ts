import request from "@/utils/request";
import { Item } from "../models/user";
import { QueryParams } from "@/models/user";
import { toQueryString } from "@/utils/utils";

export async function query(params: QueryParams): Promise<any> {
  return request(`/api/user${toQueryString(params)}`);
}

export async function find(id: string): Promise<any> {
  return request(`/api/user/${id}`);
}

export async function add(data: Item): Promise<any> {
  return request("/api/user", {
    method: "POST",
    data
  });
}

export async function update(data: Item): Promise<any> {
  return request("/api/user", {
    method: "PUT",
    data
  });
}

export async function remove(id: string): Promise<any> {
  return request(`/api/user/${id}`, {
    method: "DELETE"
  });
}

export async function batchRemove(payload: any): Promise<any> {
  return request(`/api/user/batchDelete`, {
    method: "PUT",
    data: { ids: payload.ids }
  });
}
