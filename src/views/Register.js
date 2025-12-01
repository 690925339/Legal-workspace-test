import { router } from '../router.js';

export default {
    name: 'Register',
    data() {
        return {
            name: '',
            email: '',
            password: ''
        };
    },
    methods: {
        handleRegister() {
            // 简单验证后跳转到首页
            if (this.name && this.email && this.password) {
                router.push('/');
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
                        <span>LegalMind</span>
                    </div>
                    <div class="brand-quote">"效率是把事情做对，效能是做对的事情"</div>
                    <div class="brand-desc">
                        加入数千名信赖 LegalMind 管理法律实务的专业人士行列。
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-container">
                    <div class="form-header">
                        <div class="form-title">创建账号</div>
                        <div class="form-subtitle">立即开始 14 天免费试用</div>
                    </div>

                    <form @submit.prevent="handleRegister">
                        <div class="form-group">
                            <label class="form-label">姓名</label>
                            <div class="input-wrapper">
                                <i class="far fa-user input-icon"></i>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    placeholder="请输入您的姓名"
                                    v-model="name"
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
                                    placeholder="请创建密码"
                                    v-model="password"
                                    required
                                >
                            </div>
                        </div>

                        <button type="submit" class="submit-btn">创建账号</button>
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
