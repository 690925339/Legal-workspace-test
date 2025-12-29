import CaseModuleLayout from '../../components/case/CaseModuleLayout.js';

/**
 * 财务信息模块
 */
export default {
    name: 'CaseFinancials',
    components: {
        CaseModuleLayout
    },
    data() {
        return {
            caseId: '',
            caseData: {},
            financialsData: {
                // 标的子项 (替代原有的 principal/penalty 固定字段)
                claimItems: [
                    { name: '欠款本金', amount: 500000 },
                    { name: '违约金', amount: 80000 }
                ],
                attorneyFee: 85000,
                isAttorneyFeeIncluded: false, // 律师费是否包含在标的中
                courtCost: 11300,
                billableHours: 45.5
            },
            showFinancialsModal: false,
            editForm: {
                claimItems: []
            }
        };
    },
    computed: {
        // 自动计算诉讼标的额
        totalClaimAmount() {
            if (!this.financialsData.claimItems) return 0;
            return this.financialsData.claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        },
        // 编辑态的实时计算
        editTotalAmount() {
            if (!this.editForm || !this.editForm.claimItems) return 0;
            return this.editForm.claimItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        }
    },
    watch: {
        'editForm.isAttorneyFeeIncluded'(val) {
            if (!this.editForm.claimItems) return;
            const existingIndex = this.editForm.claimItems.findIndex(i => i.name === '律师费');

            if (val) {
                // Checked: Add if missing
                if (existingIndex === -1) {
                    this.editForm.claimItems.push({ name: '律师费', amount: this.editForm.attorneyFee || 0 });
                }
            } else {
                // Unchecked: Remove if exists
                if (existingIndex !== -1) {
                    this.editForm.claimItems.splice(existingIndex, 1);
                }
            }
        },
        'editForm.attorneyFee'(val) {
            if (this.editForm.isAttorneyFeeIncluded) {
                const item = this.editForm.claimItems.find(i => i.name === '律师费');
                if (item) {
                    item.amount = val || 0;
                }
            }
        },
        'editForm.claimItems': {
            handler(newVal) {
                if (!newVal) return;
                // Check if '律师费' exists to keep checkbox synced
                const hasFee = newVal.some(i => i.name === '律师费');
                // Only update if state doesn't match to avoid infinite loop (though toggle logic handles it, defensive is good)
                if (this.editForm.isAttorneyFeeIncluded !== hasFee) {
                    // Note: We need to set it without triggering the 'remove' logic if it was just removed.
                    // But wait, if hasFee is false, and we set Included=false, the watcher triggers.
                    // Watcher sees false, checks if exists (it doesn't), does nothing. Safe.

                    // If hasFee is true, and we set Included=true, watcher triggers.
                    // Watcher sees true, checks if exists (it does), does nothing. Safe.

                    this.editForm.isAttorneyFeeIncluded = hasFee;
                }
            },
            deep: true
        }
    },
    created() {
        const hash = window.location.hash;
        const match = hash.match(/\/detail\/([^/]+)/);
        this.caseId = match ? match[1] : '1';
    },
    methods: {
        onCaseLoaded(data) {
            this.caseData = data;
        },
        formatCurrency(value) {
            return '¥' + (Number(value) || 0).toLocaleString();
        },
        editFinancials() {
            // 深拷贝，防止编辑时直接修改原数据
            this.editForm = JSON.parse(JSON.stringify(this.financialsData));
            // 防御性处理：确保 claimItems 数组存在
            if (!this.editForm.claimItems) {
                this.editForm.claimItems = [];
            }
            this.showFinancialsModal = true;
        },
        addClaimItem() {
            if (!this.editForm.claimItems) this.editForm.claimItems = [];
            this.editForm.claimItems.push({ name: '', amount: 0 });
        },
        removeClaimItem(index) {
            this.editForm.claimItems.splice(index, 1);
        },
        saveFinancials() {
            // 简单校验
            if (this.editForm.claimItems.some(item => !item.name)) {
                alert('请输入完整的标的项名称');
                return;
            }
            this.financialsData = JSON.parse(JSON.stringify(this.editForm));
            this.showFinancialsModal = false;
        }
    },
    template: `
        <CaseModuleLayout :case-id="caseId" active-module="financials" @case-loaded="onCaseLoaded">
            <div class="tab-pane">
                <div class="modern-card">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">财务信息</div>
                        <button class="icon-btn" style="font-size: 14px;" @click="editFinancials">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                    
                    <!-- 1. 诉讼标的额 (自动汇总) -->
                    <div class="info-row">
                        <span class="label">诉讼标的额</span>
                        <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">{{ formatCurrency(totalClaimAmount) }}</span>
                    </div>

                    <!-- 2. 标的组成 (动态列表) -->
                    <div style="padding: 12px; background: #f8fafc; border-radius: 6px; margin: 12px 0 24px 0; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">标的组成详情：</div>
                        <div v-if="financialsData.claimItems.length === 0" style="color: #cbd5e1; font-size: 13px; text-align: center;">无详情</div>
                        <div v-for="(item, index) in financialsData.claimItems" :key="index" style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; color: #475569;">
                            <span>{{ item.name }}</span>
                            <span>{{ formatCurrency(item.amount) }}</span>
                        </div>
                    </div>

                    <!-- 3. 其他费用 -->
                    <div class="info-row">
                        <span class="label">律师费报价</span>
                        <span class="value" style="display: flex; align-items: center; gap: 8px;">
                            {{ formatCurrency(financialsData.attorneyFee) }}
                            <span v-if="financialsData.isAttorneyFeeIncluded" class="tag" style="background: #eef2ff; color: #6366f1; border: 1px solid #c7d2fe; margin: 0; font-size: 11px;">
                                已含在标的中
                            </span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="label">预估诉讼费</span>
                        <span class="value">{{ formatCurrency(financialsData.courtCost) }} <span style="font-size: 12px; color: #94a3b8;">(仅供参考)</span></span>
                    </div>
                    <div class="info-row">
                        <span class="label">计费时长</span>
                        <span class="value">{{ financialsData.billableHours }} 小时</span>
                    </div>
                </div>
            </div>

            <!-- Financials Edit Modal -->
            <div v-if="showFinancialsModal" class="modal-overlay" @click.self="showFinancialsModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">编辑财务信息</div>
                        <button class="modal-close" @click="showFinancialsModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        
                        <!-- 标的组成编辑 -->
                        <div class="smart-form-group">
                            <label class="smart-label">
                                标的组成 
                                <span style="float: right; color: #64748b; font-weight: normal;">总额: {{ formatCurrency(editTotalAmount) }}</span>
                            </label>
                            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <div v-for="(item, index) in editForm.claimItems" :key="index" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
                                    <input type="text" class="smart-input" v-model="item.name" placeholder="项目名称 (如: 本金)" style="flex: 1;">
                                    <input type="number" class="smart-input" v-model.number="item.amount" placeholder="金额" style="width: 120px;">
                                    <button class="icon-btn" style="color: #ef4444;" @click="removeClaimItem(index)"><i class="fas fa-trash-alt"></i></button>
                                </div>
                                <button class="smart-btn-secondary" style="width: 100%; font-size: 12px; border-style: dashed;" @click="addClaimItem">
                                    <i class="fas fa-plus"></i> 添加标的项
                                </button>
                            </div>
                        </div>

                        <div class="smart-form-group">
                            <label class="smart-label">律师费报价</label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="number" class="smart-input" v-model.number="editForm.attorneyFee" placeholder="请输入律师费报价" style="flex: 1;">
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #334155; cursor: pointer; user-select: none;" title="勾选后将自动添加到标的列表中">
                                    <input type="checkbox" v-model="editForm.isAttorneyFeeIncluded">
                                    包含在标的中
                                </label>
                            </div>
                        </div>
                        
                        <div class="smart-form-group">
                            <label class="smart-label">预估诉讼费</label>
                            <input type="number" class="smart-input" v-model.number="editForm.courtCost" placeholder="请输入预估诉讼费">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">计费时长（小时）</label>
                            <input type="number" step="0.5" class="smart-input" v-model.number="editForm.billableHours" placeholder="请输入计费时长">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showFinancialsModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveFinancials"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>
        </CaseModuleLayout>
    `
};
