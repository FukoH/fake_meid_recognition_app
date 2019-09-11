import { AnyAction, Reducer } from 'redux';
import { parse, stringify } from 'qs';

import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { login } from '@/services/login';

export interface FormData {
  userName: string;
  password: string;
}

export function getPageQuery(): {
  [key: string]: string;
} {
  return parse(window.location.href.split('?')[1]);
}

// export function setAuthority(authority: string | string[]) {
//   const proAuthority = typeof authority === 'string' ? [authority] : authority;
//   return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
// }

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
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // });
      // // Login successfully
      // if (response.status === 'ok') {
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params as { redirect: string };
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = redirect;
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // }
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
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    }
  }
};

export default Model;
