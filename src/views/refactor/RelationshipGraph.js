export default {
    name: 'RelationshipGraph',
    data() {
        return {
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
    methods: {
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
        <div>
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
    `,
    mounted() {
        this.initRelationshipGraph();
    }
};
