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
                avatar: null // In a real app, this would be a URL
            },
            roles: [
                { value: 'Senior Partner', label: '高级合伙人' },
                { value: 'Partner', label: '合伙人' },
                { value: 'Associate', label: '主办律师' },
                { value: 'Paralegal', label: '律师助理' }
            ],
            isSaving: false
        };
    },
    methods: {
        handleAvatarChange(event) {
            const file = event.target.files[0];
            if (file) {
                // Create a fake local URL for preview
                this.user.avatar = URL.createObjectURL(file);
            }
        },
        saveSettings() {
            this.isSaving = true;
            // Simulate API call
            setTimeout(() => {
                this.isSaving = false;
                alert('设置已保存');
                // Update role text based on selection
                const selectedRole = this.roles.find(r => r.value === this.user.role);
                if (selectedRole) {
                    this.user.roleText = selectedRole.label;
                }
            }, 800);
        }
    },
    template: `
        <div class="settings-page" style="padding: 40px; max-width: 800px; margin: 0 auto;">
            <header style="margin-bottom: 40px;">
                <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">个人设置</h1>
                <p style="color: #666;">管理您的个人信息和账户偏好</p>
            </header>

            <div class="settings-card" style="background: white; border-radius: 12px; border: 1px solid #e5e5e5; padding: 32px;">
                <!-- Avatar Section -->
                <div class="form-section" style="margin-bottom: 32px; display: flex; align-items: center; gap: 24px;">
                    <div class="avatar-preview" style="
                        width: 80px; 
                        height: 80px; 
                        border-radius: 50%; 
                        background: #f3f4f6; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        overflow: hidden;
                        border: 2px solid #e5e5e5;
                    ">
                        <img v-if="user.avatar" :src="user.avatar" style="width: 100%; height: 100%; object-fit: cover;">
                        <i v-else class="fas fa-user" style="font-size: 32px; color: #9ca3af;"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">头像</h3>
                        <div style="display: flex; gap: 12px;">
                            <label class="smart-btn-secondary" style="cursor: pointer; display: inline-block;">
                                更换头像
                                <input type="file" @change="handleAvatarChange" accept="image/*" style="display: none;">
                            </label>
                            <button v-if="user.avatar" @click="user.avatar = null" class="text-btn" style="color: #dc2626; background: none; border: none; cursor: pointer;">删除</button>
                        </div>
                    </div>
                </div>

                <!-- Basic Info -->
                <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <div class="form-group">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">姓名</label>
                        <input v-model="user.name" type="text" class="form-input" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">角色</label>
                        <select v-model="user.role" class="form-select" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; background: white;">
                            <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">邮箱</label>
                        <input v-model="user.email" type="email" class="form-input" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">手机号码</label>
                        <input v-model="user.phone" type="tel" class="form-input" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>
                </div>

                <!-- Actions -->
                <div class="form-actions" style="border-top: 1px solid #e5e5e5; padding-top: 24px; display: flex; justify-content: flex-end;">
                    <button @click="saveSettings" class="smart-btn-primary" :disabled="isSaving" style="min-width: 100px;">
                        <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
                        <span v-else>保存更改</span>
                    </button>
                </div>
            </div>
        </div>
    `
};
