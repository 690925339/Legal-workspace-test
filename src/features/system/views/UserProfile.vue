<template>
  <div class="smart-page" style="overflow-y: auto">
    <div class="smart-container">
      <div class="smart-header">
        <div class="header-left">
          <h1 class="page-title">个人资料管理</h1>
        </div>
      </div>

      <div class="smart-content" style="max-width: 1000px">
        <div class="profile-layout">
          <!-- Left Sidebar: Profile Card -->
          <div class="profile-sidebar">
            <div class="modern-card profile-card">
              <div class="avatar-wrapper">
                <img v-if="user.avatar" :src="user.avatar" alt="用户头像" />
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user" />
                </div>
                <div class="avatar-overlay" @click="triggerAvatarUpload">更换头像</div>
                <input
                  ref="avatarInput"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="handleAvatarChange"
                />
              </div>
              <h2 class="user-name">
                {{ user.name }}
              </h2>
              <p class="user-title">
                {{ user.title }}
              </p>
              <div class="user-tags">
                <span class="smart-tag">{{ user.department }}</span>
                <span class="smart-tag">{{ user.location }}</span>
              </div>
            </div>

            <div class="modern-card menu-card">
              <div class="menu-list">
                <div
                  :class="['menu-item', { active: activeTab === 'basic' }]"
                  @click="activeTab = 'basic'"
                >
                  <span>基本信息</span>
                  <i class="fas fa-chevron-right" />
                </div>
                <div
                  :class="['menu-item', { active: activeTab === 'security' }]"
                  @click="activeTab = 'security'"
                >
                  <span>账号安全</span>
                  <i class="fas fa-chevron-right" />
                </div>
                <div
                  :class="['menu-item', { active: activeTab === 'preferences' }]"
                  @click="activeTab = 'preferences'"
                >
                  <span>偏好设置</span>
                  <i class="fas fa-chevron-right" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Content -->
          <div class="profile-content">
            <!-- Basic Info Tab -->
            <div v-if="activeTab === 'basic'" class="modern-card">
              <div class="card-header">
                <div class="card-title">基本信息</div>
                <button v-if="!isEditing" class="smart-btn-secondary" @click="isEditing = true">
                  <i class="fas fa-edit" /> 编辑
                </button>
                <div v-else class="edit-actions">
                  <button class="smart-btn-secondary" @click="isEditing = false">取消</button>
                  <button class="smart-btn-primary" @click="saveProfile">保存</button>
                </div>
              </div>
              <div class="card-body">
                <div class="smart-form-grid">
                  <div class="smart-form-group">
                    <label class="smart-label">姓名 <span class="required">*</span></label>
                    <input
                      v-model="user.name"
                      type="text"
                      class="smart-input"
                      :disabled="!isEditing"
                      :class="{ 'has-error': errors.name }"
                      @blur="validateField('name')"
                    />
                    <div v-if="errors.name" class="error-message">
                      <i class="fas fa-exclamation-circle" /> {{ errors.name }}
                    </div>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">职位</label>
                    <input
                      v-model="user.title"
                      type="text"
                      class="smart-input"
                      :disabled="!isEditing"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">邮箱</label>
                    <input
                      v-model="user.email"
                      type="email"
                      class="smart-input"
                      :disabled="!isEditing"
                      :class="{ 'has-error': errors.email }"
                      @blur="validateField('email')"
                    />
                    <div v-if="errors.email" class="error-message">
                      <i class="fas fa-exclamation-circle" /> {{ errors.email }}
                    </div>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">手机号码</label>
                    <input
                      v-model="user.phone"
                      type="text"
                      class="smart-input"
                      :disabled="!isEditing"
                      :class="{ 'has-error': errors.phone }"
                      placeholder="请输入11位手机号"
                      @blur="validateField('phone')"
                    />
                    <div v-if="errors.phone" class="error-message">
                      <i class="fas fa-exclamation-circle" /> {{ errors.phone }}
                    </div>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">所属部门</label>
                    <input
                      v-model="user.department"
                      type="text"
                      class="smart-input"
                      :disabled="!isEditing"
                    />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">办公地点</label>
                    <input
                      v-model="user.location"
                      type="text"
                      class="smart-input"
                      :disabled="!isEditing"
                    />
                  </div>
                  <div class="smart-form-group full-width">
                    <label class="smart-label">个人简介</label>
                    <textarea
                      v-model="user.bio"
                      class="smart-textarea"
                      :disabled="!isEditing"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-if="activeTab === 'security'" class="modern-card">
              <div class="card-header">
                <div class="card-title">修改密码</div>
              </div>
              <div class="card-body">
                <div class="password-form">
                  <div class="smart-form-group">
                    <label class="smart-label">当前密码</label>
                    <input v-model="security.currentPassword" type="password" class="smart-input" />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">新密码</label>
                    <input v-model="security.newPassword" type="password" class="smart-input" />
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">确认新密码</label>
                    <input v-model="security.confirmPassword" type="password" class="smart-input" />
                  </div>
                  <div class="form-actions">
                    <button class="smart-btn-primary" @click="changePassword">修改密码</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preferences Tab -->
            <div v-if="activeTab === 'preferences'" class="modern-card">
              <div class="card-header">
                <div class="card-title">通知设置</div>
              </div>
              <div class="card-body">
                <div class="notification-settings">
                  <label class="checkbox-wrapper">
                    <input v-model="preferences.emailNotifications" type="checkbox" />
                    <div class="checkbox-content">
                      <div class="checkbox-title">邮件通知</div>
                      <div class="checkbox-desc">接收关于案件更新、任务提醒的邮件通知</div>
                    </div>
                  </label>
                  <label class="checkbox-wrapper">
                    <input v-model="preferences.smsNotifications" type="checkbox" />
                    <div class="checkbox-content">
                      <div class="checkbox-title">短信通知</div>
                      <div class="checkbox-desc">接收重要紧急事项的短信提醒</div>
                    </div>
                  </label>
                </div>
              </div>
              <div class="card-header">
                <div class="card-title">系统设置</div>
              </div>
              <div class="card-body">
                <div class="system-settings">
                  <div class="smart-form-group">
                    <label class="smart-label">语言</label>
                    <select v-model="preferences.language" class="smart-select">
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                  <div class="smart-form-group">
                    <label class="smart-label">主题</label>
                    <select v-model="preferences.theme" class="smart-select">
                      <option value="light">浅色模式</option>
                      <option value="dark">深色模式</option>
                      <option value="auto">跟随系统</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="saveSuccess" class="success-toast">
      <i class="fas fa-check-circle" />
      保存成功
    </div>
  </div>
