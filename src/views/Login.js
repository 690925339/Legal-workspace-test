import { router } from '../router.js';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false
        };
    },
    methods: {
        handleLogin() {
            // 简单验证后跳转到首页
            if (this.email && this.password) {
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
                        <div class="brand-text">
                            <div class="brand-name">ALPHA&LEADER</div>
                            <div class="brand-subtitle">安华理达</div>
                        </div>
                    </div>
                    <div class="brand-quote">"迟来的正义即非正义"</div>
                    <div class="brand-desc">
                        体验 AI 驱动的法律工作空间，简化案件管理，智能分析文档，专注于最重要的事情。
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
                                    placeholder="请输入密码"
                                    v-model="password"
                                    required
                                >
                            </div>
                        </div>

                        <div class="form-actions">
                            <label class="remember-me">
                                <input type="checkbox" v-model="rememberMe"> 记住我
                            </label>
                            <a href="#" class="forgot-password">忘记密码？</a>
                        </div>

                        <button type="submit" class="submit-btn">登录</button>
                    </form>

                    <div class="form-footer">
                        还没有账号？ <a @click.prevent="router.push('/register')" href="#" style="cursor: pointer;">立即注册</a>
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
