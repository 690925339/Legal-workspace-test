// SCSS 主文件
import './styles/main.scss'

// CSS 导入
import '../assets/styles/main.css'
import '../assets/styles/brand.css'
import '../assets/styles/evidence.css'

// Vue 和核心依赖
import { createApp } from 'vue'

import { router } from './router.js';
import { authService, getSupabaseClient } from './config/supabase.js';
import { authStore } from './store/authStore.js';
import AppLayout from './components/layout/AppLayout.js';
import Sidebar from './components/layout/Sidebar.vue';
import CaseList from './views/CaseList.vue';
import EvidenceUpload from './views/EvidenceUpload.js';
import DocGenerate from './views/DocGenerate.js';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import CaseForm from './views/CaseForm.vue';
import ContractReview from './views/ContractReview.js';
import ContractReviewResult from './views/ContractReviewResult.js';
import LegalResearch from './views/LegalResearch.js';
import CaseSearchResults from './views/CaseSearchResults.js';
import CaseDetailView from './views/CaseDetailView.js';
import RegulationSearchResults from './views/RegulationSearchResults.js';

// 案件子模块
import CaseBasicInfo from './views/case/CaseBasicInfo.js';
import CaseFacts from './views/case/CaseFacts.js';
import CaseStakeholders from './views/case/CaseStakeholders.js';
import CaseFinancials from './views/case/CaseFinancials.js';
import CaseEvidence from './views/case/CaseEvidence.js';
import CaseAdvanced from './views/case/CaseAdvanced.js';

import Settings from './views/Settings.js';
import UserProfile from './views/UserProfile.js';
import ProductFeedback from './views/ProductFeedback.js';
import HistoryModal from './components/HistoryModal.vue';

// 加载用户资料（头像、职位等）
async function loadUserProfile(userId) {
    try {
        const supabase = getSupabaseClient();
        if (!supabase || !userId) return;

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('avatar_url, title')
            .eq('id', userId)
            .single();

        if (!error && profile) {
            if (profile.avatar_url) {
                authStore.setAvatarUrl(profile.avatar_url);
            }
            if (profile.title) {
                authStore.setTitle(profile.title);
            }
            console.log('User profile loaded: avatar and title synced');
        }
    } catch (err) {
        console.error('Failed to load user profile:', err);
    }
}

// 初始化认证状态
(async () => {
    // 获取当前会话
    const { data: { session } } = await authService.getSession();
    authStore.setAuth(session);
    console.log('Auth state updated:', session?.user?.email);

    // 如果已登录，加载用户资料
    if (session?.user?.id) {
        await loadUserProfile(session.user.id);
    }

    // 监听认证状态变化
    authService.onAuthStateChange((event, session) => {
        console.log('Auth event:', event, session?.user?.email);

        if (event === 'SIGNED_IN') {
            authStore.setAuth(session);
            console.log('Auth store updated, isAuthenticated:', authStore.isAuthenticated());

            // 登录后加载用户资料（头像、职位）
            if (session?.user?.id) {
                loadUserProfile(session.user.id);
            }

            // 只有在登录页面时才跳转到首页，避免切换标签页时意外跳转
            const currentPath = window.location.hash.slice(1) || '/';
            if (currentPath === '/login' || currentPath === '/register') {
                setTimeout(() => {
                    console.log('Navigating to / after login');
                    router.push('/');
                }, 50);
            }
        } else if (event === 'SIGNED_OUT') {
            authStore.clearAuth();
            // 登出，导航到登录页
            router.push('/login');
        } else if (event === 'TOKEN_REFRESHED') {
            authStore.setAuth(session);
        } else if (event === 'INITIAL_SESSION') {
            // 初始会话事件 - 只更新状态，不导航
            authStore.setAuth(session);
            console.log('Initial session:', session?.user?.email);

            // 初始会话也加载用户资料
            if (session?.user?.id) {
                loadUserProfile(session.user.id);
            }
        }
    });
})();

