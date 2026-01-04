/**
 * 全局常量定义
 */

// 案件状态
export const CASE_STATUS = {
  DRAFT: { code: 'draft', text: '草稿', color: '#f3f4f6', textColor: '#4b5563' },
  ACTIVE: { code: 'active', text: '进行中', color: '#dcfce7', textColor: '#15803d' },
  CLOSED: { code: 'closed', text: '已结案', color: '#fee2e2', textColor: '#b91c1c' }
}

// 案件阶段
export const CASE_STAGES = ['咨询', '立案', '一审', '二审', '再审', '执行', '结案']

// 证据类别
export const EVIDENCE_CATEGORIES = [
  { id: 'documentary', name: '书证', color: '#3B82F6' },
  { id: 'physical', name: '物证', color: '#10B981' },
  { id: 'witness', name: '证人证言', color: '#F59E0B' },
  { id: 'audiovisual', name: '视听资料', color: '#8B5CF6' },
  { id: 'electronic', name: '电子数据', color: '#EC4899' },
  { id: 'appraisal', name: '鉴定意见', color: '#06B6D4' },
  { id: 'inspection', name: '勘验笔录', color: '#84CC16' }
]

// API 端点
export const API_ENDPOINTS = {
  // 案件相关
  CASES: '/api/v1/cases',
  CASE_BY_ID: (id) => `/api/v1/cases/${id}`,
  
  // 用户相关
  USERS: '/api/v1/users',
  USER_PROFILE: '/api/v1/users/profile',
  USERS_BATCH: '/api/v1/users/batch',
  
  // AI 相关
  AI_GENERATE_DOCUMENT: '/api/ai/generate-document',
  AI_ANALYZE_RISK: '/api/ai/analyze-risk',
  AI_CHAT: '/api/ai/chat',
  
  // 法律检索
  SEARCH_CASES: '/api/v1/search/cases',
  SEARCH_REGULATIONS: '/api/v1/search/regulations'
}

// 缓存配置
export const CACHE_CONFIG = {
  DEFAULT_EXPIRY: 5 * 60 * 1000, // 5 分钟
  BRAND_SETTINGS_EXPIRY: 10 * 60 * 1000, // 10 分钟
  USER_PROFILE_EXPIRY: 5 * 60 * 1000 // 5 分钟
}

