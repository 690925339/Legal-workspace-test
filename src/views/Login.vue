<template>
  <div class="auth-page">
    <div class="brand-section">
      <div class="brand-pattern"></div>
      <div class="brand-content">
        <div class="brand-logo">
          <div v-if="brand.logoUrl" class="logo-img">
            <img :src="brand.logoUrl" alt="Logo" style="max-height: 48px;">
          </div>
          <div v-else class="logo-box">{{ brand.logoText }}</div>
          <div class="brand-text">
            <div class="brand-name">{{ brand.name }}</div>
            <div class="brand-subtitle">{{ brand.subtitle }}</div>
          </div>
        </div>
        <div class="brand-quote">{{ brand.quote }}</div>
        <div class="brand-desc">
          {{ brand.description }}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <div class="form-title">欢迎回来</div>
          <div class="form-subtitle">请输入您的账号信息以登录</div>
        </div>

        <form @submit.prevent="handleLogin">
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">邮箱地址</label>
            <div class="input-wrapper">
              <i class="far fa-envelope input-icon"></i>
              <input 
                type="email" 
                class="form-input" 
                placeholder="name@company.com"
                v-model="email"
                :disabled="isLoading"
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input 
                type="password" 
                class="form-input" 
                placeholder="请输入密码"
                v-model="password"
                :disabled="isLoading"
                required
              >
            </div>
          </div>

          <div class="form-actions">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" :disabled="isLoading"> 记住我
            </label>
            <a @click.prevent="goToForgotPassword" href="#" class="forgot-password">忘记密码？</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span v-if="!isLoading">登录</span>
            <span v-else><i class="fas fa-spinner fa-spin"></i> 登录中...</span>
          </button>
        </form>

        <div class="form-footer">
          还没有账号？ <a @click.prevent="goToRegister" href="#">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { router } from '../router.js'
import { authService, brandService } from '../config/supabase.js'
import { authStore } from '../store/authStore.js'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      isLoading: false,
      errorMessage: '',
      // 品牌设置
      brand: {
        name: 'ALPHA&LEADER',
        subtitle: '安华理达',
        slogan: 'AI 法律工作空间',
        quote: '"迟来的正义即非正义"',
        description: '体验 AI 驱动的法律工作空间，简化案件管理，智能分析文档，专注于最重要的事情。',
        logoUrl: '',
        logoText: 'LOGO'
      }
    }
  },
  async mounted() {
    await this.loadBrandSettings()
  },
  methods: {
    async loadBrandSettings() {
      const { data } = await brandService.getBrandSettings()
      if (data) {
        this.brand.name = data.brand_name || this.brand.name
        this.brand.subtitle = data.brand_subtitle || this.brand.subtitle
        this.brand.slogan = data.brand_slogan || this.brand.slogan
        this.brand.quote = data.brand_quote || this.brand.quote
        this.brand.description = data.brand_description || this.brand.description
        this.brand.logoUrl = data.logo_url || ''
        this.brand.logoText = data.logo_text || 'LOGO'
      }
    },
    async handleLogin() {
      console.log('[Login] handleLogin called')
      if (!this.email || !this.password) {
        this.errorMessage = '请输入邮箱和密码'
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        console.log('[Login] Calling authService.signIn...')
        const { data, error } = await authService.signIn(this.email, this.password)
        console.log('[Login] signIn response:', { data, error })

        if (error) {
          console.error('[Login] Error:', error)
          if (error.message.includes('Invalid login credentials')) {
            this.errorMessage = '邮箱或密码错误'
          } else if (error.message.includes('Email not confirmed')) {
            this.errorMessage = '请先验证您的邮箱'
          } else {
            this.errorMessage = error.message || '登录失败，请重试'
          }
          return
        }

        console.log('[Login] data.user:', data?.user)
        console.log('[Login] data.session:', data?.session)

        if (data.user && data.session) {
          console.log('[Login] Login successful! Updating authStore...')
          authStore.setAuth(data.session)
          console.log('[Login] authStore updated. Navigating to /...')
          router.push('/')
          console.log('[Login] Navigation called.')
        } else {
          console.log('[Login] Missing user or session in response')
        }
      } catch (err) {
        console.error('[Login] Unexpected error:', err)
        this.errorMessage = '登录失败，请检查网络连接'
      } finally {
        this.isLoading = false
      }
    },
    goToForgotPassword() {
      router.push('/forgot-password')
    },
    goToRegister() {
      router.push('/register')
    }
  }
}
</script>

<style scoped>
.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 14px;
  margin-bottom: 16px;
}
</style>