</template>

<script>
import { authService, getSupabaseClient } from '@/config/supabase.js'
import { authStore } from '@/stores/auth.js'

export default {
  name: 'UserProfile',

  data() {
    return {
      activeTab: 'basic',
      user: {
        name: '',
        title: '',
        email: '',
        phone: '',
        department: '',
        location: '',
        bio: '',
        avatar: null
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        theme: 'light',
        language: 'zh-CN'
      },
      isEditing: false,
      saveSuccess: false,
      isLoading: true,
      errors: {
        name: '',
        email: '',
        phone: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },

  async mounted() {
    await this.loadProfile()
  },

  methods: {
    async loadProfile() {
      this.isLoading = true
      try {
        const supabase = getSupabaseClient()
        const userId = authStore.state?.user?.id

        if (!userId) {
          console.error('No user logged in')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('Error loading profile:', error)
          this.user.email = authStore.state.user?.email || ''
          this.user.name = authStore.state.user?.user_metadata?.full_name || ''
          this.user.title = authStore.state.user?.user_metadata?.title || '律师'
        } else if (profile) {
          this.user.name = profile.full_name || ''
          this.user.title = profile.title || ''
          this.user.email = authStore.state.user?.email || ''
          this.user.phone = profile.phone || ''
          this.user.department = profile.department || ''
          this.user.location = profile.location || ''
          this.user.bio = profile.bio || ''
          this.user.avatar = profile.avatar_url || null

          if (profile.avatar_url) {
            authStore.setAvatarUrl(profile.avatar_url)
          }
          if (profile.title) {
            authStore.setTitle(profile.title)
          }

          this.preferences.emailNotifications = profile.email_notifications ?? true
          this.preferences.smsNotifications = profile.sms_notifications ?? false
          this.preferences.theme = profile.theme || 'light'
          this.preferences.language = profile.language || 'zh-CN'
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        this.isLoading = false
      }
    },

    async saveProfile() {
      if (!this.validateForm()) {
        return
      }

      try {
        const supabase = getSupabaseClient()
        const userId = authStore.state?.user?.id

        if (!userId) {
          alert('用户未登录')
          return
        }

        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: this.user.name,
          title: this.user.title,
          phone: this.user.phone,
          department: this.user.department,
          location: this.user.location,
          bio: this.user.bio,
          email_notifications: this.preferences.emailNotifications,
          sms_notifications: this.preferences.smsNotifications,
          theme: this.preferences.theme,
          language: this.preferences.language
        })

        if (profileError) {
          console.error('Error updating profile:', profileError)
          alert('保存失败，请重试')
          return
        }

        const { error: authError } = await authService.updateUser({
          data: {
            full_name: this.user.name,
            title: this.user.title
          }
        })

        if (authError) {
          console.error('Error updating user metadata:', authError)
        }

        if (authStore.state.user) {
          authStore.state.user.user_metadata = {
            ...authStore.state.user.user_metadata,
            full_name: this.user.name,
            title: this.user.title
          }
        }

        authStore.setTitle(this.user.title)

        this.saveSuccess = true
        setTimeout(() => {
          this.saveSuccess = false
          this.isEditing = false
        }, 2000)
      } catch (err) {
        console.error('Failed to save profile:', err)
        alert('保存失败，请重试')
      }
    },

    async changePassword() {
      if (this.security.newPassword !== this.security.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      if (this.security.newPassword.length < 6) {
        alert('密码长度至少为6位')
        return
      }

      try {
        const { error } = await authService.updateUser({
          password: this.security.newPassword
        })

        if (error) {
          console.error('Error changing password:', error)
          alert('密码修改失败: ' + error.message)
          return
        }

        alert('密码修改成功')
        this.security.currentPassword = ''
        this.security.newPassword = ''
        this.security.confirmPassword = ''
      } catch (err) {
        console.error('Failed to change password:', err)
        alert('密码修改失败，请重试')
      }
    },

    triggerAvatarUpload() {
      this.$refs.avatarInput.click()
    },

    async handleAvatarChange(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB')
        return
      }

      try {
        const supabase = getSupabaseClient()
        const userId = authStore.state?.user?.id

        if (!userId) {
          alert('用户未登录')
          return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/avatar.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError)
          alert('头像上传失败: ' + uploadError.message)
          return
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)

        const avatarUrl = urlData.publicUrl

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', userId)

        if (updateError) {
          console.error('Error updating avatar URL:', updateError)
          alert('头像保存失败')
          return
        }

        this.user.avatar = avatarUrl
        authStore.setAvatarUrl(avatarUrl)

        alert('头像上传成功')
      } catch (err) {
        console.error('Failed to upload avatar:', err)
        alert('头像上传失败，请重试')
      }
    },

    validateForm() {
      this.errors = {
        name: '',
        email: '',
        phone: '',
        newPassword: '',
        confirmPassword: ''
      }

      let isValid = true

      if (!this.user.name || this.user.name.trim() === '') {
        this.errors.name = '姓名不能为空'
        isValid = false
      } else if (this.user.name.length > 50) {
        this.errors.name = '姓名长度不能超过50个字符'
        isValid = false
      }

      if (this.user.email && !this.isValidEmail(this.user.email)) {
        this.errors.email = '请输入有效的邮箱地址'
        isValid = false
      }

      if (this.user.phone && !this.isValidPhone(this.user.phone)) {
        this.errors.phone = '请输入有效的手机号码（11位数字）'
        isValid = false
      }

      return isValid
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    isValidPhone(phone) {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(phone)
    },

    validateField(field) {
      switch (field) {
        case 'name':
          if (!this.user.name || this.user.name.trim() === '') {
            this.errors.name = '姓名不能为空'
          } else if (this.user.name.length > 50) {
            this.errors.name = '姓名长度不能超过50个字符'
          } else {
            this.errors.name = ''
          }
          break

        case 'email':
          if (this.user.email && !this.isValidEmail(this.user.email)) {
            this.errors.email = '请输入有效的邮箱地址'
          } else {
            this.errors.email = ''
          }
          break

        case 'phone':
          if (this.user.phone && !this.isValidPhone(this.user.phone)) {
            this.errors.phone = '请输入有效的手机号码（11位数字）'
          } else {
            this.errors.phone = ''
          }
          break
      }
    }
  }
}
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 24px;
}

