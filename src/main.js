import { router } from './router.js';
import { authService } from './config/supabase.js';
import { authStore } from './store/authStore.js';
import AppLayout from './components/layout/AppLayout.js';
import Sidebar from './components/layout/Sidebar.js';
import CaseList from './views/CaseList.js';
import CaseDetail from './views/CaseDetail.js';
import EvidenceUpload from './views/EvidenceUpload.js';
import DocGenerate from './views/DocGenerate.js';
import Login from './views/Login.js';
import Register from './views/Register.js';
import ForgotPassword from './views/ForgotPassword.js';
import CaseForm from './views/CaseForm.js';
import ContractReview from './views/ContractReview.js';
import ContractReviewResult from './views/ContractReviewResult.js';
import LegalResearch from './views/LegalResearch.js';
import CaseSearchResults from './views/CaseSearchResults.js';
import CaseDetailView from './views/CaseDetailView.js';
import RegulationSearchResults from './views/RegulationSearchResults.js';

import Settings from './views/Settings.js';
import UserProfile from './views/UserProfile.js';
import ProductFeedback from './views/ProductFeedback.js';
import HistoryModal from './components/HistoryModal.js';

// 初始化认证状态
(async () => {
    // 获取当前会话
    const { data: { session } } = await authService.getSession();
    authStore.setAuth(session);
    console.log('Auth state updated:', session?.user?.email);

    // 监听认证状态变化
    authService.onAuthStateChange((event, session) => {
        console.log('Auth event:', event, session?.user?.email);

        if (event === 'SIGNED_IN') {
            authStore.setAuth(session);
            console.log('Auth store updated, isAuthenticated:', authStore.isAuthenticated());
            // 使用 setTimeout 确保 Vue 响应式系统已处理状态变化
            setTimeout(() => {
                console.log('Navigating to / after auth update');
                router.push('/');
            }, 50);
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
        }
    });
})();

const { createApp } = Vue;

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
            if (path.startsWith('/detail')) {
                return 'CaseDetail';
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
        CaseDetail,
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
        ProductFeedback
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
app.component('CaseDetail', CaseDetail);
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

// 挂载应用
app.mount('#app');
