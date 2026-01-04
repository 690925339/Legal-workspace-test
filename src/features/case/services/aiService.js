/**
 * AI 服务 - 支持流式响应
 * 对接后端 AI Service (FastAPI) 的 SSE 端点
 */
import { apiClient } from '@services/api-client'
import { API_ENDPOINTS } from '@shared/constants'

export const aiService = {
  /**
   * 流式生成合同/文书
   * @param {Object} request - 请求参数
   * @param {Object} callbacks - 回调函数
   * @param {Function} callbacks.onChunk - 每个 chunk 的回调
   * @param {Function} callbacks.onComplete - 完成回调
   * @param {Function} callbacks.onError - 错误回调
   * @returns {Function} 取消函数
   */
  async generateDocument(request, { onChunk, onComplete, onError }) {
    let buffer = ''

    const cancel = await apiClient.streamRequest(
      API_ENDPOINTS.AI_GENERATE_DOCUMENT,
      {
        method: 'POST',
        body: JSON.stringify(request)
      },
      (chunk) => {
        // 解析 SSE 格式: "data: {...}\n\n"
        buffer += chunk
        const lines = buffer.split('\n\n')
        buffer = lines.pop() // 保留未完成的部分

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              onComplete?.()
            } else {
              try {
                const parsed = JSON.parse(data)
                onChunk?.(parsed)
              } catch (e) {
                // 纯文本 chunk
                onChunk?.({ text: data })
              }
            }
          }
        }
      },
      onError
    )

    return cancel
  },

  /**
   * AI 风险分析 (流式)
   */
  async analyzeRisk(caseId, { onChunk, onComplete, onError }) {
    return this.generateDocument(
      { type: 'risk_analysis', caseId },
      { onChunk, onComplete, onError }
    )
  },

  /**
   * AI 对话助手 (流式)
   */
  async chat(caseId, message, { onChunk, onComplete, onError }) {
    return this.generateDocument(
      { type: 'chat', caseId, message },
      { onChunk, onComplete, onError }
    )
  },

  /**
   * AI 策略建议 (非流式)
   */
  async getStrategyAdvice(caseId) {
    return apiClient.post(API_ENDPOINTS.AI_ANALYZE_RISK, { caseId })
  }
}

export default aiService

