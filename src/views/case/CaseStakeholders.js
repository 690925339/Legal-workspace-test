import CaseModuleLayout from '../../components/case/CaseModuleLayout.js';

/**
 * 当事人信息模块
 */
export default {
    name: 'CaseStakeholders',
    components: {
        CaseModuleLayout
    },
    data() {
        return {
            caseId: '',
            caseData: {},
            stakeholders: {
                plaintiffs: [
                    {
                        id: 1,
                        name: '张三',
                        type: 'person',
                        idNumber: '110101198001011234',
                        phone: '13800138000',
                        address: '北京市朝阳区某某街道123号',
                        role: '原告',
                        // 联系人信息
                        contactName: '王经理',
                        contactRole: '主要联络人',
                        contactPhone: '138-0000-1234',
                        contactEmail: 'wang@abc.com'
                    }
                ],
                defendants: [
                    {
                        id: 1,
                        name: '某科技有限公司',
                        type: 'company',
                        legalRepresentative: '李四',
                        creditCode: '91110000MA01A2B3C4',
                        address: '北京市海淀区某某大厦10层',
                        lawyer: '王律师（某律所）',
                        role: '被告',
                        // 联系人信息
                        contactName: '',
                        contactRole: '',
                        contactPhone: '',
                        contactEmail: ''
                    }
                ],
                thirdParties: []
            },
            showStakeholderModal: false,
            currentStakeholder: null,
            stakeholderType: 'plaintiff'
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
        addStakeholder(type) {
            this.stakeholderType = type;
            this.currentStakeholder = {
                id: null,
                name: '',
                type: 'person',
                idNumber: '',
                phone: '',
                address: '',
                role: type === 'plaintiff' ? '原告' : (type === 'defendant' ? '被告' : '第三人'),
                legalRepresentative: '',
                creditCode: '',
                lawyer: '',
                // 联系人信息
                contactName: '',
                contactRole: '',
                contactPhone: '',
                contactEmail: ''
            };
            this.showStakeholderModal = true;
        },
        editStakeholder(type, stakeholder) {
            this.stakeholderType = type;
            this.currentStakeholder = JSON.parse(JSON.stringify(stakeholder));
            this.showStakeholderModal = true;
        },
        deleteStakeholder(type, id) {
            if (!confirm('确定要删除该当事人吗？')) return;

            let listName = '';
            if (type === 'plaintiff') listName = 'plaintiffs';
            else if (type === 'defendant') listName = 'defendants';
            else listName = 'thirdParties';

            this.stakeholders[listName] = this.stakeholders[listName].filter(item => item.id !== id);
        },
        saveStakeholder() {
            if (!this.currentStakeholder.name) {
                alert('请输入姓名/名称');
                return;
            }

            let listName = '';
            if (this.stakeholderType === 'plaintiff') listName = 'plaintiffs';
            else if (this.stakeholderType === 'defendant') listName = 'defendants';
            else listName = 'thirdParties';

            if (this.currentStakeholder.id) {
                const index = this.stakeholders[listName].findIndex(item => item.id === this.currentStakeholder.id);
                if (index !== -1) {
                    this.stakeholders[listName].splice(index, 1, this.currentStakeholder);
                }
            } else {
                this.currentStakeholder.id = Date.now();
                this.stakeholders[listName].push(this.currentStakeholder);
            }

            this.showStakeholderModal = false;
        }
    },
    template: `
        <CaseModuleLayout :case-id="caseId" active-module="stakeholders" @case-loaded="onCaseLoaded">
            <div class="tab-pane">
                <!-- 原告和被告并排显示 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <!-- 原告列 -->
                    <div class="modern-card">
                        <div class="card-header" style="background: transparent;">
                            <div class="card-title">
                                原告（我方客户）
                            </div>
                            <button class="smart-btn-secondary" style="font-size: 13px; padding: 4px 12px;" @click="addStakeholder('plaintiff')">
                                <i class="fas fa-plus"></i> 添加
                            </button>
                        </div>
                        <div v-for="(plaintiff, index) in stakeholders.plaintiffs" :key="plaintiff.id" 
                             :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div style="font-weight: 600; font-size: 15px; color: #1a1a1a;">
                                    {{ plaintiff.name }}
                                    <span style="display: inline-block; background: #eef2ff; color: #4f46e5; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-left: 8px;">
                                        {{ plaintiff.type === 'person' ? '自然人' : '法人' }}
                                    </span>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="icon-btn" @click="editStakeholder('plaintiff', plaintiff)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-btn" style="color: #dc2626;" @click="deleteStakeholder('plaintiff', plaintiff.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                                <div class="info-row" v-if="plaintiff.type === 'person' && plaintiff.idNumber">
                                    <span class="label">身份证号</span>
                                    <span class="value">{{ plaintiff.idNumber }}</span>
                                </div>
                                <div class="info-row" v-if="plaintiff.type === 'company' && plaintiff.creditCode">
                                    <span class="label">信用代码</span>
                                    <span class="value">{{ plaintiff.creditCode }}</span>
                                </div>
                                <div class="info-row" v-if="plaintiff.phone">
                                    <span class="label">联系电话</span>
                                    <span class="value">{{ plaintiff.phone }}</span>
                                </div>
                                <div class="info-row" v-if="plaintiff.address" style="grid-column: span 2;">
                                    <span class="label">地址</span>
                                    <span class="value">{{ plaintiff.address }}</span>
                                </div>
                            </div>
                            <div v-if="plaintiff.contactName" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e5e5;">
                                <div style="font-size: 13px; color: #888; margin-bottom: 8px;">
                                    <i class="fas fa-address-book" style="margin-right: 6px;"></i>联系人
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                                    <div class="info-row">
                                        <span class="label">姓名</span>
                                        <span class="value">{{ plaintiff.contactName }}</span>
                                    </div>
                                    <div class="info-row" v-if="plaintiff.contactRole">
                                        <span class="label">职位</span>
                                        <span class="value">{{ plaintiff.contactRole }}</span>
                                    </div>
                                    <div class="info-row" v-if="plaintiff.contactPhone">
                                        <span class="label">电话</span>
                                        <span class="value">{{ plaintiff.contactPhone }}</span>
                                    </div>
                                    <div class="info-row" v-if="plaintiff.contactEmail">
                                        <span class="label">邮箱</span>
                                        <span class="value">{{ plaintiff.contactEmail }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="stakeholders.plaintiffs.length === 0" style="text-align: center; padding: 32px 16px; color: #999;">
                            <i class="fas fa-user-plus" style="font-size: 28px; margin-bottom: 12px; opacity: 0.3;"></i>
                            <div style="font-size: 14px;">点击上方按钮添加原告</div>
                        </div>
                    </div>

                    <!-- 被告列 -->
                    <div class="modern-card">
                        <div class="card-header" style="background: transparent;">
                            <div class="card-title">
                                被告
                            </div>
                            <button class="smart-btn-secondary" style="font-size: 13px; padding: 4px 12px;" @click="addStakeholder('defendant')">
                                <i class="fas fa-plus"></i> 添加
                            </button>
                        </div>
                        <div v-for="(defendant, index) in stakeholders.defendants" :key="defendant.id"
                             :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div style="font-weight: 600; font-size: 15px; color: #1a1a1a;">
                                    {{ defendant.name }}
                                    <span style="display: inline-block; background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-left: 8px;">
                                        {{ defendant.type === 'person' ? '自然人' : '法人' }}
                                    </span>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button class="icon-btn" @click="editStakeholder('defendant', defendant)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="icon-btn" style="color: #dc2626;" @click="deleteStakeholder('defendant', defendant.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                                <div class="info-row" v-if="defendant.type === 'company' && defendant.legalRepresentative">
                                    <span class="label">法定代表人</span>
                                    <span class="value">{{ defendant.legalRepresentative }}</span>
                                </div>
                                <div class="info-row" v-if="defendant.type === 'company' && defendant.creditCode">
                                    <span class="label">信用代码</span>
                                    <span class="value">{{ defendant.creditCode }}</span>
                                </div>
                                <div class="info-row" v-if="defendant.type === 'person' && defendant.idNumber">
                                    <span class="label">身份证号</span>
                                    <span class="value">{{ defendant.idNumber }}</span>
                                </div>
                                <div class="info-row" v-if="defendant.lawyer">
                                    <span class="label">对方律师</span>
                                    <span class="value">{{ defendant.lawyer }}</span>
                                </div>
                                <div class="info-row" v-if="defendant.address" style="grid-column: span 2;">
                                    <span class="label">地址</span>
                                    <span class="value">{{ defendant.address }}</span>
                                </div>
                            </div>
                            <div v-if="defendant.contactName" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e5e5;">
                                <div style="font-size: 13px; color: #888; margin-bottom: 8px;">
                                    <i class="fas fa-address-book" style="margin-right: 6px;"></i>联系人
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                                    <div class="info-row">
                                        <span class="label">姓名</span>
                                        <span class="value">{{ defendant.contactName }}</span>
                                    </div>
                                    <div class="info-row" v-if="defendant.contactRole">
                                        <span class="label">职位</span>
                                        <span class="value">{{ defendant.contactRole }}</span>
                                    </div>
                                    <div class="info-row" v-if="defendant.contactPhone">
                                        <span class="label">电话</span>
                                        <span class="value">{{ defendant.contactPhone }}</span>
                                    </div>
                                    <div class="info-row" v-if="defendant.contactEmail">
                                        <span class="label">邮箱</span>
                                        <span class="value">{{ defendant.contactEmail }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="stakeholders.defendants.length === 0" style="text-align: center; padding: 32px 16px; color: #999;">
                            <i class="fas fa-user-plus" style="font-size: 28px; margin-bottom: 12px; opacity: 0.3;"></i>
                            <div style="font-size: 14px;">点击上方按钮添加被告</div>
                        </div>
                    </div>
                </div>

                <!-- 第三人列表 -->
                <div class="modern-card" v-if="stakeholders.thirdParties.length > 0">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">
                            第三人
                        </div>
                        <button class="smart-btn-secondary" style="font-size: 13px; padding: 4px 12px;" @click="addStakeholder('thirdParty')">
                            <i class="fas fa-plus"></i> 添加
                        </button>
                    </div>
                    <div v-for="(thirdParty, index) in stakeholders.thirdParties" :key="thirdParty.id" 
                         :style="{borderTop: index > 0 ? '1px solid #e5e5e5' : 'none', paddingTop: index > 0 ? '16px' : '0', marginTop: index > 0 ? '16px' : '0'}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-weight: 600; font-size: 15px; color: #1a1a1a;">
                                {{ thirdParty.name }}
                                <span style="display: inline-block; background: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-left: 8px;">
                                    {{ thirdParty.type === 'person' ? '自然人' : '法人' }}
                                </span>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="icon-btn" @click="editStakeholder('thirdParty', thirdParty)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-btn" style="color: #dc2626;" @click="deleteStakeholder('thirdParty', thirdParty.id)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                            <div class="info-row" v-if="thirdParty.type === 'person' && thirdParty.idNumber">
                                <span class="label">身份证号</span>
                                <span class="value">{{ thirdParty.idNumber }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.type === 'company' && thirdParty.creditCode">
                                <span class="label">信用代码</span>
                                <span class="value">{{ thirdParty.creditCode }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.phone">
                                <span class="label">联系电话</span>
                                <span class="value">{{ thirdParty.phone }}</span>
                            </div>
                            <div class="info-row" v-if="thirdParty.address" style="grid-column: span 2;">
                                <span class="label">地址</span>
                                <span class="value">{{ thirdParty.address }}</span>
                            </div>
                        </div>
                        <div v-if="thirdParty.contactName" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e5e5;">
                            <div style="font-size: 13px; color: #888; margin-bottom: 8px;">
                                <i class="fas fa-address-book" style="margin-right: 6px;"></i>联系人
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
                                <div class="info-row">
                                    <span class="label">姓名</span>
                                    <span class="value">{{ thirdParty.contactName }}</span>
                                </div>
                                <div class="info-row" v-if="thirdParty.contactRole">
                                    <span class="label">职位</span>
                                    <span class="value">{{ thirdParty.contactRole }}</span>
                                </div>
                                <div class="info-row" v-if="thirdParty.contactPhone">
                                    <span class="label">电话</span>
                                    <span class="value">{{ thirdParty.contactPhone }}</span>
                                </div>
                                <div class="info-row" v-if="thirdParty.contactEmail">
                                    <span class="label">邮箱</span>
                                    <span class="value">{{ thirdParty.contactEmail }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="stakeholders.thirdParties.length === 0" style="text-align: center; padding: 32px 16px; color: #999;">
                        <i class="fas fa-user-plus" style="font-size: 28px; margin-bottom: 12px; opacity: 0.3;"></i>
                        <div style="font-size: 14px;">点击上方按钮添加第三人</div>
                    </div>
                </div>
                
                <!-- 添加第三人按钮（当没有第三人时） -->
                <div v-if="stakeholders.thirdParties.length === 0" style="text-align: center; padding: 16px;">
                    <button class="smart-btn-secondary" style="font-size: 14px; padding: 8px 20px;" @click="addStakeholder('thirdParty')">
                        <i class="fas fa-plus"></i> 添加第三人
                    </button>
                </div>
            </div>

            <!-- Stakeholder Modal -->
            <div v-if="showStakeholderModal" class="modal-overlay" @click.self="showStakeholderModal = false">
                <div class="modal-container" style="width: 600px;">
                    <div class="modal-header">
                        <div class="modal-title">{{ currentStakeholder.id ? '编辑' : '添加' }}{{ currentStakeholder.role }}</div>
                        <button class="modal-close" @click="showStakeholderModal = false">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="smart-form-group">
                            <label class="smart-label">主体类型</label>
                            <div style="display: flex; gap: 16px;">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" v-model="currentStakeholder.type" value="person">
                                    <span>自然人</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="radio" v-model="currentStakeholder.type" value="company">
                                    <span>法人/组织</span>
                                </label>
                            </div>
                        </div>

                        <div class="smart-form-group">
                            <label class="smart-label required">{{ currentStakeholder.type === 'company' ? '公司名称' : '姓名' }}</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.name" :placeholder="currentStakeholder.type === 'company' ? '请输入公司全称' : '请输入姓名'">
                        </div>

                        <!-- 自然人特有字段 -->
                        <template v-if="currentStakeholder.type === 'person'">
                            <div class="smart-form-group">
                                <label class="smart-label">身份证号</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.idNumber" placeholder="请输入身份证号">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">联系电话</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.phone" placeholder="请输入联系电话">
                            </div>
                        </template>

                        <!-- 公司特有字段 -->
                        <template v-if="currentStakeholder.type === 'company'">
                            <div class="smart-form-group">
                                <label class="smart-label">统一信用代码</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.creditCode" placeholder="请输入统一社会信用代码">
                            </div>
                            <div class="smart-form-group">
                                <label class="smart-label">法定代表人</label>
                                <input type="text" class="smart-input" v-model="currentStakeholder.legalRepresentative" placeholder="请输入法定代表人姓名">
                            </div>
                        </template>

                        <div class="smart-form-group">
                            <label class="smart-label">地址</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.address" placeholder="请输入联系地址">
                        </div>

                        <div class="smart-form-group" v-if="stakeholderType !== 'plaintiff'">
                            <label class="smart-label">代理律师</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.lawyer" placeholder="请输入对方代理律师信息">
                        </div>

                        <!-- 联系人信息 -->
                        <div style="border-top: 1px solid #e5e5e5; margin: 16px 0; padding-top: 16px;">
                            <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #666;">
                                <i class="fas fa-address-book" style="margin-right: 8px;"></i>联系人信息
                            </div>
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">联系人姓名</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.contactName" placeholder="请输入联系人姓名">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">联系人职位</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.contactRole" placeholder="请输入职位或角色">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">联系人电话</label>
                            <input type="text" class="smart-input" v-model="currentStakeholder.contactPhone" placeholder="请输入联系电话">
                        </div>
                        <div class="smart-form-group">
                            <label class="smart-label">联系人邮箱</label>
                            <input type="email" class="smart-input" v-model="currentStakeholder.contactEmail" placeholder="请输入邮箱地址">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="smart-btn-secondary" @click="showStakeholderModal = false">取消</button>
                        <button class="smart-btn-primary" @click="saveStakeholder"><i class="fas fa-save"></i> 保存</button>
                    </div>
                </div>
            </div>
        </CaseModuleLayout>
    `
};
