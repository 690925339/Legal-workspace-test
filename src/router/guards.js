import { authStore } from '@/stores/auth.js'

/**
 * 路由守卫配置
 */
export function setupGuards(router) {
  // 全局前置守卫 - 认证检查
  router.beforeEach(async (to, from, next) => {
    // 确保认证状态已初始化
    if (authStore.loading) {
      await authStore.initialize()
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthPage = to.path === '/login' || to.path === '/register' || to.path === '/forgot-password'

    if (requiresAuth && !authStore.isAuthenticated()) {
      // 未登录，跳转到登录页
      console.log('Auth required but not authenticated, redirecting to login')
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else if (isAuthPage && authStore.isAuthenticated()) {
      // 已登录但访问认证页，跳转到首页
      console.log('Already authenticated, redirecting to home')
      next('/')
    } else {
      next()
    }
  })

  // 全局后置守卫 - 页面标题
  router.afterEach((to) => {
    document.title = to.meta.title
      ? `${to.meta.title} - AI法律助手`
      : 'AI法律助手'
  })
}

export default setupGuards

