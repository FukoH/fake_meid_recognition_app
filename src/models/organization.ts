import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { query } from '@/services/organization';
import { ListItem } from './common';

export interface Organization {
  id: string;
  name: string;
  collaborateTerm: string;
  contactor: string;
  phone: string;
  province: string;
  city: string;
  collaborateStart: string;
  collaborateEnd: string;
}

export interface QueryParams {
  name?: string;
}

export interface StateType {
  data: ListItem<Organization>;
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
  namespace: 'organization',

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
