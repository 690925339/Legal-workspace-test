import CaseModuleLayout from '../../components/case/CaseModuleLayout.js';
import InterestCalculator from '../../components/case/InterestCalculator.js';

/**
 * 财务信息模块
 */
export default {
    name: 'CaseFinancials',
    components: {
        CaseModuleLayout,
        InterestCalculator
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
            },
            // 利息计算器显示状态
            showCalculatorModal: false
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
                if (this.editForm.isAttorneyFeeIncluded !== hasFee) {
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
        },
        openCalculator() {
            this.showCalculatorModal = true;
        },
        handleInterestApplied(amount) {
            const name = '利息/违约金';
            const existingIndex = this.financialsData.claimItems.findIndex(i => i.name === name);
            if (existingIndex !== -1) {
                this.financialsData.claimItems[existingIndex].amount = amount;
            } else {
                this.financialsData.claimItems.push({ name: name, amount: amount });
            }
            this.showCalculatorModal = false;
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

                    <!-- 利息计算器入口 -->
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e2e8f0;">
                        <button 
                            class="smart-btn-secondary" 
                            style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px;"
                            @click="openCalculator"
                        >
                            <i class="fas fa-calculator"></i>
                            利息/违约金/占用费计算器
                        </button>
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
                            <label class="smart-label" style="margin-bottom: 8px;">标的组成 (Claim Items)</label>
                            
                            <div v-if="editForm.claimItems.length === 0" style="text-align: center; padding: 24px; color: #94a3b8; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; margin-bottom: 12px;">
                                <i class="fas fa-clipboard-list" style="font-size: 24px; margin-bottom: 8px; color: #cbd5e1;"></i>
                                <div style="font-size: 13px;">暂无标的项，请添加</div>
                            </div>

                            <div v-else style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
                                <div v-for="(item, index) in editForm.claimItems" :key="index" 
                                     style="display: flex; gap: 12px; align-items: center; background: #fff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; transition: all 0.2s;">
                                    
                                    <div style="flex: 2; display: flex; flex-direction: column; gap: 4px;">
                                        <label style="font-size: 11px; color: #64748b;">名称</label>
                                        <input type="text" class="smart-input" v-model="item.name" placeholder="如: 欠款本金" 
                                               style="border: 1px solid #e2e8f0; font-size: 13px; height: 32px;">
                                    </div>
                                    
                                    <div style="flex: 1.5; display: flex; flex-direction: column; gap: 4px;">
                                        <label style="font-size: 11px; color: #64748b;">金额 (元)</label>
                                        <input type="number" class="smart-input" v-model="item.amount" placeholder="0" 
                                               style="border: 1px solid #e2e8f0; font-size: 13px; height: 32px;">
                                    </div>
                                    
                                    <div style="display: flex; align-items: flex-end; padding-bottom: 4px;">
                                        <button class="icon-btn" style="color: #94a3b8; transition: color 0.2s; padding: 8px;" 
                                                @click="removeClaimItem(index)"
                                                title="删除">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button @click="addClaimItem" 
                                    style="width: 100%; border: 1px dashed #cbd5e1; color: #64748b; padding: 10px; border-radius: 8px; background: #f8fafc; transition: all 0.2s; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                <i class="fas fa-plus-circle"></i> 添加标的组成项
                            </button>

                            <div style="text-align: right; font-size: 14px; font-weight: 600; color: #334155; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e2e8f0;">
                                合计: <span style="color: #059669;">{{ formatCurrency(editTotalAmount) }}</span>
                            </div>
                        </div>

                        <div class="smart-form-group">
                            <label class="smart-label">律师费报价</label>
                            <input type="number" class="smart-input" v-model="editForm.attorneyFee">
                            <div style="margin-top: 8px;">
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; cursor: pointer;">
                                    <input type="checkbox" v-model="editForm.isAttorneyFeeIncluded">
                                    律师费已包含在诉讼标的中
                                </label>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="smart-form-group">
                                <label class="smart-label">预估诉讼费</label>
                                <input type="number" class="smart-input" v-model="editForm.courtCost">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">计费时长 (小时)</label>
                                <input type="number" class="smart-input" v-model="editForm.billableHours">
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showFinancialsModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveFinancials"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>

            <!-- 利息计算器组件 -->
            <InterestCalculator 
                :visible="showCalculatorModal" 
                :initial-principal="totalClaimAmount" 
                @update:visible="showCalculatorModal = $event" 
                @apply="handleInterestApplied" 
            />

        </CaseModuleLayout>
    `
};
