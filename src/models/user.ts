import { Effect } from "dva";
import { Reducer } from "redux";

import { query, batchRemove, add, update, remove, find } from "@/services/user";
import { ListItem } from "@/models/common.d";

export interface QueryParams {
  page?: number;
  pageSize?: number;
}

export interface StateType {
  data: ListItem<Item>;
}

export interface Item {
  id?: string;
  account?: string;
  password?: string;
  name?: string;
  role?: number;
  phone?: string;
  organizationId?: string;
  organizationName?: string;
  disabled?: boolean;
}

export interface UserModelState {
  user?: Item;
}

export interface UserModel {
  namespace: "user";
  state: UserModelState;
  effects: {
    fetch: Effect;
    batchRemove: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
    find: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModel = {
  namespace: "user",

  state: {
    user: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
      if (callback) callback(response);
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
    },
    *batchRemove({ payload, callback }, { call, put }) {
      const response = yield call(batchRemove, payload);
      yield put({
        type: "save",
        payload: response || {}
      });
      if (callback) callback(response);
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
