export default {
    name: 'CaseForm',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        editId: {
            type: [String, Number],
            default: null
        }
    },
    emits: ['close', 'saved'],
    data() {
        return {
            form: {
                // 基础信息
                name: '',
                caseId: '',
                type: '',
                legalCause: '',
                caseStage: '',
                court: '',
                judge: '',
                filingDate: new Date().toISOString().split('T')[0],
                deadline: '',

                // 当事人信息
                clientName: '',
                clientType: 'individual',
                clientId: '',
                opposingName: '',
                opposingType: 'company',
                opposingRep: '',
                opposingCounsel: '',

                // 案情描述
                description: '', // 案情摘要
                disputeFocus: '', // 争议焦点
                objective: '', // 客户诉求

                // 财务信息
                amount: '',
                attorneyFee: '',
                courtCost: '',
                billableHours: ''
            }
        };
    },
    computed: {
        isEdit() {
            return !!this.editId;
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                if (this.editId) {
                    this.loadCaseData(this.editId);
                } else {
                    this.resetForm();
                }
            }
        }
    },
    methods: {
        resetForm() {
            this.form = {
                name: '', caseId: '', type: '', legalCause: '', caseStage: '', court: '', judge: '', filingDate: new Date().toISOString().split('T')[0], deadline: '',
                clientName: '', clientType: 'individual', clientId: '', opposingName: '', opposingType: 'company', opposingRep: '', opposingCounsel: '',
                description: '', disputeFocus: '', objective: '',
                amount: '', attorneyFee: '', courtCost: '', billableHours: ''
            };
        },
        loadCaseData(id) {
            // Simulate fetching data based on ID
            console.log('Loading case data for:', id);
            this.form = {
                // 基础信息
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                caseId: 'CASE-2023-001',
                type: 'civil',
                legalCause: '买卖合同纠纷',
                caseStage: 'first_instance',
                court: '上海市浦东新区人民法院',
                judge: '张法官',
                filingDate: '2023-10-01',
                deadline: '2024-10-01',

                // 当事人信息
                clientName: 'ABC 公司',
                clientType: 'company',
                clientId: '91310000XXXXXXXXXX',
                opposingName: 'XYZ 有限公司',
                opposingType: 'company',
                opposingRep: '李四',
                opposingCounsel: '王律师',

                // 案情描述
                description: '因被告未按合同约定支付广告费用引发的纠纷。',
                disputeFocus: '合同履行情况, 违约金计算标准',
                objective: '支付欠款及违约金',

                // 财务信息
                amount: '500,000.00',
                attorneyFee: '50,000.00',
                courtCost: '8,800.00',
                billableHours: '12.5'
            };
        },
        saveCase() {
            if (!this.validateForm()) return;
            // In a real app, we would save to backend here
            this.$emit('saved', this.form);
            this.close();
        },
        saveAndNew() {
            if (!this.validateForm()) return;
            this.$emit('saved', this.form);
            alert('案件已保存！');
            this.resetForm();
            // Keep modal open for new entry
        },
        close() {
            this.$emit('close');
        },
        validateForm() {
            if (!this.form.name) { alert('请输入案件名称'); return false; }
            if (!this.form.type) { alert('请选择案件类型'); return false; }
            if (!this.form.filingDate) { alert('请选择立案日期'); return false; }
            return true;
        }
    },
    template: `
        <div class="modal-overlay" v-if="visible" @click.self="close">
            <div class="modal-container" style="max-width: 900px; width: 90%; max-height: 90vh; display: flex; flex-direction: column;">
                <div class="modal-header">
                    <div class="modal-title">{{ isEdit ? '编辑案件' : '新建案件' }}</div>
                    <button class="modal-close" @click="close"><i class="fas fa-times"></i></button>
                </div>
                
                <div class="modal-body" style="flex: 1; overflow-y: auto; padding: 20px;">
                    <form @submit.prevent>
                        <!-- 1. 基础信息 -->
                        <div class="smart-card" style="margin-bottom: 24px; box-shadow: none; border: 1px solid #e5e5e5;">
                            <div class="card-header" style="padding: 15px 20px; border-bottom: 1px solid #e5e5e5; background: #fafafa;">
                                <div class="card-title" style="font-size: 15px; font-weight: 600;">
                                    <i class="fas fa-file-alt" style="margin-right: 8px; color: #1a1a1a;"></i>基础信息
                                </div>
                            </div>
                            <div class="smart-card-content">
                                <div class="smart-form-grid">
                                    <div class="smart-form-group full-width">
                                        <label class="smart-label required">案件名称</label>
                                        <input type="text" v-model="form.name" placeholder="例如：ABC 公司诉 XYZ 有限公司合同纠纷案" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">案件编号</label>
                                        <input type="text" v-model="form.caseId" placeholder="系统自动生成" class="smart-input" :disabled="isEdit">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label required">案由 (一级)</label>
                                        <select v-model="form.type" class="smart-select">
                                            <option value="">请选择...</option>
                                            <option value="civil">民事</option>
                                            <option value="criminal">刑事</option>
                                            <option value="administrative">行政</option>
                                            <option value="ip">知识产权</option>
                                        </select>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">具体案由</label>
                                        <input type="text" v-model="form.legalCause" placeholder="例如：买卖合同纠纷" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">案件阶段</label>
                                        <select v-model="form.caseStage" class="smart-select">
                                            <option value="">请选择...</option>
                                            <option value="consultation">咨询</option>
                                            <option value="filing">立案</option>
                                            <option value="first_instance">一审</option>
                                            <option value="second_instance">二审</option>
                                            <option value="execution">执行</option>
                                            <option value="closed">结案</option>
                                        </select>
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">管辖法院/机构</label>
                                        <input type="text" v-model="form.court" placeholder="请输入受理法院" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">承办法官</label>
                                        <input type="text" v-model="form.judge" placeholder="请输入法官姓名" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label required">立案日期</label>
                                        <input type="date" v-model="form.filingDate" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">诉讼时效/截止日</label>
                                        <input type="date" v-model="form.deadline" class="smart-input">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 2. 当事人信息 -->
                        <div class="smart-card" style="margin-bottom: 24px; box-shadow: none; border: 1px solid #e5e5e5;">
                            <div class="card-header" style="padding: 15px 20px; border-bottom: 1px solid #e5e5e5; background: #fafafa;">
                                <div class="card-title" style="font-size: 15px; font-weight: 600;">
                                    <i class="fas fa-users" style="margin-right: 8px; color: #1a1a1a;"></i>当事人信息
                                </div>
                            </div>
                            <div class="smart-card-content">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                                    <!-- Client Side -->
                                    <div>
                                        <h4 style="margin-bottom: 16px; font-size: 14px; color: #666;">我方客户</h4>
                                        <div class="smart-form-group">
                                            <label class="smart-label">名称/姓名</label>
                                            <input type="text" v-model="form.clientName" class="smart-input">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">主体类型</label>
                                            <select v-model="form.clientType" class="smart-select">
                                                <option value="individual">自然人</option>
                                                <option value="company">法人企业</option>
                                                <option value="org">非法人组织</option>
                                            </select>
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">证件号码/信用代码</label>
                                            <input type="text" v-model="form.clientId" class="smart-input">
                                        </div>
                                    </div>
                                    <!-- Opposing Side -->
                                    <div>
                                        <h4 style="margin-bottom: 16px; font-size: 14px; color: #666;">对方当事人</h4>
                                        <div class="smart-form-group">
                                            <label class="smart-label">名称/姓名</label>
                                            <input type="text" v-model="form.opposingName" class="smart-input">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">主体类型</label>
                                            <select v-model="form.opposingType" class="smart-select">
                                                <option value="individual">自然人</option>
                                                <option value="company">法人企业</option>
                                                <option value="org">非法人组织</option>
                                            </select>
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">法定代表人</label>
                                            <input type="text" v-model="form.opposingRep" class="smart-input">
                                        </div>
                                        <div class="smart-form-group">
                                            <label class="smart-label">对方代理律师</label>
                                            <input type="text" v-model="form.opposingCounsel" class="smart-input">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 3. 案情描述 -->
                        <div class="smart-card" style="margin-bottom: 24px; box-shadow: none; border: 1px solid #e5e5e5;">
                            <div class="card-header" style="padding: 15px 20px; border-bottom: 1px solid #e5e5e5; background: #fafafa;">
                                <div class="card-title" style="font-size: 15px; font-weight: 600;">
                                    <i class="fas fa-align-left" style="margin-right: 8px; color: #1a1a1a;"></i>案情描述
                                </div>
                            </div>
                            <div class="smart-card-content">
                                <div class="smart-form-group full-width">
                                    <label class="smart-label">案情摘要</label>
                                    <textarea v-model="form.description" class="smart-textarea" rows="4" placeholder="请输入案件的详细背景和经过..."></textarea>
                                </div>
                                <div class="smart-form-group full-width">
                                    <label class="smart-label">争议焦点</label>
                                    <input type="text" v-model="form.disputeFocus" placeholder="多个焦点请用逗号分隔" class="smart-input">
                                </div>
                                <div class="smart-form-group full-width">
                                    <label class="smart-label">客户诉求</label>
                                    <textarea v-model="form.objective" class="smart-textarea" rows="2" placeholder="请输入客户的具体诉求..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 4. 财务信息 -->
                        <div class="smart-card" style="margin-bottom: 24px; box-shadow: none; border: 1px solid #e5e5e5;">
                            <div class="card-header" style="padding: 15px 20px; border-bottom: 1px solid #e5e5e5; background: #fafafa;">
                                <div class="card-title" style="font-size: 15px; font-weight: 600;">
                                    <i class="fas fa-calculator" style="margin-right: 8px; color: #1a1a1a;"></i>财务信息
                                </div>
                            </div>
                            <div class="smart-card-content">
                                <div class="smart-form-grid">
                                    <div class="smart-form-group">
                                        <label class="smart-label">诉讼标的额 (CNY)</label>
                                        <input type="text" v-model="form.amount" placeholder="0.00" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">律师费报价 (CNY)</label>
                                        <input type="text" v-model="form.attorneyFee" placeholder="0.00" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">预估诉讼费 (CNY)</label>
                                        <input type="text" v-model="form.courtCost" placeholder="0.00" class="smart-input">
                                    </div>
                                    <div class="smart-form-group">
                                        <label class="smart-label">计费时长 (小时)</label>
                                        <input type="number" v-model="form.billableHours" placeholder="0.0" class="smart-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="smart-btn-secondary" @click="close">
                        取消
                    </button>
                    <button v-if="!isEdit" type="button" class="smart-btn-secondary" @click="saveAndNew">
                        保存并新建
                    </button>
                    <button type="button" class="smart-btn-primary" @click="saveCase">
                        <i class="fas fa-save"></i> 保存
                    </button>
                </div>
            </div>
        </div>
    `
};
