export default {
    name: 'AIAssistant',
    props: ['caseData'],
    data() {
        return {
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
        sendMessage(message) {
            const content = message || this.aiAssistant.input.trim();
            if (!content) return;

            // 添加用户消息
            this.aiAssistant.messages.push({
                id: Date.now(),
                role: 'user',
                content: content
            });

            const userQuestion = content;
            this.aiAssistant.input = '';

            // 模拟 AI 回复
            setTimeout(() => {
                let reply = '这是一个很好的问题。基于目前的证据分析，我认为...';
                if (userQuestion.includes('胜诉') || userQuestion.includes('概率') || userQuestion.includes('分析本案')) {
                    reply = '根据我的分析，本案目前的胜诉概率约为 75%。这主要基于现有的核心证据（合同原件、付款凭证）非常充分。不过，往来函件方面还略有欠缺，建议补充相关沟通记录以进一步确保证据链完整。';
                } else if (userQuestion.includes('清单') || userQuestion.includes('证据')) {
                    reply = '我已经为您生成了一份定制化的证据收集清单。您可以点击上方的“证据收集清单”标签页查看详情。建议重点收集：1. 双方往来邮件记录；2. 对方的验收确认单。';
                } else if (userQuestion.includes('律师函') || userQuestion.includes('起草')) {
                    reply = '没问题，我可以为您起草律师函。请问您希望在律师函中重点强调哪些违约事实？是逾期付款，还是拒绝验收？';
                } else if (userQuestion.includes('案例') || userQuestion.includes('判决')) {
                    reply = '我检索到了 156 个相似案例。其中 72% 的案件原告获得了胜诉。主要的支持点在于合同条款的明确约定和实际履行情况的证据保全。您可以查看“类案裁判分析”板块获取详细列表。';
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
        <div class="ai-assistant-component" style="height: calc(100vh - 280px); display: flex; flex-direction: column;">
            <!-- Chat Messages -->
            <div style="flex: 1; overflow-y: auto; padding: 24px; background: #fafafa;" ref="chatContainer">
                <div v-for="msg in aiAssistant.messages" :key="msg.id" 
                        :style="{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: '20px',
                            alignItems: 'flex-start'
                        }">
                    <!-- AI Avatar -->
                    <div v-if="msg.role === 'ai'" style="width: 36px; height: 36px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                        <i class="fas fa-robot"></i>
                    </div>

                    <!-- Message Bubble -->
                    <div :style="{
                        maxWidth: '70%',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        borderTopLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                        borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                        background: msg.role === 'user' ? '#1a1a1a' : '#ffffff',
                        color: msg.role === 'user' ? '#ffffff' : '#1a1a1a',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }">
                        {{ msg.content }}
                    </div>

                    <!-- User Avatar -->
                    <div v-if="msg.role === 'user'" style="width: 36px; height: 36px; border-radius: 50%; background: #f3f4f6; color: #666; display: flex; align-items: center; justify-content: center; margin-left: 12px; flex-shrink: 0;">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            </div>

            <!-- Quick Suggestions -->
            <div v-if="aiAssistant.messages.length === 1" style="padding: 0 24px 16px 24px; background: #fafafa;">
                <div style="font-size: 13px; color: #666; margin-bottom: 12px; font-weight: 500;">
                    <i class="fas fa-lightbulb" style="margin-right: 6px;"></i>
                    快捷建议
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <button v-for="(suggestion, index) in aiAssistant.suggestions" :key="index"
                            class="smart-suggestion-item"
                            @click="sendMessage(suggestion)">
                        {{ suggestion }}
                    </button>
                </div>
            </div>

            <!-- Input Area -->
            <div style="padding: 20px 24px; background: white; border-top: 1px solid #e5e5e5;">
                <div style="display: flex; gap: 12px; align-items: flex-end;">
                    <textarea 
                        v-model="aiAssistant.input"
                        @keydown.enter.prevent="sendMessage()"
                        placeholder="输入您的问题..."
                        style="flex: 1; min-height: 44px; max-height: 120px; padding: 12px; border: 1px solid #e5e5e5; border-radius: 8px; resize: none; font-size: 14px; font-family: inherit;"
                    ></textarea>
                    <button class="smart-btn-primary" @click="sendMessage()" style="height: 44px; padding: 0 24px;">
                        <i class="fas fa-paper-plane"></i>
                        发送
                    </button>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #999;">
                    <i class="fas fa-info-circle"></i>
                    按 Enter 发送，Shift + Enter 换行
                </div>
            </div>
        </div>
    `
};
