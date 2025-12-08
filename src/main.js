import { router } from './router.js';
import AppLayout from './components/layout/AppLayout.js';
import Sidebar from './components/layout/Sidebar.js';
import CaseList from './views/CaseList.js';
import CaseDetail from './views/CaseDetail.js';
import EvidenceUpload from './views/EvidenceUpload.js';
import DocGenerate from './views/DocGenerate.js';
import Login from './views/Login.js';
import Register from './views/Register.js';
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

const { createApp } = Vue;

const App = {
    data() {
        return {
            currentRoute: window.location.hash.slice(1) || '/'
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
            return this.currentRoute !== '/login' && this.currentRoute !== '/register';
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
            console.log('Route changed to:', newRoute); // 调试用
            this.currentRoute = newRoute;
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
