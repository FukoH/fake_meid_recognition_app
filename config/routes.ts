export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/login',
        redirect: '/login/password',
      },
      {
        path: '/login/password',
        component: '../layouts/LoginLayout',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/dashboard/analysis',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './dashboard/analysis/Index',
          },
          {
            path: '/dashboard/list',
            name: 'list',
            component: './dashboard/list/Index',
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
            component: './management/proof/Index',
          },
          {
            path: '/management/account',
            name: 'account',
            component: './management/account/Index',
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
            component: './setting/platform/Index',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
