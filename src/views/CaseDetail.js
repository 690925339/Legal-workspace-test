import { router } from '../router.js';

export default {
    name: 'CaseDetail',
    data() {
        return {
            activeTab: 'basic',
            activeCategory: 'basic',
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
            showEditModal: false,
            tabStructure: [
                {
                    id: 'basic',
                    name: '基础信息',
                    icon: 'fas fa-file-alt',
                    items: []
                },
                {
                    id: 'case-facts',
                    name: '案情描述',
                    icon: 'fas fa-file-text',
                    items: []
                },
                {
                    id: 'stakeholders',
                    name: '当事人信息',
                    icon: 'fas fa-users',
                    items: []
                },
                {
                    id: 'evidence',
                    name: '证据管理',
                    icon: 'fas fa-folder-open',
                    items: [
                        { id: 'evidence-list', name: '证据清单' },
                        { id: 'ai-evidence', name: '证据分析规划' }
                    ]
                },
                {
                    id: 'financials',
                    name: '财务信息',
                    icon: 'fas fa-dollar-sign',
                    items: []
                },
                {
                    id: 'advanced',
                    name: '高级功能',
                    icon: 'fas fa-cogs',
                    items: [
                        { id: 'ai-analysis', name: 'AI分析' },
                        { id: 'relationship-graph', name: '关系洞察' },
                        { id: 'timeline', name: '案件时间轴' }
                    ]
                }
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
            evidenceFiles: [
                {
                    id: 'ev001',
                    name: '购销合同.pdf',
                    type: 'pdf',
                    size: 2048576,
                    uploadTime: '2023-10-02 10:20',
                    category: 'contract',
                    status: 'success',
                    progress: 100,
                    confidence: 0.95
                },
                {
                    id: 'ev002',
                    name: '银行转账记录.png',
                    type: 'image',
                    size: 512000,
                    uploadTime: '2023-10-03 14:15',
                    category: 'payment',
                    status: 'success',
                    progress: 100,
                    confidence: 0.98
                }
            ],
            uploadingFiles: [],
            evidenceCategories: [
                { id: 'contract', name: '合同协议', color: '#e0f2fe', textColor: '#0369a1' },
                { id: 'payment', name: '支付凭证', color: '#dcfce7', textColor: '#15803d' },
                { id: 'correspondence', name: '往来函件', color: '#f3e8ff', textColor: '#7e22ce' },
                { id: 'other', name: '其他证据', color: '#f3f4f6', textColor: '#4b5563' }
            ],
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
            },
            // 关系洞察数据
            relationshipData: {
                nodes: [
                    { id: 'abc-company', name: 'ABC 公司', type: 'company', group: 1 },
                    { id: 'xyz-company', name: 'XYZ 有限公司', type: 'company', group: 2 },
                    { id: 'wang', name: '王经理', type: 'person', group: 1, role: '法定代表人' },
                    { id: 'zhang', name: '张总', type: 'person', group: 2, role: '总经理' },
                    { id: 'li', name: '李会计', type: 'person', group: 1, role: '财务负责人' },
                    { id: 'bank', name: '工商银行', type: 'company', group: 3 }
                ],
                links: [
                    { source: 'wang', target: 'abc-company', relation: '法定代表人', amount: null },
                    { source: 'li', target: 'abc-company', relation: '财务负责人', amount: null },
                    { source: 'zhang', target: 'xyz-company', relation: '总经理', amount: null },
                    { source: 'abc-company', target: 'xyz-company', relation: '合同纠纷', amount: '500,000' },
                    { source: 'abc-company', target: 'bank', relation: '转账', amount: '200,000' },
                    { source: 'xyz-company', target: 'bank', relation: '收款', amount: '200,000' }
                ],
                selectedNode: null
            }
        };
    },
    computed: {
        currentTabs() {
            if (!this.tabStructure) return [];
            const category = this.tabStructure.find(c => c.id === this.activeCategory);
            return category ? category.items : [];
        },
        currentTabName() {
            if (!this.tabStructure) return '';
            for (const category of this.tabStructure) {
                const tab = category.items.find(t => t.id === this.activeTab);
                if (tab) return tab.name;
            }
            return '';
        }
    },
    created() {
        // 解析 URL hash 获取 ID (例如 #/detail/4)
        const hash = window.location.hash;
        const parts = hash.split('/');
        const caseId = parts.length > 2 ? parts[2] : null;

        if (caseId) {
            this.loadCaseData(caseId);
        }
    },
    methods: {
        loadCaseData(id) {
            // 模拟根据ID加载数据
            if (id == 4) {
                // 未签约案件数据
                this.caseData = {
                    id: 'CASE-2023-004',
                    name: '某科技公司 知识产权纠纷案',
                    status: '未签约',
                    statusCode: 'unsigned', // 添加状态码用于样式判断
                    type: '知识产权',
                    category: '民事',
                    client: '某科技公司',
                    opposingParty: '待确定',
                    court: '待确定',
                    filingDate: '-',
                    amount: '待评估',
                    description: '客户咨询中，尚未签订委托合同。',
                    lastUpdate: '1小时前',
                    assignee: '张三'
                };
                // 未签约案件也显示完整功能，不限制标签页
                // 使用默认的 tabStructure (在 data 中定义)
                this.activeTab = 'basic';
            } else {
                // 默认案件数据 (ID 1)
                this.caseData = {
                    id: 'CASE-2023-001',
                    name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                    status: '进行中',
                    statusCode: 'active',
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
                };
            }
        },
        switchCategory(categoryId) {
            console.log('Switching to category:', categoryId);
            this.activeCategory = categoryId;
            const category = this.tabStructure.find(c => c.id === categoryId);
            console.log('Found category:', category);
            if (category && category.items.length > 0) {
                // 有子标签时，切换到第一个子标签
                this.activeTab = category.items[0].id;
            } else {
                // 没有子标签时，直接使用分类ID作为activeTab
                this.activeTab = categoryId;
            }
            console.log('Set activeTab to:', this.activeTab);
        },
        switchTab(tabId) {
            this.activeTab = tabId;
        },
        goBack() {
            router.push('/');
        },
        editCase() {
            this.showEditModal = true;
        },
        onCaseSaved(updatedData) {
            console.log('Case updated:', updatedData);
            // Update local data
            this.caseData = { ...this.caseData, ...updatedData };
            this.showEditModal = false;
            alert('案件信息已更新');
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
        },
        toggleStatus(item) {
            if (item.status === 'collected') {
                item.status = 'missing';
                item.statusText = '✗ 未收集';
                item.bgClass = '';
                item.checked = false;
            } else {
                item.status = 'collected';
                item.statusText = '✓ 已收集';
                item.bgClass = 'bg-red-light';
                item.checked = true;
            }
            this.updateEvidenceStats();
        },
        updateEvidenceStats() {
            const items = this.evidenceAnalysis.items;
            const total = items.length;
            const collected = items.filter(i => i.status === 'collected').length;
            const missing = total - collected;

            // Completeness
            const percentage = Math.round((collected / total) * 100);
            this.evidenceAnalysis.stats.completeness.value = `${percentage}%`;
            this.evidenceAnalysis.stats.completeness.label = `(${collected}/${total})`;

            // High Priority (Priority >= 4)
            const highPriorityItems = items.filter(i => i.priority >= 4);
            const highPriorityTotal = highPriorityItems.length;
            const highPriorityCollected = highPriorityItems.filter(i => i.status === 'collected').length;

            this.evidenceAnalysis.stats.collected.value = `${Math.round((highPriorityCollected / highPriorityTotal) * 100)}%`;
            this.evidenceAnalysis.stats.collected.label = `(${highPriorityCollected}/${highPriorityTotal})`;

            // Missing
            this.evidenceAnalysis.stats.missing.value = `${missing} 项`;
        },
        exportEvidenceList() {
            const items = this.evidenceAnalysis.items;
            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel compatibility
            csvContent += "建议收集的证据,重要性评分,收集状态,说明\n";

            items.forEach(item => {
                const row = [
                    item.name,
                    item.priorityLabel,
                    item.statusText,
                    item.desc
                ].map(field => `"${field}"`).join(","); // Quote fields to handle commas
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "证据收集清单.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        // 证据管理方法
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            files.forEach(file => {
                this.uploadEvidence(file);
            });

            // 重置 input 以允许重复选择同一文件
            event.target.value = '';
        },
        uploadEvidence(file) {
            const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
            const uploadItem = {
                id: fileId,
                file: file,
                name: file.name,
                type: this.getFileType(file.name),
                size: file.size,
                progress: 0,
                status: 'uploading', // uploading, analyzing, success, error
                error: null
            };

            this.uploadingFiles.push(uploadItem);
            this.simulateUpload(uploadItem);
        },
        getFileType(filename) {
            const ext = filename.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
            if (['pdf'].includes(ext)) return 'pdf';
            if (['doc', 'docx'].includes(ext)) return 'word';
            return 'other';
        },
        simulateUpload(item) {
            // 模拟上传进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 90) {
                    clearInterval(interval);
                    item.progress = 90;
                    item.status = 'analyzing';
                    this.simulateAnalysis(item);
                } else {
                    item.progress = Math.floor(progress);
                }
            }, 200);
        },
        simulateAnalysis(item) {
            // 模拟 AI 分析和分类
            setTimeout(() => {
                // 模拟 10% 的失败率
                if (Math.random() < 0.1) {
                    item.status = 'error';
                    item.error = '文件解析失败，请重试';
                    return;
                }

                item.progress = 100;
                item.status = 'success';

                // 模拟自动分类
                const categories = ['contract', 'payment', 'correspondence', 'other'];
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];

                // 添加到已完成列表
                this.evidenceFiles.unshift({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    size: item.size,
                    uploadTime: new Date().toLocaleString(),
                    category: randomCategory,
                    status: 'success',
                    progress: 100,
                    confidence: (0.8 + Math.random() * 0.2).toFixed(2)
                });

                // 从上传列表中移除
                const index = this.uploadingFiles.findIndex(f => f.id === item.id);
                if (index !== -1) {
                    this.uploadingFiles.splice(index, 1);
                }
            }, 1500);
        },
        retryUpload(item) {
            item.status = 'uploading';
            item.progress = 0;
            item.error = null;
            this.simulateUpload(item);
        },
        removeUploadingFile(item) {
            const index = this.uploadingFiles.findIndex(f => f.id === item.id);
            if (index !== -1) {
                this.uploadingFiles.splice(index, 1);
            }
        },
        formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getCategoryName(categoryId) {
            const category = this.evidenceCategories.find(c => c.id === categoryId);
            return category ? category.name : '未知';
        },
        getCategoryStyle(categoryId) {
            const category = this.evidenceCategories.find(c => c.id === categoryId);
            return category ? { backgroundColor: category.color, color: category.textColor } : {};
        },
        reclassifyEvidence(file, newCategoryId) {
            file.category = newCategoryId;
        },
        toggleProcess() {
            this.isProcessRunning = !this.isProcessRunning;
            if (this.isProcessRunning) {
                this.caseData.status = '处理中';
            } else {
                this.caseData.status = '已暂停';
            }
        },
        navigateToEvidenceUpload() {
            router.push('/evidence-upload');
        },
        // 关系洞察方法
        initRelationshipGraph() {
            this.$nextTick(() => {
                const container = this.$refs.relationshipGraph;
                if (!container) return;

                // 清除之前的SVG
                d3.select(container).selectAll('*').remove();

                const width = container.clientWidth;
                const height = 600;

                // 创建SVG
                const svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // 添加缩放功能
                const g = svg.append('g');

                svg.call(d3.zoom()
                    .scaleExtent([0.5, 3])
                    .on('zoom', (event) => {
                        g.attr('transform', event.transform);
                    }));

                // 创建力导向图
                const simulation = d3.forceSimulation(this.relationshipData.nodes)
                    .force('link', d3.forceLink(this.relationshipData.links).id(d => d.id).distance(150))
                    .force('charge', d3.forceManyBody().strength(-400))
                    .force('center', d3.forceCenter(width / 2, height / 2))
                    .force('collision', d3.forceCollide().radius(50));

                // 绘制连线
                const link = g.append('g')
                    .selectAll('line')
                    .data(this.relationshipData.links)
                    .enter()
                    .append('line')
                    .attr('class', 'relationship-link')
                    .attr('stroke', '#999')
                    .attr('stroke-width', d => d.amount ? 3 : 1.5)
                    .attr('stroke-opacity', 0.6);

                // 绘制连线标签
                const linkLabel = g.append('g')
                    .selectAll('text')
                    .data(this.relationshipData.links)
                    .enter()
                    .append('text')
                    .attr('class', 'relationship-link-label')
                    .attr('font-size', '11px')
                    .attr('fill', '#666')
                    .attr('text-anchor', 'middle')
                    .text(d => d.amount ? `${d.relation} ¥${d.amount}` : d.relation);

                // 绘制节点
                const node = g.append('g')
                    .selectAll('g')
                    .data(this.relationshipData.nodes)
                    .enter()
                    .append('g')
                    .attr('class', 'relationship-node')
                    .call(d3.drag()
                        .on('start', (event, d) => {
                            if (!event.active) simulation.alphaTarget(0.3).restart();
                            d.fx = d.x;
                            d.fy = d.y;
                        })
                        .on('drag', (event, d) => {
                            d.fx = event.x;
                            d.fy = event.y;
                        })
                        .on('end', (event, d) => {
                            if (!event.active) simulation.alphaTarget(0);
                            d.fx = null;
                            d.fy = null;
                        }));

                // 添加节点圆圈
                node.append('circle')
                    .attr('r', d => d.type === 'company' ? 30 : 25)
                    .attr('fill', d => {
                        if (d.type === 'company') return d.group === 1 ? '#4f46e5' : d.group === 2 ? '#dc2626' : '#059669';
                        return '#f59e0b';
                    })
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 3)
                    .style('cursor', 'pointer');

                // 添加节点图标
                node.append('text')
                    .attr('class', 'fa')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('fill', '#fff')
                    .attr('font-size', '16px')
                    .attr('font-family', 'FontAwesome')
                    .text(d => d.type === 'company' ? '\uf1ad' : '\uf007');

                // 添加节点标签
                node.append('text')
                    .attr('class', 'relationship-node-label')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '2.5em')
                    .attr('font-size', '13px')
                    .attr('font-weight', '600')
                    .attr('fill', '#1a1a1a')
                    .text(d => d.name);

                // 节点点击事件
                node.on('click', (event, d) => {
                    this.relationshipData.selectedNode = d;
                    // 高亮选中的节点
                    node.selectAll('circle')
                        .attr('stroke-width', n => n.id === d.id ? 5 : 3)
                        .attr('stroke', n => n.id === d.id ? '#fbbf24' : '#fff');
                });

                // 更新位置
                simulation.on('tick', () => {
                    link
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y);

                    linkLabel
                        .attr('x', d => (d.source.x + d.target.x) / 2)
                        .attr('y', d => (d.source.y + d.target.y) / 2);

                    node.attr('transform', d => `translate(${d.x},${d.y})`);
                });
            });
        },
        selectNode(node) {
            this.relationshipData.selectedNode = node;
        }
    },
    template: `
        <div class="case-detail-page">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span @click="goBack" style="cursor: pointer; color: var(--text-secondary);">案件</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span>详情</span>
                    <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                    <span class="current">{{ caseData.id }}</span>
                </div>
                <div class="top-actions">
                    <button class="icon-btn"><i class="fas fa-search"></i></button>
                    <button class="icon-btn"><i class="fas fa-bell"></i></button>
                    <button class="icon-btn" @click="editCase" title="编辑案件"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn"><i class="fas fa-cog"></i></button>
                </div>
            </header>

            <!-- Case Header -->
            <div class="case-header-area">
                <div class="case-title-wrapper">
                    <div>
                        <div class="case-tags" style="margin-bottom: 8px;">
                            <span :class="['tag', 'status-' + (caseData.statusCode || 'active')]">{{ caseData.status }}</span>
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
                    </div>
                </div>
            </div>



            <!-- Level 1 Tabs (Categories) -->
            <div class="category-tabs">
                <div 
                    v-for="category in tabStructure" 
                    :key="category.id"
                    :class="['category-tab', { active: activeCategory === category.id }]"
                    @click="switchCategory(category.id)"
                >
                    <i :class="category.icon" style="margin-right: 8px;"></i>
                    {{ category.name }}
                </div>
            </div>

            <!-- Level 2 Tabs (Sub-items) -->
            <div class="tabs-container" v-if="currentTabs.length > 1">
                <div class="smart-tabs">
                    <div 
                        v-for="tab in currentTabs" 
                        :key="tab.id"
                        :class="['tab-pill', { active: activeTab === tab.id }]"
                        @click="switchTab(tab.id)"
                    >
                        {{ tab.name }}
                    </div>
                </div>
            </div>

            <!-- Content Canvas -->
            <div class="content-canvas">
                <!-- Tab: Basic Info -->
                <div v-if="activeTab === 'basic'" class="tab-pane">
                    <div class="dashboard-grid">
                        <!-- 基本信息卡片 -->
                        <div class="modern-card">
                            <div class="card-header">
                                <div class="card-title">基础信息</div>
                                <button class="icon-btn" style="font-size: 14px;">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </div>
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
                                <span class="value">{{ caseData.status }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">管辖法院/仲裁委</span>
                                <span class="value">{{ caseData.court }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">承办法官</span>
                                <span class="value">{{ caseData.judge || '-' }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">立案日期</span>
                                <span class="value">{{ caseData.filingDate }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">诉讼时效/上诉截止日</span>
                                <span class="value" style="color: #dc2626; font-weight: 500;">{{ caseData.deadline || '-' }}</span>
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

                <!-- Tab: Case Facts -->
                <div v-if="activeTab === 'case-facts'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">案情描述</div>
                            <button class="icon-btn" style="font-size: 14px;">
                                <i class="fas fa-pen"></i>
                            </button>
                        </div>
                        <div class="info-row" style="display: block;">
                            <span class="label" style="marginBottom: 8px;">案情摘要</span>
                            <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.8; font-size: 14px;">
                                2023年3月，原告张某与被告某科技有限公司签订软件开发合同，约定开发费用100万元。项目于2023年9月完成并交付，被告已支付50万元，剩余50万元尾款迟迟未支付。多次催款无果后，原告诉至法院。
                            </p>
                        </div>
                        <div class="info-row" style="display: block; margin-top: 16px;">
                            <span class="label">争议焦点</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    软件是否已实际交付
                                </span>
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    质量验收是否合格
                                </span>
                                <span class="tag" style="background: #e0e7ff; color: #4f46e5; padding: 6px 12px; border-radius: 6px; font-size: 13px;">
                                    违约损失金额
                                   </span>
                            </div>
                        </div>
                        <div class="info-row" style="margin-top: 16px;">
                            <span class="label">客户诉求</span>
                            <span class="value">支付剩余款项50万元 + 违约金8万元 + 利息</span>
                        </div>
                    </div>
                </div>

                <!-- Tab: Stakeholders -->
                <div v-if="activeTab === 'stakeholders'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">当事人信息</div>
                            <button class="icon-btn" style="font-size: 14px;">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="font-weight: 600; font-size: 15px; margin-bottom: 12px; color: #1a1a1a;">
                                <i class="fas fa-user" style="margin-right: 8px; color: #4f46e5;"></i>
                                原告（我方客户）
                            </div>
                            <div class="info-row">
                                <span class="label">姓名/名称</span>
                                <span class="value">张三</span>
                            </div>
                            <div class="info-row">
                                <span class="label">主体类型</span>
                                <span class="value">自然人</span>
                            </div>
                            <div class="info-row">
                                <span class="label">身份证号</span>
                                <span class="value">110101198001011234</span>
                            </div>
                        </div>
                        <div style="border-top: 1px solid #e5e5e5; padding-top: 20px;">
                            <div style="font-weight: 600; font-size: 15px; margin-bottom: 12px; color: #1a1a1a;">
                                <i class="fas fa-building" style="margin-right: 8px; color: #dc2626;"></i>
                                被告
                            </div>
                            <div class="info-row">
                                <span class="label">公司名称</span>
                                <span class="value">某科技有限公司</span>
                            </div>
                            <div class="info-row">
                                <span class="label">主体类型</span>
                                <span class="value">法人企业</span>
                            </div>
                            <div class="info-row">
                                <span class="label">法定代表人</span>
                                <span class="value">李四</span>
                            </div>
                            <div class="info-row">
                                <span class="label">统一信用代码</span>
                                <span class="value">91110000MA01A2B3C4</span>
                            </div>
                            <div class="info-row">
                                <span class="label">对方代理律师</span>
                                <span class="value">王律师（某律所）</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab: Financials -->
                <div v-if="activeTab === 'financials'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">财务信息</div>
                            <button class="icon-btn" style="font-size: 14px;">
                                <i class="fas fa-calculator"></i>
                            </button>
                        </div>
                        <div class="info-row">
                            <span class="label">诉讼标的额</span>
                            <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 16px;">¥580,000</span>
                        </div>
                        <div style="padding: 12px; background: #f5f5f5; border-radius: 6px; margin: 12px 0; font-size: 13px; color: #666;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span>欠款本金</span>
                                <span>¥500,000</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>违约金</span>
                                <span>¥80,000</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <span class="label">律师费报价</span>
                            <span class="value">¥85,000</span>
                        </div>
                        <div class="info-row">
                            <span class="label">预估诉讼费</span>
                            <span class="value">¥11,300（按标的额计算）</span>
                        </div>
                        <div class="info-row">
                            <span class="label">计费时长</span>
                            <span class="value">45.5 小时</span>
                        </div>
                    </div>
                </div>

                <!-- Tab: AI Analysis -->
                <div v-if="activeTab === 'ai-analysis'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header" style="background: #1a1a1a; color: white; margin: -20px; margin-bottom: 20px; padding: 20px; border-radius: 12px 12px 0 0;">
                            <div class="card-title" style="color: white;">
                                <i class="fas fa-brain" style="margin-right: 8px;"></i>
                                AI智能分析
                            </div>
                            <button class="icon-btn" style="font-size: 14px; color: white; border-color: rgba(255,255,255,0.3);">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                        <div class="info-row">
                            <span class="label">胜诉率预测</span>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="flex: 1; height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden;">
                                    <div style="width: 75%; height: 100%; background: #1a1a1a;"></div>
                                </div>
                                <span class="value" style="color: #1a1a1a; font-weight: 600; font-size: 18px;">75%</span>
                            </div>
                        </div>
                        <div class="info-row" style="display: block; margin-top: 16px;">
                            <span class="label">风险点提示</span>
                            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
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
                        <div class="info-row" style="display: block; margin-top: 16px;">
                            <span class="label">AI策略建议</span>
                            <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.8; font-size: 13px; background: #f5f5f5; padding: 12px; border-radius: 6px;">
                                建议重点收集：1）项目交付确认的邮件记录；2）被告方的验收反馈意见；3）双方关于质量问题的沟通记录。同时准备技术专家鉴定，证明软件功能符合合同约定。
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Tab: AI Evidence Analysis -->
                <div v-if="activeTab === 'ai-evidence'" class="tab-pane">
                    <!-- Action Buttons -->
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 20px;">
                        <button class="smart-btn-secondary" @click="exportEvidenceList">
                            <i class="fas fa-download"></i> 导出清单
                        </button>
                        <button class="smart-btn-secondary">
                            <i class="fas fa-sync-alt"></i> 重新分析
                        </button>
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
                                    <th width="30%">建议收集的证据</th>
                                    <th width="15%">重要性评分</th>
                                    <th width="15%">收集状态</th>
                                    <th width="20%">说明</th>
                                    <th width="15%">操作</th>
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
                                    <td>
                                        <button 
                                            v-if="item.status === 'missing'"
                                            class="action-btn-pill success"
                                            @click="toggleStatus(item)"
                                        >
                                            <i class="fas fa-check"></i> 标记已收
                                        </button>
                                        <button 
                                            v-else
                                            class="action-btn-pill warning"
                                            @click="toggleStatus(item)"
                                        >
                                            <i class="fas fa-times"></i> 标记未收
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- AI Recommendations -->
                    <div class="ai-tips-box">
                        <h4 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                            <i class="fas fa-lightbulb" style="margin-right: 8px; color: #999;"></i> AI 建议
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

                <!-- Tab: Relationship Insights -->
                <div v-if="activeTab === 'relationship-graph'" class="tab-pane">
                    <!-- Action Buttons -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                        <button class="smart-btn-secondary" @click="initRelationshipGraph">
                            <i class="fas fa-sync-alt"></i> 刷新图谱
                        </button>
                    </div>
                    
                    <!-- Main Content -->
                    <div>
                        <!-- Graph Container (Full Width) -->
                        <div class="modern-card" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
                            <div style="padding: 20px; border-bottom: 1px solid var(--border-medium);">
                                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">关系图谱</h3>
                                <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--text-secondary);">
                                    <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
                                    点击节点查看详情 · 拖拽节点调整位置 · 滚轮缩放
                                </p>
                            </div>
                            <div ref="relationshipGraph" class="relationship-graph-container" style="height: 600px;" @vue:mounted="initRelationshipGraph"></div>
                        </div>

                        <!-- Bottom Section: Entity Details, Legend and Statistics -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
                            <!-- Entity Details -->
                            <div class="modern-card" v-if="relationshipData.selectedNode">
                                <div class="card-header">
                                    <div class="card-title">
                                        <i :class="relationshipData.selectedNode.type === 'company' ? 'fas fa-building' : 'fas fa-user'" 
                                           style="margin-right: 8px;"></i>
                                        实体详情
                                    </div>
                                </div>
                                <div style="padding: 16px 0;">
                                    <div class="info-row">
                                        <span class="label">名称</span>
                                        <span class="value">{{ relationshipData.selectedNode.name }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">类型</span>
                                        <span class="value">{{ relationshipData.selectedNode.type === 'company' ? '公司' : '个人' }}</span>
                                    </div>
                                    <div class="info-row" v-if="relationshipData.selectedNode.role">
                                        <span class="label">角色</span>
                                        <span class="value">{{ relationshipData.selectedNode.role }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Legend -->
                            <div class="modern-card">
                                <div class="card-header">
                                    <div class="card-title">
                                        <i class="fas fa-list" style="margin-right: 8px;"></i>
                                        图例说明
                                    </div>
                                </div>
                                <div style="padding: 16px 0;">
                                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #4f46e5; margin-right: 12px;"></div>
                                        <span style="font-size: 13px;">原告公司</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #dc2626; margin-right: 12px;"></div>
                                        <span style="font-size: 13px;">被告公司</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #f59e0b; margin-right: 12px;"></div>
                                        <span style="font-size: 13px;">相关人员</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                                        <div style="width: 24px; height: 24px; border-radius: 50%; background: #059669; margin-right: 12px;"></div>
                                        <span style="font-size: 13px;">第三方机构</span>
                                    </div>
                                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
                                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                            <div style="width: 40px; height: 2px; background: #999; margin-right: 12px;"></div>
                                            <span style="font-size: 13px;">关系连线</span>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                            <div style="width: 40px; height: 3px; background: #999; margin-right: 12px;"></div>
                                            <span style="font-size: 13px;">资金往来</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Statistics -->
                            <div class="modern-card">
                                <div class="card-header">
                                    <div class="card-title">
                                        <i class="fas fa-chart-bar" style="margin-right: 8px;"></i>
                                        统计信息
                                    </div>
                                </div>
                                <div style="padding: 16px 0;">
                                    <div class="info-row">
                                        <span class="label">实体总数</span>
                                        <span class="value">{{ relationshipData.nodes.length }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">关系总数</span>
                                        <span class="value">{{ relationshipData.links.length }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">涉及金额</span>
                                        <span class="value">¥900,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <!-- Evidence List Tab -->
                <div v-if="activeTab === 'evidence-list'" class="tab-pane">
                    <!-- Evidence List -->
                    <div class="evidence-list-section">
                        <div class="section-header">
                            <h4 class="section-title">证据列表 ({{ evidenceFiles.length }})</h4>
                            <div class="list-actions">
                                <button class="primary-btn" @click="navigateToEvidenceUpload">
                                    <i class="fas fa-upload"></i> 上传证据
                                </button>
                                <button class="filter-btn"><i class="fas fa-filter"></i> 筛选</button>
                                <button class="filter-btn"><i class="fas fa-sort"></i> 排序</button>
                            </div>
                        </div>
                        
                        <div class="evidence-table-container">
                            <table class="evidence-table">
                                <thead>
                                    <tr>
                                        <th width="5%"><input type="checkbox"></th>
                                        <th width="35%">文件名称</th>
                                        <th width="15%">分类</th>
                                        <th width="12%">大小</th>
                                        <th width="18%">上传时间</th>
                                        <th width="15%">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="file in evidenceFiles" :key="file.id" class="evidence-row">
                                        <td><input type="checkbox"></td>
                                        <td>
                                            <div class="file-cell">
                                                <i :class="['fas', file.type === 'pdf' ? 'fa-file-pdf' : file.type === 'word' ? 'fa-file-word' : 'fa-file-image']" 
                                                   :style="{ color: file.type === 'pdf' ? '#ef4444' : file.type === 'word' ? '#3b82f6' : '#10b981' }"></i>
                                                <span class="file-name-text">{{ file.name }}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="category-tag-sm" :style="getCategoryStyle(file.category)">
                                                {{ getCategoryName(file.category) }}
                                            </span>
                                        </td>
                                        <td class="text-secondary">{{ formatSize(file.size) }}</td>
                                        <td class="text-secondary">{{ file.uploadTime }}</td>
                                        <td>
                                            <div class="table-actions">
                                                <button class="icon-btn-sm" title="预览"><i class="fas fa-eye"></i></button>
                                                <button class="icon-btn-sm" title="下载"><i class="fas fa-download"></i></button>
                                                <button class="icon-btn-sm" title="删除"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Tab: Timeline -->
                <div v-if="activeTab === 'timeline'" class="tab-pane">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-stream" style="margin-right: 8px;"></i>
                                案件时间轴
                            </div>
                            <button class="smart-btn-secondary">
                                <i class="fas fa-plus"></i> 添加事件
                            </button>
                        </div>
                        <div class="timeline" style="padding: 20px 0;">
                            <div class="timeline-item active">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">案件立项</div>
                                    <div class="timeline-date">2023-10-01</div>
                                    <div class="timeline-desc">案件正式受理，开始准备相关材料</div>
                                </div>
                            </div>
                            <div class="timeline-item active">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">证据收集</div>
                                    <div class="timeline-date">2023-10-15 - 进行中</div>
                                    <div class="timeline-desc">收集合同原件、转账记录等关键证据</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">起诉状撰写</div>
                                    <div class="timeline-date">待开始</div>
                                    <div class="timeline-desc">准备起诉状及相关法律文书</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">法院立案</div>
                                    <div class="timeline-date">预计 2023-12-01</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                                        即将上线
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Generated Documents List -->
                    <div class="modern-card" style="margin-top: 24px;">
                        <div class="card-header">
                            <div class="card-title">
                                <i class="fas fa-folder-open" style="margin-right: 8px;"></i>
                                已生成文书
                            </div>
                        </div>
                        <div class="table-container" style="margin-top: 20px;">
                            <table class="modern-table">
                                <thead>
                                    <tr>
                                        <th width="40%">文书名称</th>
                                        <th width="15%">类型</th>
                                        <th width="20%">生成时间</th>
                                        <th width="10%">状态</th>
                                        <th width="15%">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <i class="fas fa-file-alt" style="color: #4f46e5;"></i>
                                                <span style="font-weight: 500;">民事起诉状_张三诉某科技公司.docx</span>
                                            </div>
                                        </td>
                                        <td>起诉状</td>
                                        <td>2023-11-20 14:30</td>
                                        <td>
                                            <span class="status-badge-sm success">已完成</span>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px;">
                                                <button class="icon-btn-sm" title="预览"><i class="fas fa-eye"></i></button>
                                                <button class="icon-btn-sm" title="编辑"><i class="fas fa-edit"></i></button>
                                                <button class="icon-btn-sm" title="下载"><i class="fas fa-download"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Case Form Modal -->
            <CaseForm 
                :visible="showEditModal" 
                :edit-id="caseData.id"
                @close="showEditModal = false"
                @saved="onCaseSaved"
            />
        </div>
    `
};
