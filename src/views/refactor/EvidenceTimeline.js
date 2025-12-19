export default {
    name: 'EvidenceTimeline',
    data() {
        return {
            timelineData: [
                { id: 1, date: '2023-09-15', title: '买卖合同签订', description: '双方签订买卖合同，约定交易金额及交付时间' },
                { id: 2, date: '2023-09-20', title: '首次付款', description: '买方通过银行转账支付首期款项 50,000 元' },
                { id: 3, date: '2023-10-05', title: '货物交付', description: '卖方交付货物，买方签收确认' },
                { id: 4, date: '2023-10-15', title: '质量异议提出', description: '买方发现货物存在质量问题，通过邮件提出异议' },
                { id: 5, date: '2023-10-25', title: '协商未果', description: '双方多次沟通未能达成一致，买方拒绝支付尾款' },
                { id: 6, date: '2023-11-01', title: '律师函发送', description: '卖方委托律师向买方发送律师函，要求支付尾款' }
            ]
        };
    },
    methods: {
        refreshTimeline() {
            alert('正在重新生成证据时间轴...');
            // TODO: Call AI to regenerate timeline
        },
        editTimeline() {
            alert('编辑功能开发中...');
            // TODO: Open timeline editor modal
        },
        exportTimeline() {
            alert('正在导出证据时间轴...');
            // TODO: Export timeline as PDF or Word
        }
    },
    template: `
        <div class="modern-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-stream" style="margin-right: 8px;"></i>
                    证据时间轴
                </div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin: 0 20px 20px 0;">
                <button class="smart-btn-secondary" @click="refreshTimeline">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
                <button class="smart-btn-secondary" @click="editTimeline">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="smart-btn-secondary" @click="exportTimeline">
                    <i class="fas fa-download"></i> 导出
                </button>
            </div>

            <div class="timeline" style="padding: 20px 0;">
                <div v-for="item in timelineData" :key="item.id" class="timeline-item active">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">{{ item.date }}</div>
                        <div class="timeline-title">{{ item.title }}</div>
                        <div class="timeline-desc">{{ item.description }}</div>
                    </div>
                </div>
            </div>
        </div>
    `
};
