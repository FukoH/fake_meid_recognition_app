import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { query } from '@/services/recognition';
import { ListItem } from './common';

export interface Item {
  identity_no: string;
  disabled?: boolean;
}

export interface QueryParams {}

export interface StateType {
  data: ListItem<Item>;
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
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'recognition',

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
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};

export default Model;
