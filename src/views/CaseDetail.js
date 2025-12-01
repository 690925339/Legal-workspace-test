import { router } from '../router.js';

export default {
    name: 'CaseDetail',
    data() {
        return {
            activeTab: 'general',
            caseData: {
                id: 'CASE-2023-001',
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                status: '进行中',
                type: '合同纠纷',
                category: '民事',
                client: 'ABC 公司',
                opposingParty: 'XYZ 有限公司',
                court: '上海市浦东新区人民法院',
                filingDate: '2023-10-01',
                amount: '500,000.00 CNY',
                description: '因被告未按合同约定支付广告费用引发的纠纷。',
                lastUpdate: '2小时前',
                assignee: '张三'
            },
            tabs: [
                { id: 'general', name: '一般资料' },
                { id: 'analysis', name: '资料分析' },
                { id: 'litigation', name: '诉讼分析' },
                { id: 'complaint', name: '起诉状' },
                { id: 'evidence-list', name: '证据清单' },
                { id: 'arbitration', name: '仲裁申请' },
                { id: 'enforcement', name: '强制执行文书' },
                { id: 'ai-evidence', name: 'AI证据分析' },
                { id: 'ai-assistant', name: 'AI助手' }
            ],
            // AI 证据分析数据
            evidenceAnalysis: {
                stats: {
                    completeness: { value: '50%', label: '(3/6)' },
                    collected: { value: '100%', label: '(2/2)' },
                    missing: { value: '3 项' }
                },
                items: [
                    {
                        id: 1,
                        name: '合同原件或复印件',
                        priority: 5,
                        priorityLabel: '极高',
                        priorityColor: '#dc3545',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '证明双方权利义务的核心证据',
                        checked: true,
                        bgClass: 'bg-red-light'
                    },
                    {
                        id: 2,
                        name: '付款凭证（发票、转账记录）',
                        priority: 5,
                        priorityLabel: '极高',
                        priorityColor: '#dc3545',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '证明履行义务的关键证据',
                        checked: true,
                        bgClass: 'bg-red-light'
                    },
                    {
                        id: 3,
                        name: '往来函件、邮件记录',
                        priority: 4,
                        priorityLabel: '高',
                        priorityColor: '#ff9800',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明双方沟通和违约事实',
                        checked: false,
                        bgClass: ''
                    },
                    {
                        id: 4,
                        name: '会议纪要、录音',
                        priority: 4,
                        priorityLabel: '高',
                        priorityColor: '#ff9800',
                        status: 'collected',
                        statusText: '✓ 已收集',
                        desc: '补充证明双方协商过程',
                        checked: true,
                        bgClass: ''
                    },
                    {
                        id: 5,
                        name: '催告函、律师函',
                        priority: 3,
                        priorityLabel: '中',
                        priorityColor: '#2196f3',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明已履行催告义务',
                        checked: false,
                        bgClass: ''
                    },
                    {
                        id: 6,
                        name: '公司营业执照、资质证明',
                        priority: 2,
                        priorityLabel: '低',
                        priorityColor: '#4caf50',
                        status: 'missing',
                        statusText: '✗ 未收集',
                        desc: '证明主体资格',
                        checked: false,
                        bgClass: ''
                    }
                ]
            },
            // AI 助手数据
            aiAssistant: {
                input: '',
                messages: [
                    {
                        id: 1,
                        role: 'ai',
                        content: '您好！我是您的 AI 法律助手。我已经阅读了本案的相关材料，您可以问我任何关于案件的问题，或者让我帮您起草文书。'
                    }
                ],
                suggestions: [
                    '分析本案的胜诉概率',
                    '生成一份证据收集清单',
                    '起草一份律师函',
                    '查找类似的判决案例'
                ]
            }
        };
    },
    methods: {
        switchTab(tabId) {
            this.activeTab = tabId;
        },
        goBack() {
            router.back();
        },
        getStarRating(priority) {
            return '★'.repeat(priority) + '☆'.repeat(5 - priority);
        },
        sendMessage() {
            if (!this.aiAssistant.input.trim()) return;

            // 添加用户消息
            this.aiAssistant.messages.push({
                id: Date.now(),
                role: 'user',
                content: this.aiAssistant.input
            });

            const userQuestion = this.aiAssistant.input;
            this.aiAssistant.input = '';

            // 模拟 AI 回复
            setTimeout(() => {
                let reply = '这是一个很好的问题。基于目前的证据分析，我认为...';
                if (userQuestion.includes('胜诉')) {
                    reply = '根据目前的证据情况（完整度50%），胜诉概率约为 60%。如果能补充"往来函件"和"催告函"，胜诉概率可提升至 80% 以上。';
                } else if (userQuestion.includes('起草')) {
                    reply = '好的，正在为您起草相关文书。请稍候...';
                }

                this.aiAssistant.messages.push({
                    id: Date.now() + 1,
                    role: 'ai',
                    content: reply
                });

                // 滚动到底部
                this.$nextTick(() => {
                    const chatContainer = this.$refs.chatContainer;
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                });
            }, 1000);
        },
        useSuggestion(text) {
            this.aiAssistant.input = text;
            this.sendMessage();
        }
    },
    template: `
        <div class="case-detail-page">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span>案件</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span>详情</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span class="current">{{ caseData.id }}</span>
                </div>
                <div class="top-actions">
                    <button class="icon-btn"><i class="fas fa-search"></i></button>
                    <button class="icon-btn"><i class="fas fa-bell"></i></button>
                    <button class="icon-btn"><i class="fas fa-cog"></i></button>
                </div>
            </header>

            <!-- Case Header -->
            <div class="case-header-area">
                <div class="case-title-wrapper">
                    <div>
                        <div class="case-tags" style="margin-bottom: 12px;">
                            <span class="tag status-active">{{ caseData.status }}</span>
                            <span class="tag">{{ caseData.type }}</span>
                            <span class="tag">{{ caseData.category }}</span>
                        </div>
                        <h1 class="case-title">{{ caseData.name }}</h1>
                        <div style="color: var(--text-secondary); font-size: 14px;">
                            <i class="far fa-clock" style="margin-right: 6px;"></i> 最后更新：{{ caseData.lastUpdate }}
                            <span style="margin: 0 8px; color: var(--border-medium);">|</span>
                            <i class="far fa-user" style="margin-right: 6px;"></i> 负责人：{{ caseData.assignee }}
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <button class="icon-btn" style="border: 1px solid var(--border-medium); border-radius: 12px;">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="primary-btn">
                            <i class="fas fa-play" style="font-size: 12px;"></i> 启动流程
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs-container">
                <div 
                    v-for="tab in tabs" 
                    :key="tab.id"
                    :class="['tab-pill', { active: activeTab === tab.id }]"
                    @click="switchTab(tab.id)"
                >
                    {{ tab.name }}
                </div>
            </div>

            <!-- Content Canvas -->
            <div class="content-canvas">
                <!-- Tab: General Info -->
                <div v-if="activeTab === 'general'" class="tab-pane">
                    <div class="dashboard-grid">
                        <!-- 基本信息卡片 -->
                        <div class="modern-card">
                            <div class="card-header">
                                <div class="card-title">基本信息</div>
                                <button class="icon-btn" style="font-size: 14px;">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </div>
                            <div class="info-row">
                                <span class="label">客户名称</span>
                                <span class="value">{{ caseData.client }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">对方当事人</span>
                                <span class="value">{{ caseData.opposingParty }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">受理机关</span>
                                <span class="value">{{ caseData.court }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">涉案金额</span>
                                <span class="value">{{ caseData.amount }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">立案日期</span>
                                <span class="value">{{ caseData.filingDate }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">案件编号</span>
                                <span class="value">{{ caseData.id }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">潜在编号</span>
                                <span class="value">POT-2023-005</span>
                            </div>
                            <div class="info-row">
                                <span class="label">CS负责人</span>
                                <span class="value">张三</span>
                            </div>
                            <div class="info-row">
                                <span class="label">SR负责人</span>
                                <span class="value">李四</span>
                            </div>
                        </div>

                        <!-- 联络人卡片 -->
                        <div class="modern-card">
                            <div class="card-header">
                                <div class="card-title">联络人</div>
                                <button class="icon-btn" style="font-size: 14px;">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                                <div class="contact-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 16px;">王经理</div>
                                    <div style="color: var(--text-secondary); font-size: 13px;">主要联络人</div>
                                </div>
                            </div>
                            <div class="info-row">
                                <span class="label">电话</span>
                                <span class="value">138-0000-1234</span>
                            </div>
                            <div class="info-row">
                                <span class="label">邮箱</span>
                                <span class="value">wang@abc.com</span>
                            </div>
                            <div class="info-row">
                                <span class="label">地址</span>
                                <span class="value">上海市浦东新区...</span>
                            </div>
                        </div>

                        <!-- 案件进度卡片 -->
                        <div class="modern-card">
                            <div class="card-header">
                                <div class="card-title">案件进度</div>
                            </div>
                            <div class="timeline">
                                <div class="timeline-item active">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">案件立项</div>
                                        <div class="timeline-date">2023-10-01</div>
                                    </div>
                                </div>
                                <div class="timeline-item active">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">证据收集</div>
                                        <div class="timeline-date">进行中</div>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-title">起诉状撰写</div>
                                        <div class="timeline-date">待开始</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Data Analysis -->
                <div v-if="activeTab === 'analysis'" class="tab-pane">
                    <div class="reader-layout">
                        <div class="reader-sidebar">
                            <div class="section-title">DOCUMENTS</div>
                            <div class="doc-list-modern">
                                <div class="doc-item-modern active">
                                    <div class="doc-icon pdf-icon">
                                        <i class="fas fa-file-pdf"></i>
                                    </div>
                                    <div class="doc-info">
                                        <div class="doc-name">广告发布合同.pdf</div>
                                        <div class="doc-size">1.2MB</div>
                                    </div>
                                </div>
                                <div class="doc-item-modern">
                                    <div class="doc-icon word-icon">
                                        <i class="fas fa-file-word"></i>
                                    </div>
                                    <div class="doc-info">
                                        <div class="doc-name">补充协议.docx</div>
                                        <div class="doc-size">800KB</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section-title">SECTIONS</div>
                            <div class="reader-nav">
                                <div class="nav-pill active">
                                    <span>合同主体</span>
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                                <div class="nav-pill">
                                    <span>合同内容</span>
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                                <div class="nav-pill">
                                    <span>金额明细</span>
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        </div>

                        <div class="reader-content">
                            <div class="content-typography">
                                <h3>合同主体分析</h3>
                                <p>甲方：ABC 公司（委托方）</p>
                                <p>乙方：XYZ 有限公司（服务方）</p>
                                <p>本合同为广告发布服务合同，甲方委托乙方在其平台上发布广告内容...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: AI Evidence Analysis -->
                <div v-if="activeTab === 'ai-evidence'" class="tab-pane">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px; color: white;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h2 style="margin: 0 0 10px 0; font-size: 24px;">
                                    <i class="fas fa-brain" style="margin-right: 10px;"></i> AI 智能证据分析
                                </h2>
                                <p style="margin: 0; opacity: 0.9;">基于案件类型「{{ caseData.type }}」，AI 为您生成证据收集建议</p>
                            </div>
                            <button class="btn-glass">
                                <i class="fas fa-sync-alt" style="margin-right: 6px;"></i> 重新分析
                            </button>
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-label">证据完整度</div>
                            <div class="stat-value blue-text">
                                {{ evidenceAnalysis.stats.completeness.value }} 
                                <span class="stat-sub">{{ evidenceAnalysis.stats.completeness.label }}</span>
                            </div>
                        </div>
                        <div class="stat-card green">
                            <div class="stat-label">高优先级已收集</div>
                            <div class="stat-value green-text">
                                {{ evidenceAnalysis.stats.collected.value }} 
                                <span class="stat-sub">{{ evidenceAnalysis.stats.collected.label }}</span>
                            </div>
                        </div>
                        <div class="stat-card orange">
                            <div class="stat-label">建议补充</div>
                            <div class="stat-value orange-text">{{ evidenceAnalysis.stats.missing.value }}</div>
                        </div>
                    </div>

                    <!-- Evidence Table -->
                    <h3 style="color: var(--text-primary); margin-bottom: 16px; font-size: 18px;">
                        <i class="fas fa-list-check" style="margin-right: 8px;"></i> 证据收集清单
                    </h3>

                    <div class="table-container">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th width="5%"><input type="checkbox"></th>
                                    <th width="35%">建议收集的证据</th>
                                    <th width="15%">重要性评分</th>
                                    <th width="15%">收集状态</th>
                                    <th width="30%">说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in evidenceAnalysis.items" :key="item.id" :class="item.bgClass">
                                    <td><input type="checkbox" :checked="item.checked"></td>
                                    <td>
                                        <strong :style="{ color: item.priority >= 5 ? '#dc3545' : 'inherit' }">{{ item.name }}</strong>
                                    </td>
                                    <td>
                                        <div style="color: #ffc107; font-size: 14px; margin-bottom: 2px;">{{ getStarRating(item.priority) }}</div>
                                        <span class="priority-badge" :style="{ background: item.priorityColor }">{{ item.priorityLabel }}</span>
                                    </td>
                                    <td>
                                        <span :class="['status-badge-sm', item.status === 'collected' ? 'success' : 'secondary']">
                                            {{ item.statusText }}
                                        </span>
                                    </td>
                                    <td style="color: var(--text-secondary); font-size: 13px;">{{ item.desc }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- AI Recommendations -->
                    <div class="ai-tips-box">
                        <h4 style="margin: 0 0 12px 0; color: #f57c00; font-size: 16px;">
                            <i class="fas fa-lightbulb" style="margin-right: 8px;"></i> AI 建议
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); line-height: 1.6;">
                            <li>建议优先补充「往来函件、邮件记录」，这对证明违约事实至关重要</li>
                            <li>如有催告函或律师函，建议一并提交，可增强诉讼主张的合理性</li>
                            <li>当前证据完整度为 50%，建议至少达到 70% 以上再提起诉讼</li>
                        </ul>
                    </div>
                </div>

                <!-- Tab: AI Assistant -->
                <div v-if="activeTab === 'ai-assistant'" class="tab-pane" style="height: 100%; display: flex; flex-direction: column;">
                    <div class="chat-container" ref="chatContainer">
                        <div v-for="msg in aiAssistant.messages" :key="msg.id" :class="['chat-message', msg.role]">
                            <div class="chat-avatar">
                                <i :class="msg.role === 'ai' ? 'fas fa-robot' : 'fas fa-user'"></i>
                            </div>
                            <div class="chat-bubble">
                                {{ msg.content }}
                            </div>
                        </div>
                    </div>

                    <div class="chat-input-area">
                        <div class="suggestions" v-if="aiAssistant.messages.length < 3">
                            <button 
                                v-for="(sug, index) in aiAssistant.suggestions" 
                                :key="index"
                                class="suggestion-pill"
                                @click="useSuggestion(sug)"
                            >
                                {{ sug }}
                            </button>
                        </div>
                        <div class="input-box-wrapper">
                            <input 
                                type="text" 
                                v-model="aiAssistant.input" 
                                @keyup.enter="sendMessage"
                                placeholder="输入您的问题，或让 AI 帮您起草文书..."
                                class="chat-input"
                            >
                            <button class="send-btn" @click="sendMessage">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Other tabs placeholder -->
                <div v-if="!['general', 'analysis', 'ai-evidence', 'ai-assistant'].includes(activeTab)" class="tab-pane">
                    <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                        <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                        <div style="font-size: 16px;">{{ tabs.find(t => t.id === activeTab).name }}</div>
                        <div style="font-size: 14px; margin-top: 8px;">内容开发中...</div>
                    </div>
                </div>
            </div>
        </div>
    `
};
