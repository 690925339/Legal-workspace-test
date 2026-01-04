/**
 * 全局错误处理器
 */
export const errorHandler = {
  handle(error, context = '') {
    // 根据错误类型分类处理
    if (error.isApiError) {
      this._handleApiError(error)
    } else if (error.name === 'ValidationError') {
      this._handleValidationError(error)
    } else {
      this._handleUnknownError(error, context)
    }
  },

  _handleApiError(error) {
    const messages = {
      401: '登录已过期，请重新登录',
      403: '您没有权限执行此操作',
      404: '请求的资源不存在',
      500: '服务器错误，请稍后重试'
    }
    // TODO: 集成 Toast 组件显示错误
    console.error('[API Error]', messages[error.status] || error.message)
    
    // 401 自动跳转登录
    if (error.status === 401) {
      window.location.hash = '#/login'
    }
  },

  _handleValidationError(error) {
    console.error('[Validation Error]', error.message)
  },

  _handleUnknownError(error, context) {
    console.error(`[${context || 'Unknown'}] Error:`, error)
  }
}

export default errorHandler

