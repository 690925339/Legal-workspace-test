/**
 * 认证模块路由
 */
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/views/Register.vue'),
    meta: { requiresAuth: false, title: '注册' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/features/auth/views/ForgotPassword.vue'),
    meta: { requiresAuth: false, title: '忘记密码' }
  }
]


