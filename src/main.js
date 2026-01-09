// SCSS 主文件
import './styles/main.scss'

// CSS 导入
import '../assets/styles/main.css'
import '../assets/styles/brand.css'
import '../assets/styles/evidence.css'

// Vue 和核心依赖
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import { useAuthStore } from './stores/auth'
import { authService } from './config/supabase'

// 全局组件
import HistoryModal from './components/HistoryModal.vue'

// 根组件
const App = {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  template: `
    <div id="app">
      <!-- 认证加载中 -->
      <div v-if="authStore.loading" class="loading-container">
        <i class="fas fa-spinner fa-spin loading-icon"></i>
        <p class="loading-text">加载中...</p>
      </div>
      
      <!-- 应用内容 -->
      <router-view v-else />
    </div>
  `
}

// 初始化应用
async function initApp() {
  // 创建应用实例
  const pinia = createPinia()
  const app = createApp(App)

  // 安装插件
  app.use(pinia)
  app.use(router)

  // 注册全局组件
  app.component('HistoryModal', HistoryModal)

  // 先挂载应用 (确保页面立即显示 Loading 状态，不会因网络问题白屏)
  app.mount('#app')

  // 获取 store 实例 (必须在 app.use(pinia) 之后)
  const authStore = useAuthStore()

  // 异步初始化认证状态 (不阻塞渲染)
  try {
    await authStore.initialize()
    console.log('Auth state initialized:', authStore.user?.email)
  } catch (err) {
    console.error('Auth initialization failed, continuing with unauthenticated state:', err)
    authStore.setLoading(false) // 确保 loading 状态被清除
  }

  // 监听认证状态变化
  authService.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, session?.user?.email)

    if (event === 'SIGNED_IN') {
      authStore.setAuth(session)
      authStore.loadUserProfile()

      // 只有在登录页面时才跳转到首页
      const currentPath = router.currentRoute.value.path
      if (currentPath === '/login' || currentPath === '/register') {
        const redirect = router.currentRoute.value.query.redirect || '/'
        router.push(redirect)
      }
    } else if (event === 'SIGNED_OUT') {
      authStore.clearAuth()
      router.push('/login')
    } else if (event === 'TOKEN_REFRESHED') {
      authStore.setAuth(session)
    } else if (event === 'INITIAL_SESSION') {
      authStore.setAuth(session)
      if (session?.user?.id) {
        authStore.loadUserProfile()
      }
    }
  })
}

// 启动应用
initApp().catch(err => {
  console.error('Failed to initialize app:', err)
})
