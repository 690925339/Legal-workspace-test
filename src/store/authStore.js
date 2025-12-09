// 全局认证状态管理
const authStore = Vue.reactive({
    user: null,
    session: null,
    loading: true,

    setAuth(session) {
        this.session = session;
        this.user = session?.user || null;
        this.loading = false;
        console.log('Auth state updated:', this.user?.email);
    },

    clearAuth() {
        this.session = null;
        this.user = null;
        this.loading = false;
        console.log('Auth state cleared');
    },

    isAuthenticated() {
        return !!this.session;
    }
});

export { authStore };
