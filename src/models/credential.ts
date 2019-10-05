import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { add, query, remove, update, find } from '@/services/credential';
import { Organization } from './organization';

export interface StateType {
  data: ListData;
}

export interface Item {
  id: string;
  organization: Organization;
  organization_id: string,
  organization_name: string,
  credential_no: string,
  money: string;
  status: string;
  description: string;
  disabled?: boolean;
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ListData {
  list: Item[];
  pagination: Partial<Pagination>;
}

export interface QueryParams {
  organization_id: string; // 关联组织id
  credential_no: string; // 凭证号码
  status: string; // 状态
  currentPage: number,
  pageSize: number,
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & {
    select: <T>(func: (state: StateType) => T) => T;
  }
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    find: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'credential',

  state: {
    data: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      yield put({
        type: 'save',
        payload: response
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({
        type: 'save',
        payload: response
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'save',
        payload: response
      });
      if (callback) callback();
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      yield put({
        type: 'save',
        payload: response
      });
      if (callback) callback();
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
};

export default Model;
