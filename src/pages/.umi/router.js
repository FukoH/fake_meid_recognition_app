import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/icourt/Documents/project/fake_registration_recognition_app/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/login',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/login',
        redirect: '/login/password',
        exact: true,
      },
      {
        path: '/login/password',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__LoginLayout" */ '../../layouts/LoginLayout'),
              LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/LoginLayout').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/dashboard/analysis',
        exact: true,
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__dashboard__analysis__Index" */ '../dashboard/analysis/Index'),
                  LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                    .default,
                })
              : require('../dashboard/analysis/Index').default,
            exact: true,
          },
          {
            path: '/dashboard/list',
            name: 'list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__dashboard__list__Index" */ '../dashboard/list/Index'),
                  LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                    .default,
                })
              : require('../dashboard/list/Index').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/management',
        name: 'management',
        icon: 'database',
        routes: [
          {
            path: '/management/proof',
            name: 'proof',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__management__proof__Index" */ '../management/proof/Index'),
                  LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                    .default,
                })
              : require('../management/proof/Index').default,
            exact: true,
          },
          {
            path: '/management/account',
            name: 'account',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__management__account__Index" */ '../management/account/Index'),
                  LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                    .default,
                })
              : require('../management/account/Index').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/setting',
        name: 'setting',
        icon: 'setting',
        routes: [
          {
            path: '/setting/platform',
            name: 'platform',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__setting__platform__Index" */ '../setting/platform/Index'),
                  LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                    .default,
                })
              : require('../setting/platform/Index').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('/Users/icourt/Documents/project/fake_registration_recognition_app/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('/Users/icourt/Documents/project/fake_registration_recognition_app/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
