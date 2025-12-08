export default {
    name: 'HistoryModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '历史记录'
        },
        records: {
            type: Array,
            default: () => []
        },
        tabs: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            activeTab: ''
        };
    },
    watch: {
        visible(val) {
            if (val && this.tabs.length > 0) {
                this.activeTab = this.tabs[0];
            }
        }
    },
    emits: ['update:visible', 'select'],
    methods: {
        close() {
            this.$emit('update:visible', false);
        },
        selectRecord(record) {
            this.$emit('select', record);
            this.close();
        },
        switchTab(tab) {
            this.activeTab = tab;
        }
    },
    computed: {
        filteredRecords() {
            let records = this.records;
            // 如果有tabs且选中了某个tab，则过滤
            if (this.tabs.length > 0 && this.activeTab) {
                records = records.filter(r => r.type === this.activeTab);
            }
            // 按日期倒序排列
            return [...records].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        }
    },
    template: `
        <div v-if="visible" class="modal-overlay" @click.self="close">
            <div class="modal-container" style="width: 500px; max-width: 90vw;">
                <div class="modal-header" style="padding: 16px 20px; border-bottom: none;">
                    <div class="modal-title" style="font-size: 16px; font-weight: 600;">{{ title }}</div>
                    <button class="modal-close" @click="close" style="color: #999;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Tabs -->
                <div v-if="tabs.length > 0" style="display: flex; gap: 0; padding: 0 20px; border-bottom: 1px solid #f0f0f0;">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab"
                        @click="switchTab(tab)"
                        :style="{
                            padding: '10px 16px',
                            fontSize: '14px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: activeTab === tab ? '#1a1a1a' : '#999',
                            fontWeight: activeTab === tab ? '500' : '400',
                            borderBottom: activeTab === tab ? '2px solid #1a1a1a' : '2px solid transparent',
                            marginBottom: '-1px'
                        }"
                    >{{ tab }}</button>
                </div>
                
                <div class="modal-body" style="padding: 0; max-height: 60vh; overflow-y: auto;">
                    <div v-if="filteredRecords.length === 0" style="padding: 32px; text-align: center; color: #999;">
                        <p style="font-size: 14px;">暂无历史记录</p>
                    </div>
                    <div v-else class="history-list">
                        <div 
                            v-for="record in filteredRecords" 
                            :key="record.id" 
                            class="history-item"
                            @click="selectRecord(record)"
                            style="padding: 12px 20px; border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: background 0.2s;"
                            onmouseover="this.style.background='#f9fafb'"
                            onmouseout="this.style.background='white'"
                        >
                            <div style="font-size: 14px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ record.title }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
