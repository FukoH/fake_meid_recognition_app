import { AnyAction, Reducer } from 'redux';
import { parse, stringify } from 'qs';

import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { login } from '@/services/login';
import { setAuthority } from '@/utils/authority';

export interface FormData {
  userName: string;
  password: string;
}
export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export function getPageQuery(): {
  [key: string]: string;
} {
  return parse(window.location.href.split('?')[1]);
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T }
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'login',
  state: {
    status: undefined
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // 登陆成功
      if (response.success) {
        // 跳转路由
        yield put(routerRedux.replace('/'));
      }
    },

    *logout(_, { put }) {
      // const { redirect } = getPageQuery();
      // // redirect
      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   yield put(
      //     routerRedux.replace({
      //       pathname: '/user/login',
      //       search: stringify({
      //         redirect: window.location.href,
      //       }),
      //     }),
      //   );
      // }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // 根据角色权限设置，1：管理员，2：经销商
      setAuthority(payload.data.role === "1" ? 'admin' : 'user');
      // 存储当前用户数据信息
      localStorage.setItem('currentUser', JSON.stringify(payload.data));
      return {
        ...state,
        status: payload.success ? 'ok' : 'error',
      };
    }
  }
};

export default Model;
