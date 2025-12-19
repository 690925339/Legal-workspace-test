export default {
    name: 'QuoteGenerator',
    props: ['caseData'],
    data() {
        return {
            quoteForm: {
                clientName: '',
                clientContact: '',
                caseType: '合同纠纷',
                caseDescription: '',
                serviceItems: [
                    { id: 1, name: '法律咨询服务', price: 5000, unit: '次', selected: true },
                    { id: 2, name: '诉讼代理费（一审）', price: 30000, unit: '件', selected: true },
                    { id: 3, name: '证据收集与整理', price: 8000, unit: '项', selected: false },
                    { id: 4, name: '法律文书起草', price: 3000, unit: '份', selected: false }
                ],
                validDays: 30,
                paymentTerms: '签订委托协议后3个工作日内支付',
                remarks: ''
            },
            generatedQuote: null,
            isGeneratingQuote: false
        };
    },
    methods: {
        autoFillQuote() {
            this.quoteForm.clientName = '华商科技股份有限公司'; // 示例数据
            this.quoteForm.clientContact = this.caseData.contactName || '';
            this.quoteForm.caseType = this.caseData.type || '合同纠纷';
            this.quoteForm.caseDescription = this.caseData.description || '';
            alert('已自动填充案件信息');
        },
        generateQuote() {
            if (!this.quoteForm.clientName.trim()) {
                alert('请输入客户名称');
                return;
            }

            this.isGeneratingQuote = true;

            setTimeout(() => {
                const date = new Date().toLocaleDateString('zh-CN');
                const validDate = new Date();
                validDate.setDate(validDate.getDate() + this.quoteForm.validDays);

                let content = '═══════════════════════════════════════\n';
                content += '          报价书\n';
                content += '═══════════════════════════════════════\n\n';
                content += '致：' + this.quoteForm.clientName + '\n';
                content += '联系方式：' + (this.quoteForm.clientContact || '[客户联系方式]') + '\n';
                content += '报价日期：' + date + '\n';
                content += '有效期至：' + validDate.toLocaleDateString('zh-CN') + '\n\n';
                content += '───────────────────────────────────────\n';
                content += '一、案件基本情况\n';
                content += '───────────────────────────────────────\n\n';
                content += '案件类型：' + this.quoteForm.caseType + '\n';
                content += '案件描述：' + (this.quoteForm.caseDescription || '（未填写）') + '\n\n';
                content += '───────────────────────────────────────\n';
                content += '二、服务项目及费用明细\n';
                content += '───────────────────────────────────────\n\n';

                var totalAmount = 0;
                var itemIndex = 1;
                this.quoteForm.serviceItems.forEach(item => {
                    if (item.selected) {
                        content += itemIndex + '. ' + item.name + '\n';
                        content += '   收费标准：¥' + item.price.toLocaleString() + ' 元/' + item.unit + '\n\n';
                        totalAmount += item.price;
                        itemIndex++;
                    }
                });

                content += '───────────────────────────────────────\n';
                content += '费用合计：¥' + totalAmount.toLocaleString() + ' 元\n';
                content += '───────────────────────────────────────\n\n';
                content += '三、付款方式\n\n';
                content += this.quoteForm.paymentTerms + '\n\n';
                content += '四、服务承诺\n\n';
                content += '1. 本所将指派专业律师团队为您提供优质法律服务；\n';
                content += '2. 严格遵守律师执业规范和职业道德；\n';
                content += '3. 及时向委托人通报案件进展情况；\n';
                content += '4. 保守委托人商业秘密和个人隐私。\n\n';

                if (this.quoteForm.remarks) {
                    content += '五、备注说明\n\n';
                    content += this.quoteForm.remarks + '\n\n';
                }

                content += '───────────────────────────────────────\n\n';
                content += '报价单位：ALPHA&LEADER 安华理达律师事务所\n';
                content += '联系电话：[律所电话]\n';
                content += '电子邮箱：[律所邮箱]\n';
                content += '地址：[律所地址]\n\n';

                this.generatedQuote = content;
                this.isGeneratingQuote = false;
            }, 1500);
        },
        copyQuote() {
            if (this.generatedQuote) {
                navigator.clipboard.writeText(this.generatedQuote)
                    .then(() => alert('报价书内容已复制到剪贴板'))
                    .catch(err => alert('复制失败，请手动复制'));
            }
        },
        downloadQuote() {
            if (this.generatedQuote) {
                const blob = new Blob([this.generatedQuote], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `法律服务报价书_${this.quoteForm.clientName}_${new Date().toLocaleDateString('zh-CN')}.txt`;
                a.click();
                URL.revokeObjectURL(url);
            }
        }
    },
    template: `
        <div class="modern-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-file-invoice-dollar" style="margin-right: 8px;"></i>
                    生成报价书
                </div>
                <!-- 自动填充按钮 -->
                <button class="smart-btn-secondary smart-btn-sm" @click="autoFillQuote" title="根据案件信息自动填充">
                    <i class="fas fa-magic"></i> 自动填充
                </button>
            </div>
            
            <div v-if="!generatedQuote">
                <div class="smart-form-grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="smart-form-group">
                        <label class="smart-label required">客户名称</label>
                        <input type="text" class="smart-input" v-model="quoteForm.clientName" placeholder="请输入客户名称">
                    </div>
                    <div class="smart-form-group">
                        <label class="smart-label">联系方式</label>
                        <input type="text" class="smart-input" v-model="quoteForm.clientContact" placeholder="电话或邮箱">
                    </div>
                    <div class="smart-form-group">
                        <label class="smart-label">案件类型</label>
                        <select class="smart-select" v-model="quoteForm.caseType">
                            <option>合同纠纷</option>
                            <option>劳动争议</option>
                            <option>知识产权</option>
                            <option>公司法务</option>
                            <option>刑事辩护</option>
                            <option>其他</option>
                        </select>
                    </div>
                    <div class="smart-form-group">
                        <label class="smart-label">有效期（天）</label>
                        <input type="number" class="smart-input" v-model.number="quoteForm.validDays" min="1" max="90">
                    </div>
                </div>
                
                <div class="smart-form-group" style="margin-top: 20px;">
                    <label class="smart-label required">案件描述</label>
                    <textarea class="smart-textarea" v-model="quoteForm.caseDescription" rows="4" placeholder="请简要描述案件情况" style="border: 1px solid #ccc;"></textarea>
                </div>
                
                <div class="smart-form-group" style="margin-top: 20px;">
                    <label class="smart-label">服务项目</label>
                    <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; background: #fafafa;">
                        <div v-for="item in quoteForm.serviceItems" :key="item.id" 
                                style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 6px; margin-bottom: 12px; border: 1px solid #e5e5e5;">
                            <input type="checkbox" v-model="item.selected" style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer;">
                            <div style="flex: 1;">
                                <div style="font-weight: 500; color: #1a1a1a;">{{ item.name }}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="color: #666;">¥</span>
                                <input type="number" v-model.number="item.price" 
                                        style="width: 120px; padding: 6px 12px; border: 1px solid #e5e5e5; border-radius: 4px; text-align: right;"
                                        :disabled="!item.selected">
                                <span style="color: #666; min-width: 40px;">元/{{ item.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="smart-form-group" style="margin-top: 20px;">
                    <label class="smart-label">付款方式</label>
                    <input type="text" class="smart-input" v-model="quoteForm.paymentTerms" placeholder="例如：签订委托协议后3个工作日内支付">
                </div>
                
                <div class="smart-form-group" style="margin-top: 20px;">
                    <label class="smart-label">备注说明</label>
                    <textarea class="smart-textarea" v-model="quoteForm.remarks" rows="3" placeholder="其他需要说明的事项（选填）" style="border: 1px solid #ccc;"></textarea>
                </div>
                
                <div style="margin-top: 24px; display: flex; justify-content: flex-end; padding-top: 20px; border-top: 1px solid #eee;">
                    <button 
                        class="smart-btn-primary"
                        @click="generateQuote"
                        :disabled="isGeneratingQuote"
                        style="padding: 10px 30px;"
                    >
                        <i :class="isGeneratingQuote ? 'fas fa-spinner fa-spin' : 'fas fa-file-invoice'"></i>
                        {{ isGeneratingQuote ? '生成中...' : '生成报价书' }}
                    </button>
                </div>
            </div>
            
            <!-- 生成结果预览 -->
            <div v-else>
                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px; white-space: pre-wrap; font-family: 'SimSun', serif; line-height: 1.8; color: #333; max-height: 600px; overflow-y: auto;">{{ generatedQuote }}</div>
                
                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                    <button class="smart-btn-secondary" @click="generatedQuote = null">
                        <i class="fas fa-arrow-left"></i> 返回修改
                    </button>
                    <button class="smart-btn-secondary" @click="copyQuote">
                        <i class="fas fa-copy"></i> 复制内容
                    </button>
                    <button class="smart-btn-primary" @click="downloadQuote">
                        <i class="fas fa-download"></i> 下载文书
                    </button>
                </div>
            </div>
        </div>
    `
};
