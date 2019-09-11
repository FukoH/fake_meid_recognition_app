export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ListItem<T> {
  list: T[];
  pagination: Partial<Pagination>;
}
