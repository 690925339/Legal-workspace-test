/**
 * 系统模块路由
 * 注意：这些路由是嵌套在 AppLayout 下的，路径是相对路径
 */
export default [
  {
    path: 'profile',
    name: 'UserProfile',
    component: () => import('@/features/system/views/UserProfile.vue'),
    meta: { title: '个人资料' }
  },
  {
    path: 'settings',
    name: 'Settings',
    component: () => import('@/features/system/views/Settings.vue'),
    meta: { title: '系统设置' }
  },
  {
    path: 'feedback',
    name: 'ProductFeedback',
    component: () => import('@/features/system/views/ProductFeedback.vue'),
    meta: { title: '产品反馈' }
  }
]
