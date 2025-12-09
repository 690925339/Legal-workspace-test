// Sidebar v2.0 - 包含文书生成功能
import { router } from '../../router.js';
import { authService } from '../../config/supabase.js';
import ProductFeedback from '../../views/ProductFeedback.js';

export default {
    name: 'Sidebar',
    components: {
        ProductFeedback
    },
    data() {
        return {
            currentPath: window.location.hash.slice(1) || '/',
            showUserMenu: false,
            isCollapsed: false,
            showFeedbackModal: false
        };
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentPath = window.location.hash.slice(1) || '/';
        });
        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            const footer = this.$el.querySelector('.sidebar-footer');
            if (footer && !footer.contains(e.target)) {
                this.showUserMenu = false;
            }
        });
    },
    methods: {
        navigate(path) {
            router.push(path);
            this.showUserMenu = false;
        },
        isActive(path) {
            return this.currentPath === path;
        },
        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu;
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.showUserMenu = false; // Close menu on toggle
        },
        async handleLogout() {
            this.showUserMenu = false;
            const { error } = await authService.signOut();
            if (error) {
                console.error('Logout error:', error);
                alert('登出失败，请重试');
            }
            // onAuthStateChange in main.js will handle navigation to /login
        }
    },
    template: `
        <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
            <div class="brand" style="position: relative; padding-right: 0;">
                <div class="brand-icon">
                    <i class="fas fa-gavel"></i>
                </div>
                <div class="brand-text" v-show="!isCollapsed">
                    <div class="brand-name">ALPHA&LEADER</div>
                    <div class="brand-subtitle">安华理达</div>
                </div>
                
                <!-- Collapse Toggle -->
                <button @click="toggleCollapse" class="collapse-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>

            <div class="nav-group-title" v-show="!isCollapsed">工作台</div>
            <a @click.prevent="navigate('/')" 
               :class="['nav-item', { active: isActive('/') }]">
                <i class="fas fa-folder-open"></i>
                <span v-show="!isCollapsed">案件管理</span>
            </a>


            <div class="nav-group-title" style="margin-top: 24px;" v-show="!isCollapsed">智能分析</div>
            <a @click.prevent="navigate('/legal-research')" 
               :class="['nav-item', { active: isActive('/legal-research') }]">
                <i class="fas fa-search"></i>
                <span v-show="!isCollapsed">法律检索</span>
            </a>
            <a @click.prevent="navigate('/contract-review')" 
               :class="['nav-item', { active: isActive('/contract-review') }]">
                <i class="fas fa-file-contract"></i>
                <span v-show="!isCollapsed">合同审查</span>
            </a>
            <a @click.prevent="navigate('/doc-generate')" 
               :class="['nav-item', { active: isActive('/doc-generate') }]">
                <i class="fas fa-pen-fancy"></i>
                <span v-show="!isCollapsed">文书生成</span>
            </a>

            <div class="sidebar-footer" style="position: relative;">
                <div v-if="showUserMenu" class="user-menu-popover" style="
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    min-width: 230px;
                    background: white;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
                    margin-bottom: 8px;
                    padding: 4px 0;
                    z-index: 100;
                ">
                    <a @click.prevent="navigate('/profile')" class="menu-item" style="
                        display: flex;
                        align-items: center;
                        padding: 10px 16px;
                        color: #1a1a1a;
                        text-decoration: none;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-user-circle" style="width: 20px; margin-right: 8px; color: #666;"></i>
                        个人资料
                    </a>

                    <a href="https://ai.feishu.cn/wiki/CBlfwahuAiecuRk9yvucFTx8n5b?from=from_copylink" target="_blank" @click="showUserMenu = false" class="menu-item" style="
                        display: flex;
                        align-items: center;
                        padding: 10px 16px;
                        color: #1a1a1a;
                        text-decoration: none;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-question-circle" style="width: 20px; margin-right: 8px; color: #666;"></i>
                        帮助文档
                    </a>
                    <a @click.prevent="showFeedbackModal = true; showUserMenu = false" class="menu-item" style="
                        display: flex;
                        align-items: center;
                        padding: 10px 16px;
                        color: #1a1a1a;
                        text-decoration: none;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-comment-alt" style="width: 20px; margin-right: 8px; color: #666;"></i>
                        产品反馈
                    </a>
                    <div style="height: 1px; background: #e5e5e5; margin: 4px 0;"></div>
                    <a @click.prevent="handleLogout" class="menu-item" style="
                        display: flex;
                        align-items: center;
                        padding: 10px 16px;
                        color: #dc2626;
                        text-decoration: none;
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
                        <i class="fas fa-sign-out-alt" style="width: 20px; margin-right: 8px;"></i>
                        退出登录
                    </a>
                </div>

                <a @click.prevent="toggleUserMenu" class="user-profile" style="cursor: pointer;">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info" v-show="!isCollapsed">
                        <div class="user-name">李律师</div>
                        <div class="user-role">高级合伙人</div>
                    </div>
                </a>
            </div>
            
            <!-- Feedback Modal -->
            <ProductFeedback 
                :visible="showFeedbackModal" 
                @close="showFeedbackModal = false"
            />
        </aside>
    `
};
