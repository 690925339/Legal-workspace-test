import { router } from '../router.js';

export default {
    name: 'DocGenerate',
    data() {
        return {
            activeType: 'complaint',
            types: [
                { id: 'complaint', name: '起诉状' },
                { id: 'defense', name: '答辩状' }
            ],
            inputText: '',
            isGenerating: false,
            generatedDoc: null
        };
    },
    methods: {
        switchDocType(typeId) {
            this.activeType = typeId;
            this.generatedDoc = null;
        },
        generateDocument() {
            if (!this.inputText.trim()) {
                alert('请输入案情描述');
                return;
            }
            this.isGenerating = true;
            
            setTimeout(() => {
                var docType = this.activeType === 'complaint' ? '起诉状' : '答辩状';
                this.generatedDoc = {
                    title: '民事' + docType,
                    content: this.getMockDocument(this.activeType)
                };
                this.isGenerating = false;
            }, 2000);
        },
        getMockDocument(type) {
            var content = '';
            var date = new Date().toLocaleDateString('zh-CN');
            
            if (type === 'complaint') {
                content = '原告：[原告姓名/公司名称]\n';
                content += '住所地：[地址]\n';
                content += '法定代表人：[姓名]，职务：[职务]\n\n';
                content += '被告：[被告姓名/公司名称]\n';
                content += '住所地：[地址]\n';
                content += '法定代表人：[姓名]，职务：[职务]\n\n';
                content += '诉讼请求：\n';
                content += '一、判令被告向原告支付欠款人民币____元；\n';
                content += '二、判令被告支付逾期付款利息____元；\n';
                content += '三、判令被告承担本案全部诉讼费用。\n\n';
                content += '事实与理由：\n';
                content += this.inputText + '\n\n';
                content += '综上所述，被告的行为已构成违约，严重损害了原告的合法权益。为维护原告的合法权益，特依据《中华人民共和国民事诉讼法》相关规定，向贵院提起诉讼，恳请贵院依法支持原告的诉讼请求。\n\n';
                content += '此致\n';
                content += '[受理法院名称]\n\n';
                content += '具状人：[原告名称]\n';
                content += '日期：' + date;
            } else {
                content = '答辩人：[答辩人姓名/公司名称]\n';
                content += '住所地：[地址]\n';
                content += '法定代表人：[姓名]，职务：[职务]\n\n';
                content += '被答辩人：[被答辩人姓名/公司名称]\n';
                content += '住所地：[地址]\n\n';
                content += '答辩请求：\n';
                content += '一、请求依法驳回被答辩人的全部诉讼请求；\n';
                content += '二、本案诉讼费用由被答辩人承担。\n\n';
                content += '事实与理由：\n';
                content += this.inputText + '\n\n';
                content += '综上所述，被答辩人的诉讼请求缺乏事实和法律依据，恳请贵院依法驳回其全部诉讼请求。\n\n';
                content += '此致\n';
                content += '[受理法院名称]\n\n';
                content += '答辩人：[答辩人名称]\n';
                content += '日期：' + date;
            }
            return content;
        },
        copyDocument() {
            if (this.generatedDoc) {
                navigator.clipboard.writeText(this.generatedDoc.content);
                alert('文书内容已复制到剪贴板');
            }
        },
        downloadDocument() {
            if (this.generatedDoc) {
                var blob = new Blob([this.generatedDoc.content], { type: 'text/plain;charset=utf-8' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = this.generatedDoc.title + '.txt';
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        resetDocument() {
            this.generatedDoc = null;
        }
    },
    template: `
        <div class="smart-page">
            <div class="smart-container">
                <!-- 页面头部 -->
                <div class="smart-header">
                    <h1>文书生成，一键生成专属法律文书</h1>
                    <p>根据案情描述，自动总结法律诉求并撰写法律文书</p>
                    
                    <!-- 标签切换 -->
                    <div class="smart-tabs">
                        <button 
                            v-for="type in types" 
                            :key="type.id"
                            :class="['smart-tab-btn', { active: activeType === type.id }]"
                            @click="switchDocType(type.id)"
                        >
                            {{ type.name }}
                        </button>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="smart-card" v-if="!generatedDoc">
                    <textarea 
                        class="smart-textarea" 
                        v-model="inputText"
                        :placeholder="activeType === 'complaint' ? '请您尽可能详细地描述案情事实和法律诉求，包括原告和被告的身份信息，事情发生的时间、地点、起因、经过和结果信息等。' : '请您尽可能详细地描述答辩理由，包括对原告诉讼请求的意见、事实依据和法律依据等。'"
                    ></textarea>
                    
                    <div class="smart-card-footer">
                        <div class="smart-tips">
                            <i class="fas fa-lightbulb"></i>
                            <span>提示：描述越详细，生成的文书质量越高</span>
                        </div>
                        <button 
                            class="smart-btn-primary"
                            @click="generateDocument"
                            :disabled="isGenerating || !inputText.trim()"
                        >
                            <i :class="isGenerating ? 'fas fa-spinner fa-spin' : 'fas fa-magic'"></i>
                            {{ isGenerating ? '生成中...' : '立即撰写' }}
                        </button>
                    </div>
                </div>

                <!-- 生成结果 -->
                <div class="smart-result" v-else>
                    <div class="smart-result-header">
                        <h3>{{ generatedDoc.title }}</h3>
                        <div class="smart-result-actions">
                            <button class="smart-result-btn" @click="copyDocument">
                                <i class="fas fa-copy"></i> 复制
                            </button>
                            <button class="smart-result-btn" @click="downloadDocument">
                                <i class="fas fa-download"></i> 下载
                            </button>
                            <button class="smart-result-btn" @click="resetDocument">
                                <i class="fas fa-redo"></i> 重新生成
                            </button>
                        </div>
                    </div>
                    <div class="smart-result-content">
                        <pre>{{ generatedDoc.content }}</pre>
                    </div>
                </div>

                <!-- 底部提示 -->
                <div class="smart-footer-info">
                    <i class="fas fa-info-circle"></i>
                    <span>生成的文书仅供参考，请根据实际情况进行修改</span>
                    <a href="#">了解更多 ></a>
                </div>
            </div>
        </div>
    `
};
