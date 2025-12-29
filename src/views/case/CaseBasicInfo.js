import CaseModuleLayout from '../../components/case/CaseModuleLayout.js';

/**
 * 基础信息模块
 */
export default {
    name: 'CaseBasicInfo',
    components: {
        CaseModuleLayout
    },
    data() {
        return {
            caseId: '',
            caseData: {},
            stageOptions: ['咨询', '立案', '一审', '二审', '再审', '执行', '结案'],
            showBasicInfoModal: false,
            editForm: {}
        };
    },
    created() {
        // 从 URL 获取案件 ID
        const hash = window.location.hash;
        const match = hash.match(/\/detail\/([^/]+)/);
        this.caseId = match ? match[1] : '1';
    },
    methods: {
        onCaseLoaded(data) {
            this.caseData = data;
        },
        editBasicInfo() {
            this.editForm = {
                name: this.caseData.name,
                id: this.caseData.id,
                type: this.caseData.type,
                category: this.caseData.category,
                court: this.caseData.court || '',
                filingDate: this.caseData.filingDate || '',
                stage: this.caseData.stage || '咨询'
            };
            this.showBasicInfoModal = true;
        },
        saveBasicInfo() {
            this.caseData.name = this.editForm.name;
            this.caseData.id = this.editForm.id;
            this.caseData.type = this.editForm.type;
            this.caseData.category = this.editForm.category;
            this.caseData.court = this.editForm.court;
            this.caseData.filingDate = this.editForm.filingDate;
            this.caseData.stage = this.editForm.stage;
            this.showBasicInfoModal = false;
            alert('基础信息已更新');
        }
    },
    template: `
        <CaseModuleLayout :case-id="caseId" active-module="basic" @case-loaded="onCaseLoaded">
            <div class="tab-pane">
                <div class="dashboard-grid">
                    <div class="modern-card">
                        <div class="card-header" style="background: transparent;">
                            <div class="card-title">基础信息</div>
                            <button class="icon-btn" style="font-size: 14px;" @click="editBasicInfo">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px;">
                            <div class="info-row">
                                <span class="label">案件标题</span>
                                <span class="value">{{ caseData.name }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">案件编号</span>
                                <span class="value">{{ caseData.id }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">案由</span>
                                <span class="value">{{ caseData.type }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">具体案由</span>
                                <span class="value">{{ caseData.category }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">案件阶段</span>
                                <span class="value">{{ caseData.stage || '-' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">管辖法院/仲裁委</span>
                                <span class="value">{{ caseData.court || '-' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">承办法官</span>
                                <span class="value">{{ caseData.judge || '-' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">立案日期</span>
                                <span class="value">{{ caseData.filingDate || '-' }}</span>
                            </div>
                            <div class="info-row" style="grid-column: span 2;">
                                <span class="label">诉讼时效/上诉截止日</span>
                                <span class="value" style="color: #dc2626; font-weight: 500;">{{ caseData.deadline || '-' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Basic Info Edit Modal -->
            <div v-if="showBasicInfoModal" class="modal-overlay" @click.self="showBasicInfoModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">编辑基础信息</div>
                        <button class="modal-close" @click="showBasicInfoModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label required">案件名称</label>
                            <input type="text" class="smart-input" v-model="editForm.name" placeholder="请输入案件名称">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案件编号</label>
                            <input type="text" class="smart-input" v-model="editForm.id" placeholder="请输入案件编号">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案由</label>
                            <input type="text" class="smart-input" v-model="editForm.type" placeholder="请输入案由">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">具体案由</label>
                            <input type="text" class="smart-input" v-model="editForm.category" placeholder="请输入具体案由">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">管辖法院/仲裁委</label>
                            <input type="text" class="smart-input" v-model="editForm.court" placeholder="请输入管辖法院或仲裁委">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">立案日期</label>
                            <input type="date" class="smart-input" v-model="editForm.filingDate">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">案件阶段</label>
                            <select class="smart-select" v-model="editForm.stage">
                                <option v-for="stage in stageOptions" :key="stage" :value="stage">{{ stage }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showBasicInfoModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveBasicInfo"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>
        </CaseModuleLayout>
    `
};
