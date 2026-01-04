<template>
  <div class="settings-page">
    <header class="settings-header">
      <h1>个人设置</h1>
      <p>管理您的个人信息和账户偏好</p>
    </header>

    <div class="settings-card">
      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img v-if="user.avatar" :src="user.avatar" alt="用户头像" />
          <i v-else class="fas fa-user"></i>
        </div>
        <div class="avatar-actions">
          <h3>头像</h3>
          <div class="action-buttons">
            <label class="smart-btn-secondary">
              更换头像
              <input 
                type="file" 
                @change="handleAvatarChange" 
                accept="image/*" 
                style="display: none;"
              />
            </label>
            <button 
              v-if="user.avatar" 
              @click="user.avatar = null" 
              class="text-btn danger"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- Basic Info -->
      <div class="form-grid">
        <div class="form-group">
          <label>姓名</label>
          <input v-model="user.name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>角色</label>
          <select v-model="user.role" class="form-select">
            <option v-for="role in roles" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="user.email" type="email" class="form-input" />
        </div>
        <div class="form-group">
          <label>手机号码</label>
          <input v-model="user.phone" type="tel" class="form-input" />
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button 
          @click="saveSettings" 
          class="smart-btn-primary" 
          :disabled="isSaving"
        >
          <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
          <span v-else>保存更改</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  
  data() {
    return {
      user: {
        name: '李律师',
        role: 'Senior Partner',
        roleText: '高级合伙人',
        email: 'li.lawyer@alpha-leader.com',
        phone: '13800138000',
        avatar: null
      },
      roles: [
        { value: 'Senior Partner', label: '高级合伙人' },
        { value: 'Partner', label: '合伙人' },
        { value: 'Associate', label: '主办律师' },
        { value: 'Paralegal', label: '律师助理' }
      ],
      isSaving: false
    }
  },
  
  methods: {
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.user.avatar = URL.createObjectURL(file)
      }
    },
    
    saveSettings() {
      this.isSaving = true
      setTimeout(() => {
        this.isSaving = false
        alert('设置已保存')
        const selectedRole = this.roles.find(r => r.value === this.user.role)
        if (selectedRole) {
          this.user.roleText = selectedRole.label
        }
      }, 800)
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 40px;
}

.settings-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.settings-header p {
  color: #666;
  margin: 0;
}

.settings-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  padding: 32px;
}

.avatar-section {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #e5e5e5;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-preview i {
  font-size: 32px;
  color: #9ca3af;
}

.avatar-actions h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.text-btn.danger {
  color: #dc2626;
  background: none;
  border: none;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary, #1a73e8);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.form-actions {
  border-top: 1px solid #e5e5e5;
  padding-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.smart-btn-primary {
  min-width: 100px;
}

@media (max-width: 640px) {
  .settings-page {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
