<template>
  <div class="auth-page">
    <div class="brand-section">
      <div class="brand-pattern" />
      <div class="brand-content">
        <div class="brand-logo">
          <div
            v-if="brand.logoUrl"
            class="logo-img"
          >
            <img
              :src="brand.logoUrl"
              alt="Logo"
              style="max-height: 48px;"
            >
          </div>
          <div
            v-else
            class="logo-box"
          >
            {{ brand.logoText }}
          </div>
          <div class="brand-text">
            <div class="brand-name">
              {{ brand.name }}
            </div>
            <div class="brand-subtitle">
              {{ brand.subtitle }}
            </div>
          </div>
        </div>
        <div class="brand-quote">
          {{ brand.quote }}
        </div>
        <div class="brand-desc">
          {{ brand.description }}
        </div>
      </div>
    </div>

    <div class="form-section">
      <div class="form-container">
        <div class="form-header">
          <div class="form-title">
            忘记密码
          </div>
          <div class="form-subtitle">
            输入您的邮箱以重置密码
          </div>
        </div>

        <form @submit.prevent="handleResetPassword">
          <!-- 错误提示 -->
          <div
            v-if="errorMessage"
            class="error-message"
          >
            <i class="fas fa-exclamation-circle" /> {{ errorMessage }}
          </div>

          <!-- 成功提示 -->
          <div
            v-if="successMessage"
            class="success-message"
          >
            <i class="fas fa-check-circle" /> {{ successMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">邮箱地址</label>
            <div class="input-wrapper">
              <i class="far fa-envelope input-icon" />
              <input 
                v-model="email" 
                type="email" 
                class="form-input"
                placeholder="name@company.com"
                :disabled="isLoading"
                required
              >
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">发送重置链接</span>
            <span v-else><i class="fas fa-spinner fa-spin" /> 发送中...</span>
          </button>
        </form>

        <div class="form-footer">
          <a
            href="#"
            @click.prevent="goToLogin"
          >
            <i class="fas fa-arrow-left" /> 返回登录
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { router } from '../router.js'
import { authService, brandService } from '../config/supabase.js'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      brand: {
        name: 'ALPHA&LEADER',
        subtitle: '安华理达',
        quote: '"重置密码，重新开始"',
        description: '输入您的邮箱地址，我们将向您发送密码重置链接。',
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
        this.brand.logoUrl = data.logo_url || ''
        this.brand.logoText = data.logo_text || 'LOGO'
      }
    },
    async handleResetPassword() {
      if (!this.email) {
        this.errorMessage = '请输入您的邮箱地址'
        return
      }

      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const { data, error } = await authService.resetPassword(this.email)

        if (error) {
          console.error('Password reset error:', error)
          this.errorMessage = error.message || '发送重置邮件失败，请重试'
          return
        }

        this.successMessage = '密码重置邮件已发送！请查收您的邮箱并按照邮件中的说明重置密码。'
        this.email = ''
      } catch (err) {
        console.error('Unexpected error:', err)
        this.errorMessage = '发送失败，请检查网络连接'
      } finally {
        this.isLoading = false
      }
    },
    goToLogin() {
      router.push('/login')
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

.success-message {
  padding: 12px;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 6px;
  color: #3c3;
  font-size: 14px;
  margin-bottom: 16px;
}
</style>
