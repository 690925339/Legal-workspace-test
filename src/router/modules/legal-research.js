/**
 * 法律检索模块路由
 * 注意：这些路由是嵌套在 AppLayout 下的，路径是相对路径
 */
export default [
  {
    path: 'legal-research',
    name: 'LegalResearch',
    component: () => import('@/features/legal-research/views/LegalResearch.vue'),
    meta: { title: '法律检索' }
  },
  {
    path: 'case-search-results',
    name: 'CaseSearchResults',
    component: () => import('@/features/legal-research/views/CaseSearchResults.js'),
    meta: { title: '案例检索结果' }
  },
  {
    path: 'case-detail-view/:id?',
    name: 'CaseDetailView',
    component: () => import('@/features/legal-research/views/CaseDetailView.js'),
    meta: { title: '案例详情' }
  },
  {
    path: 'regulation-search-results',
    name: 'RegulationSearchResults',
    component: () => import('@/features/legal-research/views/RegulationSearchResults.js'),
    meta: { title: '法规检索结果' }
  },
  {
    path: 'contract-review',
    name: 'ContractReview',
    component: () => import('@/features/contract/views/ContractReview.js'),
    meta: { title: '合同审查' }
  },
  {
    path: 'contract-review-result',
    name: 'ContractReviewResult',
    component: () => import('@/features/contract/views/ContractReviewResult.js'),
    meta: { title: '合同审查结果' }
  },
  {
    path: 'doc-generate',
    name: 'DocGenerate',
    component: () => import('@/features/document/views/DocGenerate.js'),
    meta: { title: '文书生成' }
  }
]
