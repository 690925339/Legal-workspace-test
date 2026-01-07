import { reactive, computed } from 'vue'
import { authService, getSupabaseClient } from '@/config/supabase'

/**
 * 认证状态管理 (Pinia-like 响应式 Store)
 * 与原 authStore 保持 API 兼容
 */
const state = reactive({
  user: null,
  session: null,
  loading: true,
  avatarUrl: null,
  title: null
})

export const useAuthStore = () => {
  // Getters

  const currentUser = computed(() => state.user)
  const userEmail = computed(() => state.user?.email)
  const userId = computed(() => state.user?.id)

  // Actions
  function setAuth(session) {
    state.session = session
    state.user = session?.user || null
    state.loading = false
  }

  function clearAuth() {
    state.session = null
    state.user = null
    state.avatarUrl = null
    state.title = null
    state.loading = false
  }

  function setAvatarUrl(url) {
    state.avatarUrl = url
  }

  function setTitle(title) {
    state.title = title
  }

  function setLoading(loading) {
    state.loading = loading
  }

  async function loadUserProfile() {
    if (!state.user?.id) return

    try {
      const supabase = getSupabaseClient()
      if (!supabase) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('avatar_url, title')
        .eq('id', state.user.id)
        .single()

      if (!error && profile) {
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url)
        }
        if (profile.title) {
          setTitle(profile.title)
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  async function initialize() {
    try {
      const {
        data: { session }
      } = await authService.getSession()
      setAuth(session)

      if (session?.user?.id) {
        await loadUserProfile()
      }
    } catch (err) {
      console.error('Auth initialization failed:', err)
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    const { data, error } = await authService.signIn(email, password)
    if (error) throw error
    setAuth(data.session)
    await loadUserProfile()
    return data
  }

  async function signOut() {
    await authService.signOut()
    clearAuth()
  }

  return {
    // State (响应式)
    state,

    // Getters

    currentUser,
    userEmail,
    userId,

    // Legacy API 兼容
    get user() {
      return state.user
    },
    get session() {
      return state.session
    },
    get loading() {
      return state.loading
    },
    get avatarUrl() {
      return state.avatarUrl
    },
    get title() {
      return state.title
    },

    // Actions
    setAuth,
    clearAuth,
    setAvatarUrl,
    setTitle,
    setLoading,
    loadUserProfile,
    initialize,
    signIn,
    signOut,

    // 兼容旧 API
    isAuthenticated: () => !!state.session
  }
}

// 创建单例，保持向后兼容
export const authStore = useAuthStore()

export default authStore
