// Simple router implementation
const routes = {
    '/': 'CaseList',
    '/detail': 'CaseDetail',
    '/evidence-upload': 'EvidenceUpload',
    '/doc-generate': 'DocGenerate',
    '/login': 'Login',
    '/register': 'Register'
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
