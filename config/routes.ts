export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/login',
        redirect: '/login/password'
      },
      {
        path: '/login/password',
        component: '../layouts/LoginLayout'
      }
    ]
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/dashboard/analysis'
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
                authority: ['admin', 'user'],
              },
              {
                path: '/dashboard/list',
                name: 'list',
                component: './dashboard/list/Index'
              }
            ]
          },
          {
            path: '/management',
            name: 'management',
            icon: 'database',
            routes: [
              {
                path: '/management/credential',
                name: 'credential',
                component: './management/credential/Index'
              },
              {
                path: '/management/account',
                name: 'account',
                component: './management/account/Index'
              }
            ]
          },
          {
            path: '/setting',
            name: 'setting',
            icon: 'setting',
            routes: [
              {
                path: '/setting/platform',
                name: 'platform',
                component: './setting/platform/Index'
              }
            ]
          },
          {
            component: './404'
          }
        ]
      },
    ]},
  {
    component: './404'
  }
];
