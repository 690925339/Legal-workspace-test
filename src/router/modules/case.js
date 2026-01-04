/**
 * 案件管理模块路由
 * 注意：这些路由是嵌套在 AppLayout 下的，路径是相对路径
 */
export default [
  {
    path: 'create',
    name: 'CaseCreate',
    component: () => import('@/features/case/views/CaseForm.vue'),
    meta: { title: '新建案件' }
  },
  {
    path: 'edit/:id',
    name: 'CaseEdit',
    component: () => import('@/features/case/views/CaseForm.vue'),
    meta: { title: '编辑案件' }
  },
  // 案件详情入口 - 重定向到基础信息
  {
    path: 'detail/:id',
    redirect: to => `/detail/${to.params.id}/basic`
  },
  // 案件详情子模块
  {
    path: 'detail/:id/basic',
    name: 'CaseBasicInfo',
    component: () => import('@/features/case/modules/CaseBasicInfo.vue'),
    meta: { title: '案件基础信息' }
  },
  {
    path: 'detail/:id/facts',
    name: 'CaseFacts',
    component: () => import('@/features/case/modules/CaseFacts.vue'),
    meta: { title: '案情事实' }
  },
  {
    path: 'detail/:id/stakeholders',
    name: 'CaseStakeholders',
    component: () => import('@/features/case/modules/CaseStakeholders.vue'),
    meta: { title: '当事人信息' }
  },
  {
    path: 'detail/:id/financials',
    name: 'CaseFinancials',
    component: () => import('@/features/case/modules/CaseFinancials.vue'),
    meta: { title: '财务信息' }
  },
  {
    path: 'detail/:id/evidence',
    name: 'CaseEvidence',
    component: () => import('@/features/case/modules/CaseEvidence.vue'),
    meta: { title: '证据管理' }
  },
  {
    path: 'detail/:id/advanced',
    name: 'CaseAdvanced',
    component: () => import('@/features/case/modules/CaseAdvanced.vue'),
    meta: { title: '高级功能' }
  },
  {
    path: 'evidence-upload',
    name: 'EvidenceUpload',
    component: () => import('@/features/case/views/EvidenceUpload.js'),
    meta: { title: '证据上传' }
  }
]
