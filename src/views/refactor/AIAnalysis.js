

export default {
    name: 'AIAnalysis',
    props: ['caseData'],
    data() {
        return {
            feasibilityAnalysis: {
                // 1. 案情概要 (Case Background)
                caseBackground: {
                    summary: '',
                    focus: '',
                    objective: ''
                },
                // 2. 事实与证据 (Fact & Evidence)
                evidenceGapAnalysis: {
                    totalItems: 0,
                    verifiedCount: 0,
                    items: [], // { name, status, remark, isRisk }
                    burdenOfProof: '',
                    originality: ''
                },
                // 3. 法律分析 (Legal Analysis)
                legalAnalysis: {
                    jurisdiction: '',
                    causeOfAction: '',
                    statuteOfLimitations: '',
                    currentPage: 1,
                    pageSize: 3,
                    total: 5,
                    relevantLaws: [
                        {
                            id: 'L001',
                            title: '中华人民共和国民法典',
                            statute: '第五百七十七条',
                            effectivenessLevel: '法律',
                            publishDate: '2020-05-28',
                            content: '当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。'
                        },
                        {
                            id: 'L002',
                            title: '中华人民共和国民法典',
                            statute: '第七百八十一条',
                            effectivenessLevel: '法律',
                            publishDate: '2020-05-28',
                            content: '承揽人交付的工作成果不符合质量要求的，定作人可以合理选择请求承揽人承担修理、重作、减少报酬、赔偿损失等违约责任。'
                        },
                        {
                            id: 'L003',
                            title: '最高人民法院关于审理建设工程施工合同纠纷案件适用法律问题的解释（一）',
                            statute: '第十三条',
                            effectivenessLevel: '司法解释',
                            publishDate: '2020-12-25',
                            content: '虽未竣工验收但发包人擅自使用的，以转移占有建设工程之日为竣工日期。'
                        }
                    ]
                },
                // 4. 风险评估 (Risk Assessment)
                riskAssessment: {
                    swot: {
                        strengths: [],
                        weaknesses: [],
                        opportunities: [],
                        threats: []
                    },
                    winRateRange: ''
                },
                // 5. 执行可行性 (Enforcement Feasibility)
                enforcement: {
                    solvency: '', // High/Medium/Low
                    solvencyAnalysis: '',
                    preservation: '',
                    executionDifficulty: ''
                },
                // 6. 诉讼策略与流程 (Strategy & Timeline)
                strategyPlan: {
                    recommendation: '', // Litigation/Settlement/Drop
                    timeline: '',
                    contingency: '',
                    steps: []
                },
                // 7. 成本收益分析 (Cost-Benefit Analysis)
                costBenefit: {
                    estimatedCost: '',
                    expectedReturn: '',
                    roi: ''
                },

                // 类案裁判分析 (保留)
                similarCases: {
                    totalCases: 0,
                    avgSimilarity: 0,
                    currentPage: 1,
                    pageSize: 5,
                    cases: []
                },

                // 综合结论
                conclusion: {
                    recommendation: 'caution',
                    summary: '点击“刷新分析”以生成报告...',
                    keyPoints: []
                },

                // 状态
                isAnalyzing: false,
                lastAnalyzedAt: '-'
            }
        };
    },
    computed: {
        paginatedLaws() {
            const start = (this.feasibilityAnalysis.legalAnalysis.currentPage - 1) * this.feasibilityAnalysis.legalAnalysis.pageSize;
            const end = start + this.feasibilityAnalysis.legalAnalysis.pageSize;
            return this.feasibilityAnalysis.legalAnalysis.relevantLaws.slice(start, end);
        },
        lawTotalPages() {
            return Math.ceil(this.feasibilityAnalysis.legalAnalysis.relevantLaws.length / this.feasibilityAnalysis.legalAnalysis.pageSize);
        },
        paginatedSimilarCases() {
            const start = (this.feasibilityAnalysis.similarCases.currentPage - 1) * this.feasibilityAnalysis.similarCases.pageSize;
            const end = start + this.feasibilityAnalysis.similarCases.pageSize;
            return this.feasibilityAnalysis.similarCases.cases.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.feasibilityAnalysis.similarCases.cases.length / this.feasibilityAnalysis.similarCases.pageSize);
        }
    },
    methods: {
        changeLawPage(page) {
            if (page >= 1 && page <= this.lawTotalPages) {
                this.feasibilityAnalysis.legalAnalysis.currentPage = page;
            }
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.feasibilityAnalysis.similarCases.currentPage = page;
            }
        },
        refreshFeasibilityAnalysis() {
            this.feasibilityAnalysis.isAnalyzing = true;

            // 模拟 AI 聚合分析过程
            setTimeout(() => {
                const fa = this.feasibilityAnalysis;

                // 1. 案情概要 (Mock Aggregation from CaseBasicInfo)
                fa.caseBackground = {
                    summary: '原告张某与被告某科技公司签订软件开发合同，约定总价100万元。交付后被告仅支付50万元，以质量不合格为由拒付尾款。',
                    focus: '1. 软件是否已通过验收标准；2. 质量问题是否构成根本违约。',
                    objective: '主张支付尾款50万元及违约金8万元。'
                };

                // 2. 事实与证据 (Mock Aggregation from CaseEvidence + AI Logic)
                const evidenceItems = [
                    { name: '软件开发合同', status: 'verified', remark: '已上传，条款清晰。', isRisk: false },
                    { name: '银行转账记录', status: 'verified', remark: '已上传，证明已付50万。', isRisk: false },
                    { name: '终验报告', status: 'missing', remark: '缺失！最关键证据，缺乏双方签字确认。', isRisk: true },
                    { name: '往来邮件记录', status: 'partial', remark: '仅有部分沟通记录，需补充完整链条。', isRisk: true }
                ];
                fa.evidenceGapAnalysis.items = evidenceItems;
                fa.evidenceGapAnalysis.totalItems = evidenceItems.length;
                fa.evidenceGapAnalysis.verifiedCount = evidenceItems.filter(i => i.status === 'verified').length;
                fa.evidenceGapAnalysis.burdenOfProof = '我方（原告）需对"软件已依约交付合格产品"通过验收报告或间接证据（如上线运行记录）承担主要举证责任。';
                fa.evidenceGapAnalysis.originality = '目前核心合同为原件，但往来邮件需公证以提升证明力。';

                // 3. 法律分析 (AI Inference - Mocking Farui Law Search API)
                fa.legalAnalysis = {
                    jurisdiction: '根据合同第12条约定，由原告住所地（北京市朝阳区）人民法院管辖。',
                    causeOfAction: '建议选择"承揽合同纠纷"（需注意区分技术服务合同），对质量标准认定更有利。',
                    statuteOfLimitations: '目前处于诉讼时效内。最后一次催款时间为2023年10月，时效中断。',
                    currentPage: 1,
                    pageSize: 3,
                    total: 3,
                    relevantLaws: [
                        {
                            id: 'L001',
                            title: '中华人民共和国民法典',
                            statute: '第五百七十七条',
                            effectivenessLevel: '法律',
                            publishDate: '2020-05-28',
                            content: '当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。'
                        },
                        {
                            id: 'L002',
                            title: '中华人民共和国民法典',
                            statute: '第七百八十一条',
                            effectivenessLevel: '法律',
                            publishDate: '2020-05-28',
                            content: '承揽人交付的工作成果不符合质量要求的，定作人可以合理选择请求承揽人承担修理、重作、减少报酬、赔偿损失等违约责任。'
                        },
                        {
                            id: 'L003',
                            title: '最高人民法院关于审理建设工程施工合同纠纷案件适用法律问题的解释（一）',
                            statute: '第十三条',
                            effectivenessLevel: '司法解释',
                            publishDate: '2020-12-25',
                            content: '虽未竣工验收但发包人擅自使用的，以转移占有建设工程之日为竣工日期。'
                        }
                    ]
                };

                // 4. 风险评估 (SWOT)
                fa.riskAssessment = {
                    swot: {
                        strengths: ['合同金额明确', '对方已部分付款承认合同关系'],
                        weaknesses: ['缺乏书面验收单', '开发周期有延迟'],
                        opportunities: ['对方近期中标新项目，现金流可能改善', '调解意愿可能较高'],
                        threats: ['对方可能反诉质量问题并索赔', '诉讼周期长导致回款慢']
                    },
                    winRateRange: '60% - 70%'
                };

                // 5. 执行可行性 (Mock Aggregation from CaseFinancials/AI)
                fa.enforcement = {
                    solvency: '中等', // 强/中等/差
                    solvencyAnalysis: '经查，被告注册资本1000万，实缴500万。名下有软件著作权12项。目前涉及另案诉讼2起（均为原告），显示其具备一定偿债能力，但现金流可能紧张。',
                    preservation: '强烈建议：诉前财产保全。主要锁定其对公账户或即将回款的项目资金。',
                    executionDifficulty: '中等。对方非失信被执行人，主要风险在于资产流动性。'
                };

                // 6. 成本收益 (Mock Aggregation from CaseFinancials)
                // 标的 58万，成本预估 3万
                const estimatedCostVal = 35000;
                const expectedReturnVal = 580000;
                const roiVal = ((expectedReturnVal - estimatedCostVal) / estimatedCostVal).toFixed(1);
                fa.costBenefit = {
                    estimatedCost: `约 ¥${(estimatedCostVal / 10000).toFixed(2)}万 (含诉讼费、保全费、律师费)`,
                    expectedReturn: `约 ¥${(expectedReturnVal / 10000).toFixed(2)}万 (本金+违约金)`,
                    roi: `${roiVal} 倍`
                };

                // 7. 类案分析 (Mock)
                fa.similarCases.totalCases = 12;
                fa.similarCases.avgSimilarity = 78;
                fa.similarCases.cases = [
                    { id: '(2023)京01民终1234号', court: '北京一中院', verdict: '判决支持原告主张，认定邮件沟通可视作实际验收。', similarity: 85 },
                    { id: '(2022)沪02民终5678号', court: '上海二中院', verdict: '因缺乏验收单且存在质量瑕疵，酌情扣减15%开发费。', similarity: 82 },
                    { id: '(2023)粤03民终9988号', court: '深圳中院', verdict: '驳回上诉，维持原判。', similarity: 79 },
                    { id: '(2022)苏05民初1122号', court: '苏州中院', verdict: '被告给付原告工程款30万元。', similarity: 76 },
                    { id: '(2023)浙01民终3344号', court: '杭州中院', verdict: '判决驳回全部诉讼请求。', similarity: 70 }
                ];

                // 8. 综合结论逻辑 (3-branch Decision)
                // Logic: 
                // - Proceed: Evidence Verified >= 75% AND Solvency != Low AND ROI > 5
                // - Settlement: Evidence < 75% OR Solvency == Medium
                // - Not Recommended: Evidence < 50% OR Solvency == Low OR ROI < 1

                const evidenceRate = (fa.evidenceGapAnalysis.verifiedCount / fa.evidenceGapAnalysis.totalItems);

                if (evidenceRate >= 0.75 && fa.enforcement.solvency !== '差') {
                    // 建议起诉
                    fa.strategyPlan.recommendation = 'Litigation';
                    fa.conclusion.recommendation = 'proceed';
                    fa.conclusion.summary = '核心证据充分，对方偿债能力尚可，建议立即起诉并保全。';
                    fa.strategyPlan.steps = ['发送正式律师函', '法院立案并申请保全', '准备庭审质证'];
                } else if (evidenceRate >= 0.4 || fa.enforcement.solvency === '中等') {
                    // 建议和解 (本Mock案例落入此区间，因为缺少验收单)
                    fa.strategyPlan.recommendation = 'Settlement';
                    fa.conclusion.recommendation = 'caution';
                    fa.conclusion.summary = '关键证据（验收单）缺失，存在败诉或扣减风险；建议以诉促调，争取快速回款。';
                    fa.strategyPlan.steps = ['起草和解协议', '提起诉讼施压', '由法官主持调解'];
                } else {
                    // 不建议起诉
                    fa.strategyPlan.recommendation = 'Drop';
                    fa.conclusion.recommendation = 'not_recommended';
                    fa.conclusion.summary = '证据严重不足且对方资产状况恶化，起诉得不偿失。';
                    fa.strategyPlan.steps = ['补充证据', '暂缓起诉'];
                }

                fa.strategyPlan.timeline = '预计一审周期：6个月；执行周期：3-6个月。';
                fa.strategyPlan.contingency = '若对方反诉质量问题，需申请第三方技术鉴定（增加时长3个月+）。';

                // 生成关键点
                fa.conclusion.keyPoints = [
                    { type: 'warning', text: '核心证据缺失（无验收单）' },
                    { type: 'positive', text: 'ROI 回报率高 (15.6倍)' },
                    { type: 'info', text: '对方有一定偿债能力，保全是关键' }
                ];

                fa.lastAnalyzedAt = new Date().toLocaleString('zh-CN');
                fa.isAnalyzing = false;
            }, 2000);
        },
        generateFeasibilityReportContent() {
            const fa = this.feasibilityAnalysis;
            const recColor = fa.conclusion.recommendation === 'proceed' ? '#dcfce7' : fa.conclusion.recommendation === 'caution' ? '#fef3c7' : '#fee2e2';
            const recText = fa.conclusion.recommendation === 'proceed' ? '✅ 建议起诉' : fa.conclusion.recommendation === 'caution' ? '⚠️ 建议和解/调解' : '❌ 不建议起诉';

            return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    body { font-family: sans-serif; max-width: 900px; margin: 20px auto; color: #333; line-height: 1.6; }
    h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { background: #f3f4f6; padding: 10px; border-left: 5px solid #2563eb; margin-top: 30px; }
    .section-content { padding: 10px 15px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f9fafb; }
    .tag { padding: 2px 6px; border-radius: 4px; font-size: 12px; color: white; }
    .bg-green { background: #16a34a; } .bg-orange { background: #ea580c; } .bg-red { background: #dc2626; }
    .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .swot-box { padding: 15px; border-radius: 6px; border: 1px solid #eee; }
    .conclusion-box { padding: 20px; text-align: center; font-size: 18px; font-weight: bold; background: ${recColor}; border-radius: 8px; margin-bottom: 30px; }
    .key-metrics { display: flex; justify-content: space-around; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .metric { text-align: center; } .metric-val { font-size: 20px; font-weight: bold; color: #2563eb; }
</style>
</head>
<body>
    <h1>案件诉讼可行性 AI 分析报告</h1>
    <div style="text-align: center; color: #666; margin-bottom: 20px;">生成时间：${new Date().toLocaleString('zh-CN')}</div>

    <div class="conclusion-box">
        综合结论：${recText}
        <div style="font-size: 14px; font-weight: normal; margin-top: 10px;">${fa.conclusion.summary}</div>
    </div>

    <div class="key-metrics">
        <div class="metric"><div class="metric-val">${fa.riskAssessment.winRateRange}</div>胜诉率预估</div>
        <div class="metric"><div class="metric-val">${fa.costBenefit.roi}</div>预期 ROI</div>
        <div class="metric"><div class="metric-val">${fa.enforcement.solvency}</div>偿债能力</div>
    </div>

    <h2>1. 案情概要 (Case Background)</h2>
    <div class="section-content">
        <p><strong>争议摘要：</strong>${fa.caseBackground.summary}</p>
        <p><strong>核心焦点：</strong>${fa.caseBackground.focus}</p>
        <p><strong>诉讼请求：</strong>${fa.caseBackground.objective}</p>
    </div>

    <h2>2. 事实与证据分析 (Fact & Evidence)</h2>
    <div class="section-content">
        <p><strong>证据链覆盖率：</strong>${fa.evidenceGapAnalysis.verifiedCount}/${fa.evidenceGapAnalysis.totalItems}</p>
        <table>
            <tr><th>证据名称</th><th>状态</th><th>分析备注</th></tr>
            ${fa.evidenceGapAnalysis.items.map(i => `
                <tr>
                    <td>${i.name}</td>
                    <td><span class="tag ${i.status === 'verified' ? 'bg-green' : i.status === 'missing' ? 'bg-red' : 'bg-orange'}">${i.status}</span></td>
                    <td>${i.remark}</td>
                </tr>`).join('')}
        </table>
        <p style="margin-top:10px;"><strong>举证责任：</strong>${fa.evidenceGapAnalysis.burdenOfProof}</p>
        <p><strong>证明力评估：</strong>${fa.evidenceGapAnalysis.originality}</p>
    </div>

    <h2>3. 法律分析 (Legal Analysis)</h2>
    <div class="section-content">
        <p><strong>管辖法院：</strong>${fa.legalAnalysis.jurisdiction}</p>
        <p><strong>案由选择：</strong>${fa.legalAnalysis.causeOfAction}</p>
        <p><strong>诉讼时效：</strong>${fa.legalAnalysis.statuteOfLimitations}</p>
        <div style="margin-top: 15px;">
            <strong>法律依据：</strong>
            ${fa.legalAnalysis.relevantLaws.map(law => `
                <div style="margin-top: 10px; border-bottom: 1px dashed #eee; padding-bottom: 8px;">
                    <div style="color: #2563eb; font-weight: bold; margin-bottom: 4px;">
                        ${law.title} 
                        <span style="font-size: 12px; color: #fff; background: #e0e7ff; color: #4338ca; padding: 2px 4px; border-radius: 3px; margin-left: 5px;">${law.statute}</span>
                        <span style="font-size: 12px; color: #fff; background: #1d4ed8; padding: 2px 4px; border-radius: 3px; margin-left: 5px;">${law.effectivenessLevel || '法律'}</span>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">发布日期：${law.publishDate || '-'}</div>
                    <div>${law.content}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <h2>4. 风险评估</h2>
    <div class="section-content">
        <div class="swot-grid">
            <div class="swot-box" style="background:#f0fdf4;"><strong>优势</strong><ul>${fa.riskAssessment.swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>
            <div class="swot-box" style="background:#fef2f2;"><strong>劣势</strong><ul>${fa.riskAssessment.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul></div>
            <div class="swot-box" style="background:#eff6ff;"><strong>机会</strong><ul>${fa.riskAssessment.swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul></div>
            <div class="swot-box" style="background:#fff7ed;"><strong>威胁</strong><ul>${fa.riskAssessment.swot.threats.map(s => `<li>${s}</li>`).join('')}</ul></div>
        </div>
    </div>

    <h2>5. 执行可行性 (Enforcement)</h2>
    <div class="section-content">
        <p><strong>偿债能力：</strong>${fa.enforcement.solvencyAnalysis}</p>
        <p><strong>保全建议：</strong>${fa.enforcement.preservation}</p>
        <p><strong>执行难易度：</strong>${fa.enforcement.executionDifficulty}</p>
    </div>

    <h2>6. 诉讼策略 (Strategy)</h2>
    <div class="section-content">
        <p><strong>核心策略：</strong>${fa.conclusion.recommendation === 'proceed' ? '快速推进诉讼' : '以诉促调，防守反击'}</p>
        <p><strong>时间周期：</strong>${fa.strategyPlan.timeline}</p>
        <p><strong>应急预案：</strong>${fa.strategyPlan.contingency}</p>
    </div>

    <h2>7. 成本收益分析 (Cost-Benefit)</h2>
    <div class="section-content">
        <table>
            <tr><td>预估成本</td><td>${fa.costBenefit.estimatedCost}</td></tr>
            <tr><td>预期收益</td><td>${fa.costBenefit.expectedReturn}</td></tr>
            <tr><td><strong>ROI</strong></td><td><strong>${fa.costBenefit.roi}</strong></td></tr>
        </table>
    </div>

    <div style="margin-top: 40px; padding: 15px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; color: #92400e; font-size: 13px; text-align: center;">
        <strong>⚠️ 免责声明：</strong> 本报告由人工智能自动生成，仅供律师办案参考，不构成正式法律意见。具体诉讼策略请结合案件实际情况由专业律师审定。
    </div>
</body>
</html>`;
        },
        exportFeasibilityReport() {
            const reportContent = this.generateFeasibilityReportContent();
            const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `案件可行性分析报告_${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    template: `
        <div class="ai-analysis-component">
            <!-- Header Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="font-size: 14px; color: #666;">
                    <i class="fas fa-clock" style="margin-right: 6px;"></i>
                    上次分析：{{ feasibilityAnalysis.lastAnalyzedAt }}
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="smart-btn-secondary" @click="refreshFeasibilityAnalysis" :disabled="feasibilityAnalysis.isAnalyzing" style="font-size: 14px; padding: 8px 16px;">
                        <i :class="feasibilityAnalysis.isAnalyzing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
                        {{ feasibilityAnalysis.isAnalyzing ? '深度分析中...' : '刷新分析' }}
                    </button>
                    <button v-if="feasibilityAnalysis.lastAnalyzedAt !== '-'" class="smart-btn-primary" @click="exportFeasibilityReport" :disabled="feasibilityAnalysis.isAnalyzing" style="font-size: 14px; padding: 8px 16px;">
                        <i class="fas fa-file-export"></i> 导出报告
                    </button>
                </div>
            </div>

            <!-- Disclaimer Banner -->
            <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 10px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #92400e; font-size: 13px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span><strong>注意：</strong> AI生成结果仅供参考，不构成法律意见。</span>
            </div>

            <!-- 综合结论卡片 (Dashboad Style) -->
            <div v-if="feasibilityAnalysis.lastAnalyzedAt !== '-'">
                <div class="modern-card" style="margin-bottom: 24px; border-left: 4px solid;" 
                     :style="{ borderColor: feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '#16a34a' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '#ea580c' : '#dc2626' }">
                    <div style="padding: 24px;">
                        <div style="font-size: 20px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;"
                             :style="{ color: feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '#16a34a' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '#ea580c' : '#dc2626' }">
                            <i :class="feasibilityAnalysis.conclusion.recommendation === 'proceed' ? 'fas fa-check-circle' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? 'fas fa-exclamation-circle' : 'fas fa-times-circle'"></i>
                            {{ feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '建议起诉/仲裁' : feasibilityAnalysis.conclusion.recommendation === 'caution' ? '建议和解/调解' : '不建议起诉' }}
                        </div>
                        <div style="color: #334155; font-size: 15px; line-height: 1.6;">
                            {{ feasibilityAnalysis.conclusion.summary }}
                        </div>
                    </div>
                    <div style="border-top: 1px solid #f1f5f9; padding: 16px 24px; display: grid; grid-template-columns: repeat(3, 1fr); background: #f8fafc;">
                        <div style="text-align: center; border-right: 1px solid #e2e8f0;">
                            <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">胜诉率预估</div>
                            <div style="font-size: 18px; font-weight: 600; color: #0f172a;">{{ feasibilityAnalysis.riskAssessment.winRateRange || '-' }}</div>
                        </div>
                        <div style="text-align: center; border-right: 1px solid #e2e8f0;">
                            <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">预期 ROI</div>
                            <div style="font-size: 18px; font-weight: 600; color: #0f172a;">{{ feasibilityAnalysis.costBenefit.roi || '-' }}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">偿债能力</div>
                            <div style="font-size: 18px; font-weight: 600; color: #0f172a;">{{ feasibilityAnalysis.enforcement.solvency || '-' }}</div>
                        </div>
                    </div>
                </div>

                <!-- 1. 案情与证据 (双栏布局) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                    <!-- 案情概要 -->
                    <div class="modern-card">
                        <div class="card-header" style="background: transparent;">
                            <div class="card-title">1. 案情概要</div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <div>
                                <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 6px;">争议摘要</span>
                                <div style="font-size: 14px; color: #1e293b; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 6px;">{{ feasibilityAnalysis.caseBackground.summary }}</div>
                            </div>
                            <div>
                                <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 6px;">核心诉求</span>
                                <div style="font-size: 14px; color: #1e293b;">{{ feasibilityAnalysis.caseBackground.objective }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 事实与证据核查 -->
                    <div class="modern-card">
                        <div class="card-header" style="background: transparent;">
                            <div class="card-title">2. 事实与证据核查</div>
                            <div style="font-size: 13px; color: #64748b;">
                                覆盖率: <span style="color: #0f172a; font-weight: 600;">{{ Math.round((feasibilityAnalysis.evidenceGapAnalysis.verifiedCount / feasibilityAnalysis.evidenceGapAnalysis.totalItems) * 100) }}%</span>
                            </div>
                        </div>
                        <div>
                            <div v-for="(item, idx) in feasibilityAnalysis.evidenceGapAnalysis.items" :key="idx" 
                                 style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <i :class="item.status === 'verified' ? 'fas fa-check-circle text-green-600' : item.status === 'missing' ? 'fas fa-times-circle text-red-600' : 'fas fa-exclamation-circle text-orange-600'"></i>
                                    <span style="color: #1e293b; font-weight: 500;">{{ item.name }}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <span style="color: #64748b;">{{ item.remark }}</span>
                                    <span :class="item.status === 'verified' ? 'bg-green-100 text-green-700' : item.status === 'missing' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'" 
                                          style="padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                                        {{ item.status === 'verified' ? '已核实' : item.status === 'missing' ? '缺失' : '存疑' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. 法律分析 -->
                <div class="modern-card" style="margin-bottom: 24px;">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">3. 法律分析</div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">管辖法院</span>
                                <div style="font-size: 14px; color: #1e293b; font-weight: 500;">{{ feasibilityAnalysis.legalAnalysis.jurisdiction }}</div>
                            </div>
                            <div>
                                <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">诉讼时效</span>
                                <div style="font-size: 14px; color: #1e293b; font-weight: 500;">{{ feasibilityAnalysis.legalAnalysis.statuteOfLimitations }}</div>
                            </div>
                        </div>
                        <div style="border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                            <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 12px;">主要法律依据</span>
                            
                            <!-- Law Items List -->
                            <template v-if="paginatedLaws.length > 0">
                                <div v-for="law in paginatedLaws" :key="law.id" style="margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-weight: 600; color: #4f46e5; font-size: 14px;">{{ law.title }}</span>
                                            <span style="background: #e0e7ff; color: #4338ca; padding: 1px 6px; border-radius: 4px; font-size: 12px;">{{ law.statute }}</span>
                                            <span v-if="law.effectivenessLevel" :style="{ background: law.effectivenessLevel === '法律' ? '#fef3c7' : '#eef2ff', color: law.effectivenessLevel === '法律' ? '#d97706' : '#4338ca' }" 
                                                  style="padding: 1px 6px; border-radius: 4px; font-size: 11px; border: 1px solid rgba(0,0,0,0.05);">
                                                {{ law.effectivenessLevel }}
                                            </span>
                                        </div>
                                        <span v-if="law.publishDate" style="font-size: 12px; color: #94a3b8;">{{ law.publishDate }}</span>
                                    </div>
                                    <div style="color: #475569; font-size: 13px; line-height: 1.6; background: #f8fafc; padding: 8px 12px; border-radius: 6px;">{{ law.content }}</div>
                                </div>
                            </template>
                            <div v-else style="color: #94a3b8; font-size: 13px; padding: 12px; text-align: center; background: #f8fafc; border-radius: 6px; margin-bottom: 16px;">
                                暂无相关法律依据
                            </div>

                            <!-- Pagination Controls -->
                            <div v-if="lawTotalPages > 1" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 16px;">
                                <button class="smart-btn-secondary" :disabled="feasibilityAnalysis.legalAnalysis.currentPage === 1" @click="changeLawPage(feasibilityAnalysis.legalAnalysis.currentPage - 1)" style="padding: 4px 10px; font-size: 12px;">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span style="font-size: 13px; color: #64748b;">
                                    {{ feasibilityAnalysis.legalAnalysis.currentPage }} / {{ lawTotalPages }}
                                </span>
                                <button class="smart-btn-secondary" :disabled="feasibilityAnalysis.legalAnalysis.currentPage === lawTotalPages" @click="changeLawPage(feasibilityAnalysis.legalAnalysis.currentPage + 1)" style="padding: 4px 10px; font-size: 12px;">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. 风险评估 -->
                <div class="modern-card" style="margin-bottom: 24px;">
                    <div class="card-header" style="background: transparent;">
                        <div class="card-title">4. 风险评估</div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
                        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; border: 1px solid #dcfce7;">
                            <div style="font-weight: 600; color: #166534; font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-plus-circle"></i> 优势
                            </div>
                            <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 13px; line-height: 1.6;">
                                <li v-for="(item, idx) in feasibilityAnalysis.riskAssessment.swot.strengths" :key="idx">{{ item }}</li>
                            </ul>
                        </div>
                        <div style="background: #fef2f2; padding: 16px; border-radius: 8px; border: 1px solid #fee2e2;">
                            <div style="font-weight: 600; color: #991b1b; font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-minus-circle"></i> 劣势
                            </div>
                            <ul style="margin: 0; padding-left: 20px; color: #b91c1c; font-size: 13px; line-height: 1.6;">
                                <li v-for="(item, idx) in feasibilityAnalysis.riskAssessment.swot.weaknesses" :key="idx">{{ item }}</li>
                            </ul>
                        </div>
                        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; border: 1px solid #dbeafe;">
                            <div style="font-weight: 600; color: #1e40af; font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-lightbulb"></i> 机会
                            </div>
                            <ul style="margin: 0; padding-left: 20px; color: #1d4ed8; font-size: 13px; line-height: 1.6;">
                                <li v-for="(item, idx) in feasibilityAnalysis.riskAssessment.swot.opportunities" :key="idx">{{ item }}</li>
                            </ul>
                        </div>
                        <div style="background: #fff7ed; padding: 16px; border-radius: 8px; border: 1px solid #ffedd5;">
                            <div style="font-weight: 600; color: #9a3412; font-size: 15px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fas fa-exclamation-triangle"></i> 威胁
                            </div>
                            <ul style="margin: 0; padding-left: 20px; color: #c2410c; font-size: 13px; line-height: 1.6;">
                                <li v-for="(item, idx) in feasibilityAnalysis.riskAssessment.swot.threats" :key="idx">{{ item }}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 5. 策略与执行 (双栏) -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                     <!-- 诉讼策略 -->
                    <div class="modern-card">
                         <div class="card-header" style="background: transparent;">
                            <div class="card-title">6. 诉讼策略</div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; gap: 12px;">
                                <div style="flex: 1; background: #f8fafc; padding: 12px; border-radius: 6px;">
                                    <span style="font-size: 12px; color: #64748b;">核心策略</span>
                                    <div style="font-weight: 500; color: #0f172a; margin-top: 4px;">{{ feasibilityAnalysis.conclusion.recommendation === 'proceed' ? '快速推进诉讼' : '以诉促调' }}</div>
                                </div>
                                <div style="flex: 1; background: #f8fafc; padding: 12px; border-radius: 6px;">
                                    <span style="font-size: 12px; color: #64748b;">预计周期</span>
                                    <div style="font-weight: 500; color: #0f172a; margin-top: 4px;">{{ feasibilityAnalysis.strategyPlan.timeline.split('；')[0] }}</div>
                                </div>
                            </div>
                            <div>
                                <span style="font-size: 13px; color: #64748b; margin-bottom: 6px; display: block;">执行步骤</span>
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <div v-for="(step, idx) in feasibilityAnalysis.strategyPlan.steps" :key="idx" 
                                         style="background: #eef2ff; color: #4338ca; padding: 4px 10px; border-radius: 16px; font-size: 13px; border: 1px solid #c7d2fe;">
                                        {{ idx + 1 }}. {{ step }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 执行与成本 -->
                    <div class="modern-card">
                         <div class="card-header" style="background: transparent;">
                            <div class="card-title">5. 执行与成本</div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                             <div style="font-size: 13px; line-height: 1.6; color: #475569;">
                                <span style="font-weight: 600; color: #0f172a;">偿债能力分析：</span>
                                {{ feasibilityAnalysis.enforcement.solvencyAnalysis }}
                            </div>
                            <div style="border-top: 1px dashed #e2e8f0; padding-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div>
                                    <div style="font-size: 12px; color: #64748b;">预估成本</div>
                                    <div style="font-size: 14px; color: #0f172a;">{{ feasibilityAnalysis.costBenefit.estimatedCost.split(' ')[1] }}</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: #64748b;">执行难易度</div>
                                    <div style="font-size: 14px; color: #0f172a;">{{ feasibilityAnalysis.enforcement.executionDifficulty }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Placeholder State -->
            <div v-else style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; color: #9ca3af; background: #fff; border-radius: 8px; border: 1px dashed #e5e7eb;">
                <i class="fas fa-robot" style="font-size: 48px; margin-bottom: 16px; color: #d1d5db;"></i>
                <div style="font-size: 16px;">AI 尚未对本案进行可行性分析</div>
                <div style="font-size: 14px; margin-top: 8px; color: #6b7280;">请点击右上角的 <span style="color: #2563eb; font-weight: 600;">“刷新分析”</span> 按钮开始生成报告</div>
            </div>
        </div>
    `
};
