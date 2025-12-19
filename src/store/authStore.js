// 全局认证状态管理
import { reactive } from 'vue'

const authStore = reactive({
    user: null,
    session: null,
    loading: true,
    avatarUrl: null,  // 用户头像 URL
    title: null,      // 用户职位

    setAuth(session) {
        this.session = session;
        this.user = session?.user || null;
        this.loading = false;
        console.log('Auth state updated:', this.user?.email);
    },

    clearAuth() {
        this.session = null;
        this.user = null;
        this.avatarUrl = null;
        this.title = null;
        this.loading = false;
        console.log('Auth state cleared');
    },

    setAvatarUrl(url) {
        this.avatarUrl = url;
        console.log('Avatar URL updated:', url);
    },

    setTitle(title) {
        this.title = title;
        console.log('Title updated:', title);
    },

    isAuthenticated() {
        return !!this.session;
    }
});

export { authStore };

