/**
 * 案例缓存服务
 * 提供案例搜索结果的缓存功能，减少API调用
 */

import { getSupabaseClient } from '../config/supabase.js';

export const caseCache = {
    /**
     * 生成查询条件的哈希值
     */
    generateQueryHash(params) {
        const key = JSON.stringify({
            query: params.query,
            referLevel: params.referLevel || '',
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10
        });
        // 简单哈希
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            const char = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'q_' + Math.abs(hash).toString(16);
    },

    /**
     * 从缓存获取搜索结果
     */
    async getFromCache(queryHash) {
        try {
            const supabase = getSupabaseClient();

            // 查询搜索缓存
            const { data: cacheEntry, error } = await supabase
                .from('search_cache')
                .select('*')
                .eq('query_hash', queryHash)
                .gt('expires_at', new Date().toISOString())
                .single();

            if (error || !cacheEntry) {
                return null;
            }

            // 获取缓存的案例详情
            if (cacheEntry.case_ids && cacheEntry.case_ids.length > 0) {
                const { data: cases } = await supabase
                    .from('case_cache')
                    .select('*')
                    .in('case_id', cacheEntry.case_ids);

                return {
                    results: cases || [],
                    totalCount: cacheEntry.total_count,
                    fromCache: true
                };
            }

            return null;
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    },

    /**
     * 保存搜索结果到缓存
     */
    async saveToCache(queryHash, params, results) {
        try {
            const supabase = getSupabaseClient();

            // 保存案例详情到 case_cache
            if (results.results && results.results.length > 0) {
                const casesToInsert = results.results.map(c => ({
                    case_id: c.id || c.caseId,
                    case_title: c.title || c.caseTitle,
                    case_no: c.caseNumber || c.caseNo,
                    court_name: c.court,
                    trial_date: c.date,
                    trial_program: c.procedure,
                    case_type: c.caseType,
                    refer_level: c.referLevel || params.referLevel,
                    court_think: c.verdictContent || c.courtThink,
                    verdict: c.judgmentContent || c.verdict,
                    related_laws: c.relatedLaws,
                    raw_data: c
                }));

                // 使用 upsert 避免重复
                await supabase
                    .from('case_cache')
                    .upsert(casesToInsert, {
                        onConflict: 'case_id',
                        ignoreDuplicates: false
                    });
            }

            // 保存搜索缓存
            const caseIds = results.results?.map(c => c.id || c.caseId) || [];

            await supabase
                .from('search_cache')
                .upsert({
                    query_hash: queryHash,
                    query: params.query,
                    refer_level: params.referLevel || null,
                    case_ids: caseIds,
                    total_count: results.totalCount,
                    page_number: params.pageNumber || 1,
                    page_size: params.pageSize || 10,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }, {
                    onConflict: 'query_hash'
                });

            console.log('Cache saved:', queryHash, caseIds.length, 'cases');
        } catch (error) {
            console.error('Cache save error:', error);
        }
    },

    /**
     * 清除过期缓存
     */
    async cleanExpiredCache() {
        try {
            const supabase = getSupabaseClient();

            await supabase
                .from('search_cache')
                .delete()
                .lt('expires_at', new Date().toISOString());

            console.log('Expired cache cleaned');
        } catch (error) {
            console.error('Cache cleanup error:', error);
        }
    },

    /**
     * 按案例类型获取缓存的案例
     */
    async getCachedCasesByType(referLevel, limit = 50) {
        try {
            const supabase = getSupabaseClient();

            let query = supabase
                .from('case_cache')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (referLevel) {
                query = query.eq('refer_level', referLevel);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Get cached cases error:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Get cached cases error:', error);
            return [];
        }
    },

    /**
     * 搜索并按字段排序（从case_cache表）
     * @param {object} params - 搜索参数
     * @param {string} sortField - 排序字段 ('trial_date', 'created_at')
     * @param {boolean} ascending - 是否升序
     */
    async searchWithSort(caseIds, sortField = 'trial_date', ascending = false) {
        try {
            const supabase = getSupabaseClient();

            if (!caseIds || caseIds.length === 0) {
                return [];
            }

            const { data, error } = await supabase
                .from('case_cache')
                .select('*')
                .in('case_id', caseIds)
                .order(sortField, { ascending, nullsFirst: false });

            if (error) {
                console.error('Sort query error:', error);
                return [];
            }

            // 转换为前端格式
            return (data || []).map(c => ({
                id: c.case_id,
                title: c.case_title,
                caseNumber: c.case_no,
                court: c.court_name,
                date: c.trial_date,
                procedure: c.trial_program,
                category: c.refer_level || '普通案例',
                verdictContent: c.court_think,
                judgmentContent: c.verdict,
                relatedLaws: c.related_laws,
                activeTab: 'verdict'
            }));
        } catch (error) {
            console.error('searchWithSort error:', error);
            return [];
        }
    }
};
