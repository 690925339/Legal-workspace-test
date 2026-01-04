/**
 * 格式化工具函数
 */

/**
 * 格式化货币
 * @param {number} value - 金额
 * @param {string} currency - 货币符号
 * @returns {string}
 */
export function formatCurrency(value, currency = '¥') {
  if (value === null || value === undefined) return '-'
  return `${currency}${Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式 ('date' | 'datetime' | 'time')
 * @returns {string}
 */
export function formatDate(date, format = 'date') {
  if (!date) return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const options = {
    date: { year: 'numeric', month: '2-digit', day: '2-digit' },
    datetime: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' }
  }

  return d.toLocaleString('zh-CN', options[format] || options.date)
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

/**
 * 格式化手机号 (隐藏中间4位)
 * @param {string} phone - 手机号
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

