
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'history', component: () => import('pages/HistoryPage.vue') },
      { path: 'export', component: () => import('pages/ExportPage.vue') },
      { path: 'config', component: () => import('pages/ConfigPage.vue') },
      { path: 'status', component: () => import('pages/StatusPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
