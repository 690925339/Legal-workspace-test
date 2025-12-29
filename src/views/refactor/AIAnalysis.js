export default {
    name: 'AIAnalysis',
    props: ['caseData'],
    data() {
        return {
            feasibilityAnalysis: {
                // 证据完整度评分
                evidenceScore: {
                    total: 85,
                    breakdown: [
                        { name: '核心证据', score: 90, weight: 0.4, desc: '合同原件、付款凭证等关键证据' },
                        { name: '辅助证据', score: 80, weight: 0.3, desc: '往来函件、会议纪要等补充证据' },
                        { name: '程序性文件', score: 85, weight: 0.3, desc: '催告函、律师函等程序文件' }
                    ]
                },
                // 类案裁判分析
                similarCases: {
                    totalCases: 156,
                    winRate: 72,
                    partialRate: 18,
                    loseRate: 10,
                    cases: [
                        { id: '(2023)沪01民终1234号', court: '上海市第一中级人民法院', result: '胜诉', similarity: 89, amount: '48万元' },
                        { id: '(2022)京03民初5678号', court: '北京市第三中级人民法院', result: '部分支持', similarity: 85, amount: '52万元' },
                        { id: '(2023)粤01民终9012号', court: '广东省高级人民法院', result: '胜诉', similarity: 82, amount: '65万元' }
                    ]
                },
                // 综合可行性结论
                conclusion: {
                    recommendation: 'proceed', // proceed | caution | not_recommended
                    confidenceLevel: 75,
                    summary: '综合现有证据和类案分析，建议启动诉讼程序',
                    keyPoints: [
                        { type: 'positive', text: '证据链基本完整，核心证据充分' },
                        { type: 'positive', text: '类案胜诉率较高（72%），裁判尺度有利' },
                        { type: 'warning', text: '建议补充往来函件后再正式起诉' },
                        { type: 'info', text: '预估诉讼周期：6-12个月' }
                    ]
                },
                // 分析状态
                isAnalyzing: false,
                lastAnalyzedAt: '2023-10-15 14:30'
            }
        };
    },
    methods: {
        refreshFeasibilityAnalysis() {
            this.feasibilityAnalysis.isAnalyzing = true;

            // 模拟 AI 分析过程
            setTimeout(() => {
                // 更新分析数据（模拟 AI 返回结果）
                this.feasibilityAnalysis.evidenceScore.total = Math.floor(Math.random() * 20) + 75;
                this.feasibilityAnalysis.evidenceScore.breakdown.forEach(item => {
                    item.score = Math.floor(Math.random() * 20) + 75;
                });

                this.feasibilityAnalysis.similarCases.winRate = Math.floor(Math.random() * 20) + 65;
                this.feasibilityAnalysis.similarCases.partialRate = Math.floor(Math.random() * 15) + 10;
                this.feasibilityAnalysis.similarCases.loseRate = 100 - this.feasibilityAnalysis.similarCases.winRate - this.feasibilityAnalysis.similarCases.partialRate;

                // 根据胜诉率更新结论
                const winRate = this.feasibilityAnalysis.similarCases.winRate;
                if (winRate >= 70) {
                    this.feasibilityAnalysis.conclusion.recommendation = 'proceed';
                    this.feasibilityAnalysis.conclusion.summary = '综合现有证据和类案分析，建议启动诉讼程序';
                } else if (winRate >= 50) {
                    this.feasibilityAnalysis.conclusion.recommendation = 'caution';
                    this.feasibilityAnalysis.conclusion.summary = '案件存在一定风险，建议补充证据后再做决定';
                } else {
                    this.feasibilityAnalysis.conclusion.recommendation = 'not_recommended';
                    this.feasibilityAnalysis.conclusion.summary = '证据不足或法律风险较高，不建议起诉';
                }

                this.feasibilityAnalysis.conclusion.confidenceLevel = Math.floor((winRate + this.feasibilityAnalysis.evidenceScore.total) / 2);
                this.feasibilityAnalysis.lastAnalyzedAt = new Date().toLocaleString('zh-CN');
                this.feasibilityAnalysis.isAnalyzing = false;
            }, 2000);
        },
        exportFeasibilityReport() {
            // 生成报告内容
            const reportContent = this.generateFeasibilityReportContent();

            // 创建 Blob 并下载
            const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `诉讼可行性评估报告_${this.caseData.id}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('可行性报告已导出！');
        },
        generateFeasibilityReportContent() {
            const conclusion = this.feasibilityAnalysis.conclusion;
            const evidence = this.feasibilityAnalysis.evidenceScore;
            const similarCases = this.feasibilityAnalysis.similarCases;

            const recommendationText = conclusion.recommendation === 'proceed' ? '✅ 建议起诉' :
                conclusion.recommendation === 'caution' ? '⚠️ 谨慎处理' : '❌ 不建议起诉';

            return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>诉讼可行性评估报告 - ${this.caseData.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
        h1 { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; }
        h2 { color: #1a1a1a; border-left: 4px solid #1a1a1a; padding-left: 12px; margin-top: 30px; }
        .meta { text-align: center; color: #666; margin-bottom: 30px; }
        .summary-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .conclusion { font-size: 24px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .proceed { background: #dcfce7; color: #166534; }
        .caution { background: #fef3c7; color: #92400e; }
        .not_recommended { background: #fee2e2; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #e5e5e5; padding: 10px; text-align: left; }
        th { background: #f9fafb; }
        .progress { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; }
        .progress-bar { height: 100%; background: #22c55e; }
        .key-point { padding: 10px; margin: 5px 0; border-radius: 4px; }
        .positive { background: #f0fdf4; }
        .warning { background: #fffbeb; }
        .info { background: #f8fafc; }
        .footer { text-align: center; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
    </style>
</head>
<body>
    <h1>诉讼可行性评估报告</h1>
    <div class="meta">
        <p>案件名称：${this.caseData.name}</p>
        <p>案件编号：${this.caseData.id} | 生成时间：${new Date().toLocaleString('zh-CN')}</p>
    </div>
    
    <div class="conclusion ${conclusion.recommendation}">
        ${recommendationText}
    </div>
    
    <div class="summary-box">
        <strong>综合评估意见：</strong>${conclusion.summary}
    </div>
    
    <h2>一、胜诉率预测</h2>
    <p>基于现有证据分析，本案胜诉概率为 <strong>${conclusion.confidenceLevel}%</strong></p>
    
    <h2>二、证据完整度评分</h2>
    <p>综合评分：<strong>${evidence.total}/100</strong></p>
    <table>
        <tr><th>证据类型</th><th>评分</th><th>说明</th></tr>
        ${evidence.breakdown.map(item => `<tr><td>${item.name}</td><td>${item.score}%</td><td>${item.desc}</td></tr>`).join('')}
    </table>
    
    <h2>三、类案裁判分析</h2>
    <p>检索到 <strong>${similarCases.totalCases}</strong> 个相似案例</p>
    <table>
        <tr><th>裁判结果</th><th>比例</th></tr>
        <tr><td>胜诉</td><td>${similarCases.winRate}%</td></tr>
        <tr><td>部分支持</td><td>${similarCases.partialRate}%</td></tr>
        <tr><td>败诉</td><td>${similarCases.loseRate}%</td></tr>
    </table>
    
    <h3>代表性案例</h3>
    <table>
        <tr><th>案号</th><th>审理法院</th><th>裁判结果</th><th>相似度</th></tr>
        ${similarCases.cases.map(c => `<tr><td>${c.id}</td><td>${c.court}</td><td>${c.result}</td><td>${c.similarity}%</td></tr>`).join('')}
    </table>
    
    <h2>四、关键评估要点</h2>
    ${conclusion.keyPoints.map(p => `<div class="key-point ${p.type}">${p.type === 'positive' ? '✅' : p.type === 'warning' ? '⚠️' : 'ℹ️'} ${p.text}</div>`).join('')}
    
    <h2>五、风险提示</h2>
    <ul>
        <li>部分项目验收文件缺失，需补充邮件往来记录</li>
        <li>合同中付款条件约定不够明确，建议重点举证</li>
    </ul>
    
    <h2>六、策略建议</h2>
    <p>建议重点收集：1）项目交付确认的邮件记录；2）被告方的验收反馈意见；3）双方关于质量问题的沟通记录。同时准备技术专家鉴定，证明软件功能符合合同约定。</p>
    
    <div class="footer">
        <p>本报告由 AI 法律助手自动生成，仅供参考</p>
        <p>Alpha&Leader Legal Tech</p>
    </div>
</body>
</html>
            `.trim();
        }
    },
    template: `
        <div class="ai-analysis-component">
            <!-- Action Buttons -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="font-size: 13px; color: #666;">
                    <i class="fas fa-clock" style="margin-right: 6px;"></i>
                    上次分析：{{ feasibilityAnalysis.lastAnalyzedAt }}
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="smart-btn-secondary" @click="refreshFeasibilityAnalysis" :disabled="feasibilityAnalysis.isAnalyzing">
                        <i :class="feasibilityAnalysis.isAnalyzing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
                        {{ feasibilityAnalysis.isAnalyzing ? '分析中...' : '刷新分析' }}
                    </button>
                    <button class="smart-btn-primary" @click="exportFeasibilityReport">
                        <i class="fas fa-file-pdf"></i> 导出可行性报告
                    </button>
                </div>
            </div>

            <!-- 胜诉率预测卡片 -->
            <div class="modern-card" style="margin-bottom: 20px;">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-chart-line" style="margin-right: 8px; color: #1a1a1a;"></i>
                        胜诉率预测
                    </div>
                </div>
                <div style="display: flex; align-items: baseline; margin-bottom: 12px;">
                    <span style="color: #1a1a1a; font-weight: 700; font-size: 48px; line-height: 1;">{{ feasibilityAnalysis.conclusion.confidenceLevel }}%</span>
                    <span style="margin-left: 12px; color: #666; font-size: 14px;">(基于现有证据分析)</span>
                </div>
                <div style="height: 12px; background: #e5e5e5; border-radius: 6px; overflow: hidden;">
                    <div :style="{ width: feasibilityAnalysis.conclusion.confidenceLevel + '%', height: '100%', background: feasibilityAnalysis.conclusion.confidenceLevel >= 70 ? '#22c55e' : feasibilityAnalysis.conclusion.confidenceLevel >= 50 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s ease' }"></div>
                </div>
            </div>

            <!-- 证据完整度评分卡片 -->
            <div class="modern-card" style="margin-bottom: 20px;">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-clipboard-check" style="margin-right: 8px; color: #1a1a1a;"></i>
                        证据完整度评分
                    </div>
                    <div style="font-size: 24px; font-weight: 700; color: #1a1a1a;">
                        {{ feasibilityAnalysis.evidenceScore.total }}<span style="font-size: 14px; font-weight: 400; color: #666;">/100</span>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div v-for="item in feasibilityAnalysis.evidenceScore.breakdown" :key="item.name">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="font-size: 13px; color: #1a1a1a; font-weight: 500;">{{ item.name }}</span>
                            <span style="font-size: 13px; color: #666;">{{ item.score }}%</span>
                        </div>
                        <div style="height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden;">
                            <div :style="{ width: item.score + '%', height: '100%', background: item.score >= 85 ? '#22c55e' : item.score >= 70 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s ease' }"></div>
                        </div>
                        <div style="font-size: 12px; color: #999; margin-top: 4px;">{{ item.desc }}</div>
                    </div>
                </div>
            </div>

            <!-- 风险点提示卡片 -->
            <div class="modern-card" style="margin-bottom: 20px;">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-exclamation-triangle" style="margin-right: 8px; color: #d97706;"></i>
                        风险点提示
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: start; gap: 8px; padding: 10px; background: #fef3c7; border-left: 3px solid #d97706; border-radius: 4px;">
                        <i class="fas fa-exclamation-triangle" style="color: #d97706; margin-top: 2px;"></i>
                        <span style="font-size: 13px; color: #92400e;">部分项目验收文件缺失，需补充邮件往来记录</span>
                    </div>
                    <div style="display: flex; align-items: start; gap: 8px; padding: 10px; background: #f5f5f5; border-left: 3px solid #666; border-radius: 4px;">
                        <i class="fas fa-info-circle" style="color: #666; margin-top: 2px;"></i>
                        <span style="font-size: 13px; color: #1a1a1a;">合同中付款条件约定不够明确，建议重点举证</span>
                    </div>
                </div>
            </div>

            <!-- 类案裁判分析卡片 -->
            <div class="modern-card" style="margin-bottom: 20px;">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-balance-scale" style="margin-right: 8px; color: #1a1a1a;"></i>
                        类案裁判分析
                    </div>
                </div>
                <!-- 统计信息 -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #1a1a1a;">{{ feasibilityAnalysis.similarCases.totalCases }}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">相似案例</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #22c55e;">{{ feasibilityAnalysis.similarCases.winRate }}%</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">胜诉率</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">{{ feasibilityAnalysis.similarCases.partialRate }}%</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">部分支持</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #ef4444;">{{ feasibilityAnalysis.similarCases.loseRate }}%</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">败诉率</div>
                    </div>
                </div>
                <!-- 案例列表 -->
                <div class="table-container">
                    <table class="modern-table">
                        <thead>
                            <tr>
                                <th>案号</th>
                                <th>审理法院</th>
                                <th>裁判结果</th>
                                <th>相似度</th>
                                <th>标的额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="caseItem in feasibilityAnalysis.similarCases.cases" :key="caseItem.id">
                                <td style="color: #2563eb; cursor: pointer;">{{ caseItem.id }}</td>
                                <td>{{ caseItem.court }}</td>
                                <td>
                                    <span :class="['status-badge-sm', caseItem.result === '胜诉' ? 'success' : caseItem.result === '部分支持' ? 'warning' : 'danger']">
                                        {{ caseItem.result }}
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="flex: 1; height: 6px; background: #e5e5e5; border-radius: 3px; overflow: hidden;">
                                            <div :style="{ width: caseItem.similarity + '%', height: '100%', background: '#1a1a1a' }"></div>
                                        </div>
                                        <span style="font-size: 12px; color: #666;">{{ caseItem.similarity }}%</span>
                                    </div>
                                </td>
                                <td>{{ caseItem.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- AI策略建议卡片 -->
            <div class="modern-card" style="margin-bottom: 20px;">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-lightbulb" style="margin-right: 8px; color: #f59e0b;"></i>
                        AI 策略建议
                    </div>
                </div>
                <p style="margin: 0; color: #1a1a1a; line-height: 1.8; font-size: 13px; background: #f5f5f5; padding: 12px; border-radius: 6px;">
                    建议重点收集：1）项目交付确认的邮件记录；2）被告方的验收反馈意见；3）双方关于质量问题的沟通记录。同时准备技术专家鉴定，证明软件功能符合合同约定。
                </p>
            </div>

            <!-- 综合可行性结论卡片 -->
            <div class="modern-card" :style="{ borderLeft: '4px solid ' + (feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '#22c55e' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '#f59e0b' : '#ef4444') }">
                <div class="card-header" style="background: transparent;">
                    <div class="card-title">
                        <i class="fas fa-gavel" style="margin-right: 8px; color: #1a1a1a;"></i>
                        综合可行性结论
                    </div>
                    <div :style="{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '#dcfce7' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '#fef3c7' : '#fee2e2',
                        color: feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '#166534' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '#92400e' : '#991b1b'
                    }">
                        <i :class="feasibilityAnalysis.conclusion.recommendation === 'proceed' ? 'fas fa-check-circle' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? 'fas fa-exclamation-circle' : 'fas fa-times-circle'"></i>
                        {{ feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '建议起诉' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '谨慎处理' : '不建议起诉' }}
                    </div>
                </div>
                <p style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 14px; line-height: 1.6;">
                    {{ feasibilityAnalysis.conclusion.summary }}
                </p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div v-for="(point, index) in feasibilityAnalysis.conclusion.keyPoints" :key="index"
                            :style="{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                background: point.type === 'positive' ? '#f0fdf4' : point.type === 'warning' ? '#fffbeb' : '#f8fafc',
                                fontSize: '13px'
                            }">
                        <i :class="point.type === 'positive' ? 'fas fa-check-circle' : point.type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'"
                            :style="{ color: point.type === 'positive' ? '#22c55e' : point.type === 'warning' ? '#f59e0b' : '#64748b' }"></i>
                        <span :style="{ color: point.type === 'positive' ? '#166534' : point.type === 'warning' ? '#92400e' : '#334155' }">{{ point.text }}</span>
                    </div>
                </div>
            </div>
        </div>
    `
};
