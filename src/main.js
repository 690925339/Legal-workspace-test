import { router } from './router.js';
import AppLayout from './components/layout/AppLayout.js';
import Sidebar from './components/layout/Sidebar.js';
import CaseList from './views/CaseList.js';
import CaseDetail from './views/CaseDetail.js';
import Login from './views/Login.js';
import Register from './views/Register.js';
import CaseForm from './views/CaseForm.js';

const { createApp } = Vue;

const App = {
    data() {
        return {
            currentRoute: router.currentRoute
        };
    },
    computed: {
        currentView() {
            const path = this.currentRoute;
            if (path === '/login') {
                return 'Login';
            }
            if (path === '/register') {
                return 'Register';
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
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentRoute = router.currentRoute;
        });
    },
    components: {
        AppLayout,
        Sidebar,
        CaseList,
        CaseDetail,
        Login,
        Register,
        CaseForm
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

// 挂载应用
app.mount('#app');
