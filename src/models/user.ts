import { Effect } from 'dva';
import { Reducer } from 'redux';

import { query } from '@/services/user';
import { ListItem, Pagination } from '@/models/common.d'

export interface QueryParams {
  page?: number,
  pageSize?: number,
}

export interface StateType {
  data: ListItem<Item>;
}

export interface Item {
  account?: string;
  password?: string;
  name?: string;
  role?: number;
  phone?: string;
  organizationId?: string;
  disabled?: boolean,
}

export interface UserModelState {
  user?: Item;
}

export interface UserModel {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModel = {
  namespace: 'user',

  state: {
    user: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response || {}
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        user: action.payload || {}
      };
    },
    changeNotifyCount(
      state = {
        user: {}
      },
      action
    ) {
      return {
        ...state,
        currentUser: {
          ...state.user,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    }
  }
};

export default UserModel;
