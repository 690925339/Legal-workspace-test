import { router } from '../router.js';
import { authService } from '../config/supabase.js';

export default {
    name: 'Register',
    data() {
        return {
            name: '',
            email: '',
            password: '',
            isLoading: false,
            errorMessage: '',
            successMessage: ''
        };
    },
    methods: {
        async handleRegister() {
            if (!this.name || !this.email || !this.password) {
                this.errorMessage = '请填写所有字段';
                return;
            }

            if (this.password.length < 6) {
                this.errorMessage = '密码长度至少为 6 位';
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                const { data, error } = await authService.signUp(this.email, this.password, {
                    full_name: this.name
                });

                if (error) {
                    console.error('Registration error:', error);
                    // 处理常见错误
                    if (error.message.includes('already registered')) {
                        this.errorMessage = '该邮箱已被注册';
                    } else if (error.message.includes('Password should be')) {
                        this.errorMessage = '密码格式不符合要求';
                    } else {
                        this.errorMessage = error.message || '注册失败，请重试';
                    }
                    return;
                }

                if (data.user) {
                    console.log('Registration successful:', data.user);
                    // 注册成功提示
                    this.successMessage = '注册成功！正在跳转到登录页...';
                    // 2秒后跳转到登录页
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                this.errorMessage = '注册失败，请检查网络连接';
            } finally {
                this.isLoading = false;
            }
        }
    },
    template: `
        <div class="auth-page">
            <div class="brand-section">
                <div class="brand-pattern"></div>
                <div class="brand-content">
                    <div class="brand-logo">
                        <div class="logo-box">LOGO</div>
                        <div class="brand-text">
                            <div class="brand-name">ALPHA&LEADER</div>
                            <div class="brand-subtitle">安华理达</div>
                        </div>
                    </div>
                    <div class="brand-quote">"效率是把事情做对，效能是做对的事情"</div>
                    <div class="brand-desc">
                        加入数千名信赖 ALPHA&LEADER 管理法律实务的专业人士行列。
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-container">
                    <div class="form-header">
                        <div class="form-title">创建账号</div>
                        <div class="form-subtitle">开始您的智能法律工作之旅</div>
                    </div>

                    <form @submit.prevent="handleRegister">
                        <!-- 错误提示 -->
                        <div v-if="errorMessage" style="padding: 12px; background: #fee; border: 1px solid #fcc; border-radius: 6px; color: #c33; font-size: 14px; margin-bottom: 16px;">
                            <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
                        </div>

                        <!-- 成功提示 -->
                        <div v-if="successMessage" style="padding: 12px; background: #efe; border: 1px solid #cfc; border-radius: 6px; color: #3c3; font-size: 14px; margin-bottom: 16px;">
                            <i class="fas fa-check-circle"></i> {{ successMessage }}
                        </div>

                        <div class="form-group">
                            <label class="form-label">姓名</label>
                            <div class="input-wrapper">
                                <i class="far fa-user input-icon"></i>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    placeholder="请输入您的姓名"
                                    v-model="name"
                                    :disabled="isLoading"
                                    required
                                >
                            </div>
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
                                    placeholder="请创建密码（至少6位）"
                                    v-model="password"
                                    :disabled="isLoading"
                                    required
                                >
                            </div>
                        </div>

                        <button type="submit" class="submit-btn" :disabled="isLoading">
                            <span v-if="!isLoading">创建账号</span>
                            <span v-else><i class="fas fa-spinner fa-spin"></i> 注册中...</span>
                        </button>
                    </form>

                    <div class="form-footer">
                        已有账号？ <a @click.prevent="router.push('/login')" href="#" style="cursor: pointer;">立即登录</a>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        return {
            router
        };
    }
};
