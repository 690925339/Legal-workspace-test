import { router } from '../router.js';

export default {
    name: 'UserProfile',
    components: {
    },
    data() {
        return {
            activeTab: 'basic',
            user: {
                name: '李律师',
                title: '高级合伙人',
                email: 'li.lawyer@alpha-leader.com',
                phone: '13800138000',
                department: '诉讼部',
                location: '上海办公室',
                bio: '专注于商事诉讼与仲裁，拥有超过10年的执业经验。',
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
            saveSuccess: false
        };
    },
    methods: {
        saveProfile() {
            // Simulate API call
            this.saveSuccess = true;
            setTimeout(() => {
                this.saveSuccess = false;
                this.isEditing = false;
            }, 2000);
        },
        changePassword() {
            if (this.security.newPassword !== this.security.confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }
            alert('密码修改成功');
            this.security.currentPassword = '';
            this.security.newPassword = '';
            this.security.confirmPassword = '';
        },
        triggerAvatarUpload() {
            this.$refs.avatarInput.click();
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.user.avatar = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    },
    template: `
        <div class="smart-page" style="overflow-y: auto;">
            <div class="smart-container">
                <div class="smart-header">
                    <div class="header-left">
                        <div class="smart-breadcrumb">
                            <span class="breadcrumb-item">工作台</span>
                            <i class="fas fa-chevron-right separator"></i>
                            <span class="breadcrumb-item active">个人资料</span>
                        </div>
                        <h1 class="page-title">个人资料管理</h1>
                    </div>
                </div>

                <div class="smart-content" style="max-width: 1000px;">
                    <div style="display: flex; gap: 24px;">
                        <!-- Left Sidebar: Profile Card -->
                        <div style="width: 300px; flex-shrink: 0;">
                            <div class="modern-card" style="text-align: center; padding: 32px 20px;">
                                <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 16px; border-radius: 50%; background: #f3f4f6; overflow: hidden; group: hover;">
                                    <img v-if="user.avatar" :src="user.avatar" style="width: 100%; height: 100%; object-fit: cover;">
                                    <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 40px;">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div @click="triggerAvatarUpload" style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.5); color: white; padding: 4px 0; font-size: 12px; cursor: pointer; opacity: 0; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                                        更换头像
                                    </div>
                                    <input type="file" ref="avatarInput" @change="handleAvatarChange" style="display: none;" accept="image/*">
                                </div>
                                <h2 style="margin: 0 0 4px; font-size: 18px; color: #111827;">{{ user.name }}</h2>
                                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">{{ user.title }}</p>
                                <div style="display: flex; justify-content: center; gap: 8px;">
                                    <span class="smart-tag">{{ user.department }}</span>
                                    <span class="smart-tag">{{ user.location }}</span>
                                </div>
                            </div>

                            <div class="modern-card" style="margin-top: 20px; padding: 0;">
                                <div class="menu-list">
                                    <div :class="['menu-item', { active: activeTab === 'basic' }]" @click="activeTab = 'basic'" style="padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 500;">基本信息</span>
                                        <i class="fas fa-chevron-right" style="font-size: 12px; color: #9ca3af;"></i>
                                    </div>
                                    <div :class="['menu-item', { active: activeTab === 'security' }]" @click="activeTab = 'security'" style="padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 500;">账号安全</span>
                                        <i class="fas fa-chevron-right" style="font-size: 12px; color: #9ca3af;"></i>
                                    </div>
                                    <div :class="['menu-item', { active: activeTab === 'preferences' }]" @click="activeTab = 'preferences'" style="padding: 16px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 500;">偏好设置</span>
                                        <i class="fas fa-chevron-right" style="font-size: 12px; color: #9ca3af;"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Content -->
                        <div style="flex: 1;">
                            <!-- Basic Info Tab -->
                            <div v-if="activeTab === 'basic'" class="modern-card">
                                <div class="card-header">
                                    <div class="card-title">基本信息</div>
                                    <button v-if="!isEditing" class="smart-btn-secondary" @click="isEditing = true">
                                        <i class="fas fa-edit"></i> 编辑
                                    </button>
                                    <div v-else style="display: flex; gap: 8px;">
                                        <button class="smart-btn-secondary" @click="isEditing = false">取消</button>
                                        <button class="smart-btn-primary" @click="saveProfile">保存</button>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="smart-form-grid">
                                        <div class="smart-form-group">
                                            <label class="smart-label">姓名</label>
                                            <input type="text" class="smart-input" v-model="user.name" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">职位</label>
                                            <input type="text" class="smart-input" v-model="user.title" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">邮箱</label>
                                            <input type="email" class="smart-input" v-model="user.email" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">手机号码</label>
                                            <input type="text" class="smart-input" v-model="user.phone" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">所属部门</label>
                                            <input type="text" class="smart-input" v-model="user.department" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">办公地点</label>
                                            <input type="text" class="smart-input" v-model="user.location" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group" style="grid-column: span 2;">
                                            <label class="smart-label">个人简介</label>
                                            <textarea class="smart-textarea" v-model="user.bio" :disabled="!isEditing" rows="4"></textarea>
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
                                    <div class="smart-form-group" style="max-width: 400px;">
                                        <label class="smart-label">当前密码</label>
                                        <input type="password" class="smart-input" v-model="security.currentPassword">
                                    </div>
                                    <div class="smart-form-group" style="max-width: 400px;">
                                        <label class="smart-label">新密码</label>
                                        <input type="password" class="smart-input" v-model="security.newPassword">
                                    </div>
                                    <div class="smart-form-group" style="max-width: 400px;">
                                        <label class="smart-label">确认新密码</label>
                                        <input type="password" class="smart-input" v-model="security.confirmPassword">
                                    </div>
                                    <div style="margin-top: 24px;">
                                        <button class="smart-btn-primary" @click="changePassword">修改密码</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Preferences Tab -->
                            <div v-if="activeTab === 'preferences'" class="modern-card">
                                <div class="card-header">
                                    <div class="card-title">通知设置</div>
                                </div>
                                <div class="card-body">
                                    <div style="margin-bottom: 24px;">
                                        <label class="smart-checkbox-wrapper" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; cursor: pointer;">
                                            <input type="checkbox" v-model="preferences.emailNotifications" style="width: 16px; height: 16px;">
                                            <div>
                                                <div style="font-weight: 500; color: #111827;">邮件通知</div>
                                                <div style="font-size: 13px; color: #6b7280;">接收关于案件更新、任务提醒的邮件通知</div>
                                            </div>
                                        </label>
                                        <label class="smart-checkbox-wrapper" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                                            <input type="checkbox" v-model="preferences.smsNotifications" style="width: 16px; height: 16px;">
                                            <div>
                                                <div style="font-weight: 500; color: #111827;">短信通知</div>
                                                <div style="font-size: 13px; color: #6b7280;">接收重要紧急事项的短信提醒</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div class="card-header" style="border-top: 1px solid #f3f4f6; margin-top: 0;">
                                    <div class="card-title">系统设置</div>
                                </div>
                                <div class="card-body">
                                    <div class="smart-form-group" style="max-width: 400px;">
                                        <label class="smart-label">语言</label>
                                        <select class="smart-select" v-model="preferences.language">
                                            <option value="zh-CN">简体中文</option>
                                            <option value="en-US">English</option>
                                        </select>
                                    </div>
                                    <div class="smart-form-group" style="max-width: 400px;">
                                        <label class="smart-label">主题</label>
                                        <select class="smart-select" v-model="preferences.theme">
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

            <!-- Success Toast -->
            <div v-if="saveSuccess" style="position: fixed; top: 24px; right: 24px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; gap: 8px; animation: slideIn 0.3s ease-out;">
                <i class="fas fa-check-circle"></i>
                保存成功
            </div>
        </div>
    `
};
