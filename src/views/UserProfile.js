import { router } from '../router.js';
import { authService, getSupabaseClient } from '../config/supabase.js';
import { authStore } from '../store/authStore.js';

export default {
    name: 'UserProfile',
    components: {
    },
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
            authStore,
            // 表单验证错误
            errors: {
                name: '',
                email: '',
                phone: '',
                newPassword: '',
                confirmPassword: ''
            }
        };
    },
    async mounted() {
        await this.loadProfile();
    },
    methods: {
        async loadProfile() {
            this.isLoading = true;
            try {
                const supabase = getSupabaseClient();
                const userId = authStore.user?.id;

                if (!userId) {
                    console.error('No user logged in');
                    return;
                }

                // 从 profiles 表加载用户资料
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error('Error loading profile:', error);
                    // 如果 profile 不存在，使用默认值
                    this.user.email = authStore.user?.email || '';
                    this.user.name = authStore.user?.user_metadata?.full_name || '';
                    this.user.title = authStore.user?.user_metadata?.title || '律师';
                } else if (profile) {
                    this.user.name = profile.full_name || '';
                    this.user.title = profile.title || '';
                    this.user.email = authStore.user?.email || '';
                    this.user.phone = profile.phone || '';
                    this.user.department = profile.department || '';
                    this.user.location = profile.location || '';
                    this.user.bio = profile.bio || '';
                    this.user.avatar = profile.avatar_url || null;

                    // 加载偏好设置
                    this.preferences.emailNotifications = profile.email_notifications ?? true;
                    this.preferences.smsNotifications = profile.sms_notifications ?? false;
                    this.preferences.theme = profile.theme || 'light';
                    this.preferences.language = profile.language || 'zh-CN';
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                this.isLoading = false;
            }
        },

        async saveProfile() {
            // 验证表单
            if (!this.validateForm()) {
                return;
            }

            try {
                const supabase = getSupabaseClient();
                const userId = authStore.user?.id;

                if (!userId) {
                    alert('用户未登录');
                    return;
                }

                // 更新 profiles 表
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
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
                    });

                if (profileError) {
                    console.error('Error updating profile:', profileError);
                    alert('保存失败，请重试');
                    return;
                }

                // 同步更新 auth.users 的 user_metadata（用于侧边栏显示）
                const { error: authError } = await authService.updateUser({
                    data: {
                        full_name: this.user.name,
                        title: this.user.title
                    }
                });

                if (authError) {
                    console.error('Error updating user metadata:', authError);
                }

                // 更新本地 authStore
                if (authStore.user) {
                    authStore.user.user_metadata = {
                        ...authStore.user.user_metadata,
                        full_name: this.user.name,
                        title: this.user.title
                    };
                }

                this.saveSuccess = true;
                setTimeout(() => {
                    this.saveSuccess = false;
                    this.isEditing = false;
                }, 2000);
            } catch (err) {
                console.error('Failed to save profile:', err);
                alert('保存失败，请重试');
            }
        },

        async changePassword() {
            if (this.security.newPassword !== this.security.confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }

            if (this.security.newPassword.length < 6) {
                alert('密码长度至少为6位');
                return;
            }

            try {
                const { error } = await authService.updateUser({
                    password: this.security.newPassword
                });

                if (error) {
                    console.error('Error changing password:', error);
                    alert('密码修改失败: ' + error.message);
                    return;
                }

                alert('密码修改成功');
                this.security.currentPassword = '';
                this.security.newPassword = '';
                this.security.confirmPassword = '';
            } catch (err) {
                console.error('Failed to change password:', err);
                alert('密码修改失败，请重试');
            }
        },

        triggerAvatarUpload() {
            this.$refs.avatarInput.click();
        },

        async handleAvatarChange(event) {
            const file = event.target.files[0];
            if (!file) return;

            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }

            // 验证文件大小（最大 2MB）
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB');
                return;
            }

            try {
                const supabase = getSupabaseClient();
                const userId = authStore.user?.id;

                if (!userId) {
                    alert('用户未登录');
                    return;
                }

                // 生成唯一文件名
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/avatar.${fileExt}`;

                // 上传到 Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: true  // 覆盖已存在的文件
                    });

                if (uploadError) {
                    console.error('Error uploading avatar:', uploadError);
                    alert('头像上传失败: ' + uploadError.message);
                    return;
                }

                // 获取公开 URL
                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                const avatarUrl = urlData.publicUrl;

                // 更新 profiles 表中的 avatar_url
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: avatarUrl })
                    .eq('id', userId);

                if (updateError) {
                    console.error('Error updating avatar URL:', updateError);
                    alert('头像保存失败');
                    return;
                }

                // 更新本地显示
                this.user.avatar = avatarUrl;
                alert('头像上传成功');
            } catch (err) {
                console.error('Failed to upload avatar:', err);
                alert('头像上传失败，请重试');
            }
        },

        // ========== 表单验证方法 ==========
        validateForm() {
            // 清空之前的错误
            this.errors = {
                name: '',
                email: '',
                phone: '',
                newPassword: '',
                confirmPassword: ''
            };

            let isValid = true;

            // 验证姓名
            if (!this.user.name || this.user.name.trim() === '') {
                this.errors.name = '姓名不能为空';
                isValid = false;
            } else if (this.user.name.length > 50) {
                this.errors.name = '姓名长度不能超过50个字符';
                isValid = false;
            }

            // 验证邮箱格式（如果填写了）
            if (this.user.email && !this.isValidEmail(this.user.email)) {
                this.errors.email = '请输入有效的邮箱地址';
                isValid = false;
            }

            // 验证手机号格式（如果填写了）
            if (this.user.phone && !this.isValidPhone(this.user.phone)) {
                this.errors.phone = '请输入有效的手机号码（11位数字）';
                isValid = false;
            }

            return isValid;
        },

        isValidEmail(email) {
            // 邮箱正则表达式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isValidPhone(phone) {
            // 中国手机号正则（1开头的11位数字）
            const phoneRegex = /^1[3-9]\d{9}$/;
            return phoneRegex.test(phone);
        },

        // 实时验证（输入时）
        validateField(field) {
            switch (field) {
                case 'name':
                    if (!this.user.name || this.user.name.trim() === '') {
                        this.errors.name = '姓名不能为空';
                    } else if (this.user.name.length > 50) {
                        this.errors.name = '姓名长度不能超过50个字符';
                    } else {
                        this.errors.name = '';
                    }
                    break;

                case 'email':
                    if (this.user.email && !this.isValidEmail(this.user.email)) {
                        this.errors.email = '请输入有效的邮箱地址';
                    } else {
                        this.errors.email = '';
                    }
                    break;

                case 'phone':
                    if (this.user.phone && !this.isValidPhone(this.user.phone)) {
                        this.errors.phone = '请输入有效的手机号码（11位数字）';
                    } else {
                        this.errors.phone = '';
                    }
                    break;
            }
        }
    },
    template: `
        <div class="smart-page" style="overflow-y: auto;">
            <div class="smart-container">
                <div class="smart-header">
                    <div class="header-left">
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
                                            <label class="smart-label">姓名 <span style="color: #dc2626;">*</span></label>
                                            <input 
                                                type="text" 
                                                class="smart-input" 
                                                v-model="user.name" 
                                                :disabled="!isEditing"
                                                @blur="validateField('name')"
                                                :style="errors.name ? 'border-color: #dc2626;' : ''"
                                            >
                                            <div v-if="errors.name" style="color: #dc2626; font-size: 12px; margin-top: 4px;">
                                                <i class="fas fa-exclamation-circle"></i> {{ errors.name }}
                                            </div>
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">职位</label>
                                            <input type="text" class="smart-input" v-model="user.title" :disabled="!isEditing">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">邮箱</label>
                                            <input 
                                                type="email" 
                                                class="smart-input" 
                                                v-model="user.email" 
                                                :disabled="!isEditing"
                                                @blur="validateField('email')"
                                                :style="errors.email ? 'border-color: #dc2626;' : ''"
                                            >
                                            <div v-if="errors.email" style="color: #dc2626; font-size: 12px; margin-top: 4px;">
                                                <i class="fas fa-exclamation-circle"></i> {{ errors.email }}
                                            </div>
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">手机号码</label>
                                            <input 
                                                type="text" 
                                                class="smart-input" 
                                                v-model="user.phone" 
                                                :disabled="!isEditing"
                                                @blur="validateField('phone')"
                                                :style="errors.phone ? 'border-color: #dc2626;' : ''"
                                                placeholder="请输入11位手机号"
                                            >
                                            <div v-if="errors.phone" style="color: #dc2626; font-size: 12px; margin-top: 4px;">
                                                <i class="fas fa-exclamation-circle"></i> {{ errors.phone }}
                                            </div>
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
                                            <textarea class="smart-textarea" v-model="user.bio" :disabled="!isEditing" rows="4" style="border: 1px solid #ccc;"></textarea>
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