.profile-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.profile-card {
  text-align: center;
  padding: 32px 20px;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f3f4f6;
  overflow: hidden;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 40px;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 0;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.user-name {
  margin: 0 0 4px;
  font-size: 18px;
  color: #111827;
}

.user-title {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.user-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.menu-card {
  margin-top: 20px;
  padding: 0;
}

.menu-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item span {
  font-size: 14px;
  font-weight: 500;
}

.menu-item i {
  font-size: 12px;
  color: #9ca3af;
}

.menu-item.active {
  background: #f0f9ff;
  color: #0369a1;
}

.profile-content {
  flex: 1;
}

.card-header {
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.smart-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.smart-form-group.full-width {
  grid-column: span 2;
}

.required {
  color: #dc2626;
}

.smart-input.has-error,
.smart-textarea.has-error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

.smart-textarea {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

.password-form,
.system-settings {
  max-width: 400px;
}

.form-actions {
  margin-top: 24px;
}

.notification-settings {
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  cursor: pointer;
}

.checkbox-wrapper input {
  width: 16px;
  height: 16px;
}

.checkbox-title {
  font-weight: 500;
  color: #111827;
}

.checkbox-desc {
  font-size: 13px;
  color: #6b7280;
}

.success-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .smart-form-grid {
    grid-template-columns: 1fr;
  }

  .smart-form-group.full-width {
    grid-column: span 1;
  }
}
</style>
