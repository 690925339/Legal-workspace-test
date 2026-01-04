import { createRouter, createWebHashHistory } from 'vue-router'
import { setupGuards } from './guards'

// 导入模块化路由
import caseRoutes from './modules/case'
import authRoutes from './modules/auth'
import legalResearchRoutes from './modules/legal-research'
import systemRoutes from './modules/system'

const routes = [
  // 需要认证的路由 - 使用 AppLayout
  {
    path: '/',
    component: () => import('@layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'CaseList',
        component: () => import('@/features/case/views/CaseList.vue'),
        meta: { title: '案件列表' }
      },
      // 案件相关路由
      ...caseRoutes,
      // 法律检索路由
      ...legalResearchRoutes,
      // 系统路由
      ...systemRoutes
    ]
  },

  // 认证相关路由 (无需登录，不使用 Layout)
  ...authRoutes,

  // 404 处理
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 注册路由守卫
setupGuards(router)

export { router }
export default router

