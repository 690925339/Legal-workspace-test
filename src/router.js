// Simple router implementation
const routes = {
    '/': 'CaseList',
    '/detail': 'CaseDetail',
    '/login': 'Login',
    '/register': 'Register'
};

const router = {
    currentRoute: window.location.hash.slice(1) || '/',

    push(path) {
        window.location.hash = path;
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
