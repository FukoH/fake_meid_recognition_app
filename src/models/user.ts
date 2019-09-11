import { Effect } from 'dva';
import { Reducer } from 'redux';

import { query } from '@/services/user';

export interface User {
  account?: string;
  password?: string;
  name?: string;
  role?: string;
  phone?: string;
  organizationId?: string;
}

export interface UserModelState {
  user?: User;
}

export interface UserModel {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
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
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response
      });
    }
  },

  reducers: {
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
