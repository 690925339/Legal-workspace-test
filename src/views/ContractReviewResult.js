import { router } from '../router.js';

export default {
    name: 'ContractReviewResult',
    data() {
        return {
            currentStep: 1, // 1: 合同概览, 2: 审查清单, 3: 审查结果
            // 审查方式
            contractType: '著作权许可使用合同',
            reviewStance: 'party_a', // party_a: 甲方立场, party_b: 乙方立场, neutral: 中立立场
            reviewIntensity: 'strong', // strong: 强势, weak: 弱势, balanced: 均势

            // 合同概览（可编辑）
            overview: {
                partyA: {
                    label: '被授权单位：',
                    value: '（未填写）',
                    editable: true
                },
                partyB: {
                    label: '易族智汇（北京）科技有限公司',
                    value: '',
                    editable: false
                },
                amount: {
                    label: '￥100000元（人民币拾万元整）',
                    value: '',
                    editable: false
                },
                period: {
                    label: '自2020年04月09日至2021年05月01日（源码升级权限期），售后支持有效期为合同生效后6个月内，Bug永久免费修复',
                    value: '',
                    editable: false
                },
                content: {
                    label: '该合同约定，甲方从乙方处购买易族智汇B2B2C网店系统（Javashop）的永久使用权，授权限于1个域名，含源代码交付、Git访问权限1年、技术支持及培训服务。合同总金额为10万元，分两期支付。乙方提供永久Bug修复，支持服务有效期6个月。甲方验收后3日内未反馈视为确认收货。',
                    value: '',
                    editable: false
                }
            },

            // 审查清单
            checklistItems: [
                { id: 1, text: '在合同公开性条款中，作品公开性审查', checked: true },
                { id: 2, text: '在合同交付条款中，物料交付与相关安排审查', checked: true },
                { id: 3, text: '在合同解除条款中，审查是否约定合同解除条件', checked: true },
                { id: 4, text: '在合同违约责任条款中，根据双方的合同义务确定违约责任', checked: true },
                { id: 5, text: '在合同争议解决条款中，争议解决的方式必须明确不能既约定诉讼又约定仲裁', checked: true },
                { id: 6, text: '在合同争议解决条款中，争议解决机构应当明确', checked: true },
                { id: 7, text: '是否有送达与通知条款', checked: true },
                { id: 8, text: '在合同形式与生效条款中，合同生效与签订日期审查', checked: true },
                { id: 9, text: '在合同主体条款中，审查合同当事人的名称（姓名）、住所等基本信息', checked: true },
                { id: 10, text: '在合同法律引用条款中，确保引用法律文件名称的准确性和有效性', checked: true },
                { id: 11, text: '在合同作品信息条款中，作品基本信息审查', checked: true },
                { id: 12, text: '在合同权属条款中，著作权权属与负担审查', checked: true }
            ],
            allChecked: true,

            // 审查结果
            activeResultTab: 'risk', // risk: 风险审查, subject: 主体审查
            reviewResults: [
                { id: 1, text: '在合同公开性条款中，作品公开性审查', risk: 'pass', issues: 0 },
                { id: 2, text: '在合同交付条款中，物料交付与相关安排审查', risk: 'pass', issues: 0 },
                { id: 3, text: '在合同作品信息条款中，作品基本信息审查', risk: 'pass', issues: 0 },
                { id: 4, text: '在合同权属条款中，著作权权属与负担审查', risk: 'pass', issues: 0 },
                { id: 5, text: '在合同权利范围条款中，著作权财产权明确性审查', risk: 'high', issues: 1 },
                { id: 6, text: '在合同许可使用权性质条款中，许可使用权性质审查', risk: 'high', issues: 1 },
                { id: 7, text: '在合同地域条款中，地域许可范围审查', risk: 'high', issues: 1 },
                { id: 8, text: '在合同期限条款中，许可使用期限审查', risk: 'medium', issues: 1 },
                { id: 9, text: '在合同报酬条款中，报酬支付方式审查', risk: 'medium', issues: 1 }
            ]
        }
    },
    computed: {
        highRiskCount() {
            return this.reviewResults.filter(item => item.risk === 'high').length;
        },
        mediumRiskCount() {
            return this.reviewResults.filter(item => item.risk === 'medium').length;
        },
        lowRiskCount() {
            return this.reviewResults.filter(item => item.risk === 'low').length;
        },
        passCount() {
            return this.reviewResults.filter(item => item.risk === 'pass').length;
        },
        completedCount() {
            return this.reviewResults.length;
        },
        totalCount() {
            return this.checklistItems.length;
        }
    },
    methods: {
        goToStep(step) {
            this.currentStep = step;
        },
        changeReviewStance(stance) {
            this.reviewStance = stance;
        },
        changeReviewIntensity(intensity) {
            this.reviewIntensity = intensity;
        },
        generateChecklist() {
            // 跳转到审查清单步骤
            this.currentStep = 2;
        },
        toggleAllChecklist() {
            this.allChecked = !this.allChecked;
            this.checklistItems.forEach(item => {
                item.checked = this.allChecked;
            });
        },
        toggleChecklistItem(itemId) {
            const item = this.checklistItems.find(i => i.id === itemId);
            if (item) {
                item.checked = !item.checked;
            }
            // 更新全选状态
            this.allChecked = this.checklistItems.every(i => i.checked);
        },
        startReview() {
            // 跳转到审查结果步骤
            this.currentStep = 3;
        },
        goBack() {
            router.back();
        }
    },
    template: `
        <div style="display: flex; height: 100vh; overflow: hidden;">
            <!-- 左侧：文档预览 -->
            <div style="flex: 1; background: white; display: flex; flex-direction: column; border-right: 1px solid #e5e5e5;">
                <!-- 文档工具栏 -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: #fafafa; border-bottom: 1px solid #e5e5e5; flex-shrink: 0;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-file-pdf" style="color: #d32f2f; font-size: 16px;"></i>
                            <span style="font-size: 13px; font-weight: 500; color: #1a1a1a;">b2b2c高级版合同模板</span>
                        </div>
                        <button class="smart-btn-primary" @click="goBack" style="padding: 8px 20px;">
                            <i class="fas fa-plus"></i> 新审查
                        </button>
                    </div>
                    
                    <!-- 文档内容区域 -->
                    <div style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5;">
                        <!-- 模拟PDF页面 -->
                        <div style="background: white; max-width: 800px; margin: 0 auto; padding: 60px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 100%;">
                            <!-- 文档头部 -->
                            <div style="text-align: center; margin-bottom: 40px;">
                                <div style="display: inline-block; margin-bottom: 20px;">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Ctext x='10' y='25' font-family='Arial' font-size='16' fill='%234a90e2'%3EJavashop%3C/text%3E%3C/svg%3E" alt="Logo" style="height: 30px;">
                                </div>
                                <div style="text-align: right; color: #e74c3c; font-size: 14px; margin-bottom: 20px;">合同编号：Y.J20040901</div>
                                <h1 style="font-size: 32px; font-weight: 600; color: #1a1a1a; margin: 40px 0; letter-spacing: 8px;">软<br>件<br>授<br>权<br>服<br>务<br>合<br>同</h1>
                            </div>
                            
                            <!-- 文档正文 -->
                            <div style="line-height: 2; color: #333; font-size: 14px;">
                                <p style="margin-bottom: 20px; text-indent: 2em;">
                                    甲方（被授权方）：_______________
                                </p>
                                <p style="margin-bottom: 20px; text-indent: 2em;">
                                    乙方（授权方）：易族智汇（北京）科技有限公司
                                </p>
                                <p style="margin-bottom: 20px; text-indent: 2em;">
                                    根据《中华人民共和国合同法》及相关法律法规的规定，甲乙双方在平等、自愿、公平、诚实信用的基础上，就软件授权使用事宜达成如下协议：
                                </p>
                                
                                <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0;">第一条 授权内容</h3>
                                <p style="margin-bottom: 15px; text-indent: 2em;">
                                    乙方授予甲方易族智汇B2B2C网店系统（Javashop）的永久使用权，授权范围限于1个域名。
                                </p>
                                
                                <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0;">第二条 合同金额</h3>
                                <p style="margin-bottom: 15px; text-indent: 2em;">
                                    合同总金额为人民币壹拾万元整（￥100,000.00），分两期支付。
                                </p>
                                
                                <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0;">第三条 履行期限</h3>
                                <p style="margin-bottom: 15px; text-indent: 2em;">
                                    自2020年04月09日至2021年05月01日（源码升级权限期），售后支持有效期为合同生效后6个月内，Bug永久免费修复。
                                </p>
                            </div>
                            
                            <!-- 页码 -->
                            <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                                <span style="font-size: 12px; color: #999;">第 1 页 共 3 页</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧：操作栏 -->
                <div style="width: 520px; background: white; display: flex; flex-direction: column; flex-shrink: 0;">
                    <!-- 步骤指示器 -->
                    <div style="padding: 16px 20px; border-bottom: 1px solid #e5e5e5; flex-shrink: 0;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <!-- 步骤1 -->
                            <div @click="goToStep(1)" :style="{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: currentStep === 1 ? '#f0f7ff' : 'transparent',
                                flex: 1
                            }">
                                <div :style="{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: currentStep === 1 ? '#1a73e8' : '#e5e5e5',
                                    color: currentStep === 1 ? 'white' : '#999',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    flexShrink: 0
                                }">1</div>
                                <span :style="{ fontSize: '13px', color: currentStep === 1 ? '#1a73e8' : '#666', fontWeight: currentStep === 1 ? '500' : '400' }">合同概览</span>
                            </div>

                            <!-- 步骤2 -->
                            <div @click="goToStep(2)" :style="{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: currentStep === 2 ? '#f0f7ff' : 'transparent',
                                flex: 1
                            }">
                                <div :style="{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: currentStep === 2 ? '#1a73e8' : '#e5e5e5',
                                    color: currentStep === 2 ? 'white' : '#999',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    flexShrink: 0
                                }">2</div>
                                <span :style="{ fontSize: '13px', color: currentStep === 2 ? '#1a73e8' : '#666', fontWeight: currentStep === 2 ? '500' : '400' }">审查清单</span>
                            </div>

                            <!-- 步骤3 -->
                            <div @click="goToStep(3)" :style="{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: currentStep === 3 ? '#f0f7ff' : 'transparent',
                                flex: 1
                            }">
                                <div :style="{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: currentStep === 3 ? '#1a73e8' : '#e5e5e5',
                                    color: currentStep === 3 ? 'white' : '#999',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '12px',
                                    flexShrink: 0
                                }">3</div>
                                <span :style="{ fontSize: '13px', color: currentStep === 3 ? '#1a73e8' : '#666', fontWeight: currentStep === 3 ? '500' : '400' }">审查结果</span>
                            </div>
                        </div>
                    </div>

                    <!-- 操作内容区域 -->
                    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                        <!-- 滚动内容区域 -->
                        <div style="flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 0;">
                        <!-- 步骤1：合同概览 -->
                    <template v-if="currentStep === 1">
                        <!-- 审查方式 -->
                        <div style="margin-bottom: 40px;">
                            <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">审查方式</h3>
                            
                            <!-- 合同类型 -->
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1a1a1a;">合同类型</label>
                                <select v-model="contractType" style="width: 100%; padding: 10px 12px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; color: #1a1a1a;">
                                    <option value="著作权许可使用合同">著作权许可使用合同</option>
                                    <option value="技术服务合同">技术服务合同</option>
                                    <option value="软件开发合同">软件开发合同</option>
                                    <option value="采购合同">采购合同</option>
                                </select>
                            </div>

                            <!-- 审查立场 -->
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1a1a1a;">审查立场</label>
                                <div style="display: flex; gap: 12px;">
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewStance === 'party_a' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewStance === 'party_a' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="stance" value="party_a" v-model="reviewStance" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">甲方立场</span>
                                    </label>
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewStance === 'party_b' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewStance === 'party_b' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="stance" value="party_b" v-model="reviewStance" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">乙方立场</span>
                                    </label>
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewStance === 'neutral' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewStance === 'neutral' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="stance" value="neutral" v-model="reviewStance" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">中立立场</span>
                                    </label>
                                </div>
                            </div>

                            <!-- 审查尺度 -->
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1a1a1a;">审查尺度</label>
                                <div style="display: flex; gap: 12px;">
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewIntensity === 'strong' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewIntensity === 'strong' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="intensity" value="strong" v-model="reviewIntensity" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">强势</span>
                                    </label>
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewIntensity === 'weak' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewIntensity === 'weak' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="intensity" value="weak" v-model="reviewIntensity" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">弱势</span>
                                    </label>
                                    <label :style="{
                                        flex: 1,
                                        padding: '10px',
                                        border: reviewIntensity === 'balanced' ? '2px solid #1a73e8' : '1px solid #e5e5e5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        background: reviewIntensity === 'balanced' ? '#f0f7ff' : 'white'
                                    }">
                                        <input type="radio" name="intensity" value="balanced" v-model="reviewIntensity" style="display: none;">
                                        <span style="font-size: 14px; color: #1a1a1a;">均势</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- 合同概览 -->
                        <div style="margin-bottom: 32px;">
                            <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">合同概览</h3>
                            
                            <!-- 甲方 -->
                            <div style="margin-bottom: 20px;">
                                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">甲方</div>
                                <div style="font-size: 14px; color: #666;">{{ overview.partyA.label }} <span style="color: #1a1a1a;">{{ overview.partyA.value }}</span></div>
                            </div>

                            <!-- 乙方 -->
                            <div style="margin-bottom: 20px;">
                                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">乙方</div>
                                <div style="font-size: 14px; color: #1a1a1a;">{{ overview.partyB.label }}</div>
                            </div>

                            <!-- 合同总金额 -->
                            <div style="margin-bottom: 20px;">
                                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">合同总金额</div>
                                <div style="font-size: 14px; color: #1a1a1a;">{{ overview.amount.label }}</div>
                            </div>

                            <!-- 履行期限 -->
                            <div style="margin-bottom: 20px;">
                                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">履行期限</div>
                                <div style="font-size: 14px; color: #1a1a1a; line-height: 1.6;">{{ overview.period.label }}</div>
                            </div>

                            <!-- 内容概览 -->
                            <div style="margin-bottom: 20px;">
                                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">内容概览</div>
                                <div style="font-size: 14px; color: #1a1a1a; line-height: 1.8;">{{ overview.content.label }}</div>
                            </div>
                        </div>
                    </template>

                    <!-- 步骤2：审查清单 -->
                    <template v-else-if="currentStep === 2">
                        <!-- 标题 -->
                        <div style="margin-bottom: 24px;">
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">审查清单：智能生成</h3>
                        </div>

                        <!-- 全选 -->
                        <div style="display: flex; align-items: center; gap: 12px; padding: 16px; background: #f5f5f5; border-radius: 6px; margin-bottom: 16px; cursor: pointer;" @click="toggleAllChecklist">
                            <div :style="{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #1a73e8',
                                borderRadius: '4px',
                                background: allChecked ? '#1a73e8' : 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }">
                                <i v-if="allChecked" class="fas fa-check" style="color: white; font-size: 12px;"></i>
                            </div>
                            <span style="font-size: 15px; font-weight: 600; color: #1a1a1a;">全部规则 ({{ checklistItems.length }})</span>
                        </div>

                        <!-- 清单项列表 -->
                        <div style="margin-bottom: 24px;">
                            <div 
                                v-for="item in checklistItems" 
                                :key="item.id"
                                @click="toggleChecklistItem(item.id)"
                                style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s;"
                                :style="{ background: item.checked ? 'white' : '#fafafa' }"
                            >
                                <div :style="{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid ' + (item.checked ? '#1a73e8' : '#d0d0d0'),
                                    borderRadius: '4px',
                                    background: item.checked ? '#1a73e8' : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }">
                                    <i v-if="item.checked" class="fas fa-check" style="color: white; font-size: 12px;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <span style="font-size: 14px; color: #1a1a1a; line-height: 1.6;">{{ item.id }}. {{ item.text }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 步骤3：审查结果 -->
                    <template v-else-if="currentStep === 3">
                        <!-- 审查结果头部 -->
                        <div style="margin-bottom: 24px;">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                                <div style="width: 48px; height: 48px; border-radius: 50%; background: #1a73e8; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-file-contract" style="color: white; font-size: 20px;"></i>
                                </div>
                                <div>
                                    <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">审查结果</h3>
                                    <p style="margin: 0; font-size: 13px; color: #999;">共审查{{ totalCount }}项，{{ completedCount }}项已完成</p>
                                </div>
                            </div>
                        </div>

                        <!-- 标签页 -->
                        <div style="display: flex; gap: 24px; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px;">
                            <div @click="activeResultTab = 'risk'" :style="{
                                padding: '12px 0',
                                cursor: 'pointer',
                                borderBottom: activeResultTab === 'risk' ? '2px solid #1a73e8' : '2px solid transparent',
                                marginBottom: '-2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }">
                                <i class="fas fa-shield-alt" :style="{ color: activeResultTab === 'risk' ? '#1a73e8' : '#999', fontSize: '14px' }"></i>
                                <span :style="{ fontSize: '14px', fontWeight: activeResultTab === 'risk' ? '600' : '400', color: activeResultTab === 'risk' ? '#1a73e8' : '#666' }">风险审查</span>
                            </div>
                            <div @click="activeResultTab = 'subject'" :style="{
                                padding: '12px 0',
                                cursor: 'pointer',
                                borderBottom: activeResultTab === 'subject' ? '2px solid #1a73e8' : '2px solid transparent',
                                marginBottom: '-2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }">
                                <i class="fas fa-user-check" :style="{ color: activeResultTab === 'subject' ? '#1a73e8' : '#999', fontSize: '14px' }"></i>
                                <span :style="{ fontSize: '14px', fontWeight: activeResultTab === 'subject' ? '600' : '400', color: activeResultTab === 'subject' ? '#1a73e8' : '#666' }">主体审查</span>
                            </div>
                        </div>

                        <!-- 风险统计 -->
                        <div v-if="activeResultTab === 'risk'" style="display: flex; gap: 8px; margin-bottom: 20px;">
                            <div style="flex: 1; padding: 10px 12px; background: #fff5f5; border: 1px solid #ffebee; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: 6px; height: 6px; border-radius: 50%; background: #f44336;"></div>
                                    <span style="font-size: 12px; color: #666; white-space: nowrap;">高风险</span>
                                </div>
                                <span style="font-size: 18px; font-weight: 600; color: #f44336;">{{ highRiskCount }}</span>
                            </div>
                            <div style="flex: 1; padding: 10px 12px; background: #fff8e1; border: 1px solid #ffecb3; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: 6px; height: 6px; border-radius: 50%; background: #ff9800;"></div>
                                    <span style="font-size: 12px; color: #666; white-space: nowrap;">中风险</span>
                                </div>
                                <span style="font-size: 18px; font-weight: 600; color: #ff9800;">{{ mediumRiskCount }}</span>
                            </div>
                            <div style="flex: 1; padding: 10px 12px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: 6px; height: 6px; border-radius: 50%; background: #fbbf24;"></div>
                                    <span style="font-size: 12px; color: #666; white-space: nowrap;">低风险</span>
                                </div>
                                <span style="font-size: 18px; font-weight: 600; color: #fbbf24;">{{ lowRiskCount }}</span>
                            </div>
                            <div style="flex: 1; padding: 10px 12px; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e;"></div>
                                    <span style="font-size: 12px; color: #666; white-space: nowrap;">通过</span>
                                </div>
                                <span style="font-size: 18px; font-weight: 600; color: #22c55e;">{{ passCount }}</span>
                            </div>
                        </div>

                        <!-- 审查结果列表 -->
                        <div>
                            <div 
                                v-for="item in reviewResults" 
                                :key="item.id"
                                style="padding: 16px; background: white; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;"
                                @mouseover="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'"
                                @mouseout="$event.currentTarget.style.boxShadow = 'none'"
                            >
                                <!-- 风险指示器 -->
                                <div :style="{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: item.risk === 'high' ? '#f44336' : item.risk === 'medium' ? '#ff9800' : item.risk === 'low' ? '#fbbf24' : '#22c55e',
                                    flexShrink: 0
                                }"></div>
                                
                                <!-- 文本 -->
                                <div style="flex: 1;">
                                    <span style="font-size: 14px; color: #1a1a1a;">{{ item.id }}. {{ item.text }}</span>
                                </div>
                                
                                <!-- 问题数量 -->
                                <div :style="{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    background: item.issues > 0 ? '#fee' : '#f0f0f0',
                                    color: item.issues > 0 ? '#f44336' : '#999',
                                    fontSize: '13px',
                                    fontWeight: '500'
                                }">
                                    {{ item.issues }}
                                </div>
                            </div>
                        </div>
                    </template>
                        </div>
                        
                        <!-- 固定底部按钮区域 -->
                        <div style="padding: 16px 24px; border-top: 1px solid #e5e5e5; background: white; flex-shrink: 0;">
                            <button v-if="currentStep === 1" @click="generateChecklist" class="smart-btn-primary" style="width: 100%; padding: 14px; font-size: 15px;">
                                生成审查清单
                            </button>
                            <button v-else-if="currentStep === 2" @click="startReview" class="smart-btn-primary" style="width: 100%; padding: 14px; font-size: 15px;">
                                发起审查
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
