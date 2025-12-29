/**
 * LLM服务 - 大模型关键词提取
 */

import { getSupabaseClient } from '../config/supabase.js';

export const llmService = {
    /**
     * 获取提示词配置
     * @param {string} promptKey - 提示词标识
     */
    async getPromptConfig(promptKey) {
        try {
            const supabase = getSupabaseClient();

            const { data, error } = await supabase
                .from('llm_prompts')
                .select('*')
                .eq('prompt_key', promptKey)
                .eq('is_active', true)
                .single();

            if (error) {
                console.error('Failed to get prompt config:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error in getPromptConfig:', error);
            return null;
        }
    },

    /**
     * 提取关键词
     * @param {string} userQuery - 用户查询
     * @returns {Promise<Object>} - 提取的关键词和参数
     */
    async extractKeywords(userQuery) {
        try {
            // 获取提示词配置
            const config = await this.getPromptConfig('case_search_keywords');
            if (!config) {
                console.warn('Prompt config not found, using fallback');
                return {
                    keywords: [userQuery],
                    caseType: null,
                    laws: [],
                    suggestedFilters: {}
                };
            }

            // 构建用户消息
            const userMessage = config.user_template.replace('{{query}}', userQuery);

            // 解析模型配置
            const modelConfig = typeof config.model_config === 'string'
                ? JSON.parse(config.model_config)
                : config.model_config;

            // 调用DeepSeek API
            const response = await fetch(config.model_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.api_key}`
                },
                body: JSON.stringify({
                    model: config.model_name,
                    messages: [
                        {
                            role: 'system',
                            content: config.system_prompt
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    ...modelConfig
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            const content = result.choices[0].message.content;

            // 解析JSON响应
            const extracted = JSON.parse(content);

            console.log('Extracted keywords:', extracted);

            return {
                keywords: extracted.keywords || [userQuery],
                caseType: extracted.caseType || null,
                laws: extracted.laws || [],
                suggestedFilters: extracted.suggestedFilters || {}
            };
        } catch (error) {
            console.error('Error in extractKeywords:', error);
            // 失败时返回原始查询
            return {
                keywords: [userQuery],
                caseType: null,
                laws: [],
                suggestedFilters: {}
            };
        }
    },

    /**
     * 提取法规检索关键词
     * @param {string} userQuery - 用户查询
     * @returns {Promise<Object>} - 提取的关键词和参数
     */
    async extractLawKeywords(userQuery) {
        try {
            // 获取法规检索提示词配置
            const config = await this.getPromptConfig('law_search_keywords');
            if (!config) {
                console.warn('Law prompt config not found, using fallback');
                return {
                    keywords: [userQuery],
                    effectiveLevel: null,
                    laws: [],
                    suggestedFilters: {}
                };
            }

            // 构建用户消息
            const userMessage = config.user_template.replace('{{query}}', userQuery);

            // 解析模型配置
            const modelConfig = typeof config.model_config === 'string'
                ? JSON.parse(config.model_config)
                : config.model_config;

            // 调用 LLM API
            const response = await fetch(config.model_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.api_key}`
                },
                body: JSON.stringify({
                    model: config.model_name,
                    messages: [
                        {
                            role: 'system',
                            content: config.system_prompt
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    ...modelConfig
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            const content = result.choices[0].message.content;

            // 解析JSON响应
            const extracted = JSON.parse(content);

            console.log('Extracted law keywords:', extracted);

            return {
                keywords: extracted.keywords || [userQuery],
                effectiveLevel: extracted.effectiveLevel || null,
                laws: extracted.laws || [],
                suggestedFilters: extracted.suggestedFilters || {}
            };
        } catch (error) {
            console.error('Error in extractLawKeywords:', error);
            // 失败时返回原始查询
            return {
                keywords: [userQuery],
                effectiveLevel: null,
                laws: [],
                suggestedFilters: {}
            };
        }
    }
};
