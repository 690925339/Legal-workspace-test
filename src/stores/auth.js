import { defineStore } from 'pinia'
import { authService, getSupabaseClient } from '@/config/supabase'

/**
 * 认证状态管理 (Pinia Store)
 * 保持与原 authStore 相同的 API 接口
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: true,
    avatarUrl: null,
    title: null
  }),

  getters: {
    currentUser: state => state.user,
    userEmail: state => state.user?.email,
    userId: state => state.user?.id,
    isAuthenticated: state => !!state.session
  },

  actions: {
    setAuth(session) {
      this.session = session
      this.user = session?.user || null
      this.loading = false
    },

    clearAuth() {
      this.session = null
      this.user = null
      this.avatarUrl = null
      this.title = null
      this.loading = false
    },

    setAvatarUrl(url) {
      this.avatarUrl = url
    },

    setTitle(title) {
      this.title = title
    },

    setLoading(loading) {
      this.loading = loading
    },

    async loadUserProfile() {
      if (!this.user?.id) return
      try {
        const supabase = getSupabaseClient()
        if (!supabase) return
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url, title')
          .eq('id', this.user.id)
          .single()
        if (!error && profile) {
          if (profile.avatar_url) this.setAvatarUrl(profile.avatar_url)
          if (profile.title) this.setTitle(profile.title)
        }
      } catch (err) {
        console.error('Failed to load user profile:', err)
      }
    },

    async initialize() {
      try {
        const {
          data: { session }
        } = await authService.getSession()
        this.setAuth(session)
        if (session?.user?.id) {
          await this.loadUserProfile()
        }
      } catch (err) {
        console.error('Auth initialization failed:', err)
        this.setLoading(false)
      }
    },

    async signIn(email, password) {
      const { data, error } = await authService.signIn(email, password)
      if (error) throw error
      this.setAuth(data.session)
      await this.loadUserProfile()
      return data
    },

    async signOut() {
      await authService.signOut()
      this.clearAuth()
    }
  }
})