const App = {
    data() {
        return {
            currentRoute: window.location.hash.slice(1) || '/',
            authStore  // 引用全局状态
        };
    },
    computed: {
        currentView() {
            const path = this.currentRoute;
            console.log('Current route:', path); // 调试用
            if (path === '/login') {
                return 'Login';
            }
            if (path === '/register') {
                return 'Register';
            }
            if (path === '/forgot-password') {
                return 'ForgotPassword';
            }
            if (path === '/evidence-upload') {
                return 'EvidenceUpload';
            }
            if (path === '/doc-generate') {
                return 'DocGenerate';
            }
            if (path === '/contract-review') {
                return 'ContractReview';
            }
            if (path === '/legal-research') {
                return 'LegalResearch';
            }
            if (path.startsWith('/case-search-results')) {
                return 'CaseSearchResults';
            }
            if (path.startsWith('/case-detail-view')) {
                return 'CaseDetailView';
            }
            if (path.startsWith('/regulation-search-results')) {
                return 'RegulationSearchResults';
            }
            if (path.startsWith('/contract-review-result')) {
                return 'ContractReviewResult';
            }
            if (path === '/settings') {
                return 'Settings';
            }
            if (path === '/profile') {
                return 'UserProfile';
            }
            if (path === '/feedback') {
                return 'ProductFeedback';
            }
            // 案件详情子模块路由匹配
            if (path.match(/\/detail\/[^/]+\/basic/)) {
                return 'CaseBasicInfo';
            }
            if (path.match(/\/detail\/[^/]+\/facts/)) {
                return 'CaseFacts';
            }
            if (path.match(/\/detail\/[^/]+\/stakeholders/)) {
                return 'CaseStakeholders';
            }
            if (path.match(/\/detail\/[^/]+\/financials/)) {
                return 'CaseFinancials';
            }
            if (path.match(/\/detail\/[^/]+\/evidence/)) {
                return 'CaseEvidence';
            }
            if (path.match(/\/detail\/[^/]+\/advanced/)) {
                return 'CaseAdvanced';
            }
            // 入口页重定向到基础信息模块
            if (path.match(/^\/detail\/[^/]+$/)) {
                // 提取案件ID并重定向到基础信息
                const match = path.match(/^\/detail\/([^/]+)$/);
                if (match) {
                    setTimeout(() => {
                        window.location.hash = `/detail/${match[1]}/basic`;
                    }, 0);
                }
                return 'CaseBasicInfo'; // 临时显示，等待重定向
            }
            if (path === '/create' || path.startsWith('/edit')) {
                return 'CaseForm';
            }
            return 'CaseList';
        },
        showLayout() {
            return this.currentRoute !== '/login' && this.currentRoute !== '/register' && this.currentRoute !== '/forgot-password';
        },
        requiresAuth() {
            const publicRoutes = ['/login', '/register', '/forgot-password'];
            return !publicRoutes.includes(this.currentRoute);
        }
    },
    created() {
        // 监听 hash 变化
        window.addEventListener('hashchange', this.onRouteChange);
    },
    beforeUnmount() {
        window.removeEventListener('hashchange', this.onRouteChange);
    },
    methods: {
        onRouteChange() {
            const newRoute = window.location.hash.slice(1) || '/';
            console.log('Route changed to:', newRoute);
            this.currentRoute = newRoute;

            // 延迟检查认证，确保 authStore 已更新
            setTimeout(() => {
                if (this.requiresAuth && !authStore.isAuthenticated() && !authStore.loading) {
                    console.log('Auth required but not authenticated, redirecting to login');
                    router.push('/login');
                }
            }, 100);
        }
    },
    components: {
        AppLayout,
        Sidebar,
        CaseList,
        EvidenceUpload,
        DocGenerate,
        Login,
        Register,
        ForgotPassword,
        CaseForm,
        ContractReview,
        ContractReviewResult,
        LegalResearch,
        CaseSearchResults,
        CaseDetailView,
        RegulationSearchResults,
        Settings,
        UserProfile,
        ProductFeedback,
        // 案件子模块
        CaseBasicInfo,
        CaseFacts,
        CaseStakeholders,
        CaseFinancials,
        CaseEvidence,
        CaseAdvanced
    },
    template: `
        <div id="app">
            <!-- 认证加载中 -->
            <div v-if="authStore.loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f5f5f5;">
                <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
                <p style="color: #666; font-size: 16px;">加载中...</p>
            </div>
            
            <!-- 应用内容 -->
            <template v-else>
                <template v-if="showLayout">
                    <div class="app-layout">
                        <Sidebar />
                        <main class="workspace">
                            <component :is="currentView"></component>
                        </main>
                    </div>
                </template>
                <template v-else>
                    <component :is="currentView"></component>
                </template>
            </template>
        </div>
    `
};

// 创建并挂载应用
const app = createApp(App);

// 注册全局组件
app.component('Sidebar', Sidebar);
app.component('CaseList', CaseList);
app.component('Login', Login);
app.component('Register', Register);
app.component('ForgotPassword', ForgotPassword);
app.component('CaseForm', CaseForm);
app.component('ContractReview', ContractReview);
app.component('ContractReviewResult', ContractReviewResult);
app.component('LegalResearch', LegalResearch);
app.component('CaseSearchResults', CaseSearchResults);
app.component('CaseDetailView', CaseDetailView);
app.component('RegulationSearchResults', RegulationSearchResults);
app.component('EvidenceUpload', EvidenceUpload);
app.component('DocGenerate', DocGenerate);
app.component('Settings', Settings);
app.component('HistoryModal', HistoryModal);

// 案件子模块组件
app.component('CaseBasicInfo', CaseBasicInfo);
app.component('CaseFacts', CaseFacts);
app.component('CaseStakeholders', CaseStakeholders);
app.component('CaseFinancials', CaseFinancials);
app.component('CaseEvidence', CaseEvidence);
app.component('CaseAdvanced', CaseAdvanced);

// 挂载应用
app.mount('#app');
