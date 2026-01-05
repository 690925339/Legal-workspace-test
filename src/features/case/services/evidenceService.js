/**
 * 证据服务层
 * 支持 Supabase / BFF 双模式切换
 */
import { getSupabaseClient } from '@/config/supabase'
import { apiClient } from '@services/api-client'

const USE_BFF = import.meta.env.VITE_USE_BFF === 'true'

export const evidenceService = {
  /**
   * 获取案件的所有证据
   * @param {string} caseId - 案件 ID
   */
  async getList(caseId) {
    if (USE_BFF) {
      return apiClient.get(`/api/v1/cases/${caseId}/evidences`)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('evidences')
      .select('*')
      .eq('case_id', caseId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * 按分类获取证据
   * @param {string} caseId - 案件 ID
   * @param {string} category - 分类
   */
  async getByCategory(caseId, category) {
    if (USE_BFF) {
      return apiClient.get(`/api/v1/cases/${caseId}/evidences?category=${category}`)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('evidences')
      .select('*')
      .eq('case_id', caseId)
      .eq('category', category)

    if (error) throw error
    return data
  },

  /**
   * 上传证据文件并创建记录
   * @param {string} caseId - 案件 ID
   * @param {File} file - 文件对象
   * @param {object} metadata - 元数据 (name, category)
   */
  async upload(caseId, file, metadata = {}) {
    const supabase = getSupabaseClient()

    // 1. 上传文件到 Storage
    const fileName = `${caseId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('evidences').upload(fileName, file)

    if (uploadError) throw uploadError

    // 2. 获取公开 URL
    const { data: urlData } = supabase.storage.from('evidences').getPublicUrl(fileName)

    // 3. 创建数据库记录
    const { data, error } = await supabase
      .from('evidences')
      .insert({
        case_id: caseId,
        name: metadata.name || file.name,
        category: metadata.category || 'other',
        file_url: urlData.publicUrl,
        file_size: file.size
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 更新证据信息
   * @param {string} id - 证据 ID
   * @param {object} updates - 更新数据
   */
  async update(id, updates) {
    if (USE_BFF) {
      return apiClient.put(`/api/v1/evidences/${id}`, updates)
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('evidences')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * 删除证据
   * @param {string} id - 证据 ID
   */
  async delete(id) {
    if (USE_BFF) {
      return apiClient.delete(`/api/v1/evidences/${id}`)
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.from('evidences').delete().eq('id', id)

    if (error) throw error
    return true
  },

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default evidenceService
