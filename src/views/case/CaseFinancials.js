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
                totalAmount: 580000,
                principal: 500000,
                penalty: 80000,
                attorneyFee: 85000,
                courtCost: 11300,
                billableHours: 45.5
            },
            showFinancialsModal: false,
            editForm: {}
        };
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
            return '¥' + value.toLocaleString();
        },
        editFinancials() {
            this.editForm = {
                totalAmount: this.financialsData.totalAmount,
                principal: this.financialsData.principal,
                penalty: this.financialsData.penalty,
                attorneyFee: this.financialsData.attorneyFee,
                courtCost: this.financialsData.courtCost,
                billableHours: this.financialsData.billableHours
            };
            this.showFinancialsModal = true;
        },
        saveFinancials() {
            this.financialsData = { ...this.editForm };
            this.showFinancialsModal = false;
            alert('财务信息已更新');
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
                    <div class="info-row">
                        <span class="label">诉讼标的额</span>
                        <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">{{ formatCurrency(financialsData.totalAmount) }}</span>
                    </div>
                    <div style="padding: 12px; background: #f5f5f5; border-radius: 6px; margin: 12px 0; font-size: 13px; color: #666;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>欠款本金</span>
                            <span>{{ formatCurrency(financialsData.principal) }}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>违约金</span>
                            <span>{{ formatCurrency(financialsData.penalty) }}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <span class="label">律师费报价</span>
                        <span class="value">{{ formatCurrency(financialsData.attorneyFee) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">预估诉讼费</span>
                        <span class="value">{{ formatCurrency(financialsData.courtCost) }}（按标的额计算）</span>
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
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label">诉讼标的额</label>
                            <input type="number" class="smart-input" v-model.number="editForm.totalAmount" placeholder="请输入诉讼标的额">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">欠款本金</label>
                            <input type="number" class="smart-input" v-model.number="editForm.principal" placeholder="请输入欠款本金">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">违约金</label>
                            <input type="number" class="smart-input" v-model.number="editForm.penalty" placeholder="请输入违约金">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">律师费报价</label>
                            <input type="number" class="smart-input" v-model.number="editForm.attorneyFee" placeholder="请输入律师费报价">
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
