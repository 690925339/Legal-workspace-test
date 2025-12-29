// Simple router implementation
const routes = {
    '/': 'CaseList',
    '/detail': 'CaseDetail',
    // 案件详情子模块路由
    '/detail/:id/basic': 'CaseBasicInfo',
    '/detail/:id/facts': 'CaseFacts',
    '/detail/:id/stakeholders': 'CaseStakeholders',
    '/detail/:id/financials': 'CaseFinancials',
    '/detail/:id/evidence': 'CaseEvidence',
    '/detail/:id/advanced': 'CaseAdvanced',
    '/evidence-upload': 'EvidenceUpload',
    '/doc-generate': 'DocGenerate',
    '/profile': 'UserProfile',
    '/feedback': 'ProductFeedback',
    '/login': 'Login',
    '/register': 'Register',
    '/forgot-password': 'ForgotPassword'
};

const router = {
    currentRoute: window.location.hash.slice(1) || '/',

    push(path) {
        if (window.location.hash === '#' + path) {
            // 如果 hash 已经是目标路径，手动触发 hashchange 事件
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
            window.location.hash = path;
        }
        this.currentRoute = path;
    },

    back() {
        window.history.back();
    }
};

// Watch for hash changes
window.addEventListener('hashchange', () => {
    router.currentRoute = window.location.hash.slice(1) || '/';
});

export { router, routes };

