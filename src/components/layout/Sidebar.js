import { router } from '../../router.js';

export default {
    name: 'Sidebar',
    data() {
        return {
            currentPath: router.currentRoute
        };
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentPath = router.currentRoute;
        });
    },
    methods: {
        navigate(path) {
            router.push(path);
        },
        isActive(path) {
            return this.currentPath === path;
        }
    },
    template: `
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <div class="brand-text">
                    <div class="brand-name">ALPHA&LEADER</div>
                    <div class="brand-subtitle">安华理达</div>
                </div>
            </div>

            <div class="nav-group-title">工作台</div>
            <a @click.prevent="navigate('/')" 
               :class="['nav-item', { active: isActive('/') }]">
                <i class="fas fa-folder-open"></i>
                <span>案件管理</span>
            </a>
            <a href="#" class="nav-item">
                <i class="fas fa-file-alt"></i>
                <span>文档库</span>
            </a>
            <a href="#" class="nav-item">
                <i class="fas fa-check-square"></i>
                <span>待办事项</span>
            </a>

            <div class="nav-group-title" style="margin-top: 24px;">智能分析</div>
            <a @click.prevent="navigate('/legal-research')" 
               :class="['nav-item', { active: isActive('/legal-research') }]">
                <i class="fas fa-search"></i>
                <span>法律检索</span>
            </a>
            <a @click.prevent="navigate('/contract-review')" 
               :class="['nav-item', { active: isActive('/contract-review') }]">
                <i class="fas fa-file-contract"></i>
                <span>合同审查</span>
            </a>

            <div class="sidebar-footer">
                <a @click.prevent="navigate('/login')" class="user-profile">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <div class="user-name">李律师</div>
                        <div class="user-role">高级合伙人</div>
                    </div>
                    <i class="fas fa-sign-out-alt" style="color: var(--text-tertiary);"></i>
                </a>
            </div>
        </aside>
    `
};
