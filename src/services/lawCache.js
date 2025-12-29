/**
 * 法规缓存服务
 * 提供法规搜索结果的缓存功能，减少API调用
 */

import { getSupabaseClient } from '../config/supabase.js';

export const lawCache = {
    /**
     * 生成查询条件的哈希值
     */
    generateQueryHash(params) {
        const key = JSON.stringify({
            query: params.query,
            effectiveLevel: params.filterCondition?.effectiveLevel || '',
            timeliness: params.filterCondition?.timeliness || '',
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
        return 'law_' + Math.abs(hash).toString(16);
    },

    /**
     * 从缓存获取搜索结果
     */
    async getFromCache(queryHash) {
        try {
            const supabase = getSupabaseClient();

            // 查询搜索缓存
            const { data: cacheEntry, error } = await supabase
                .from('law_search_cache')
                .select('*')
                .eq('query_hash', queryHash)
                .gt('expires_at', new Date().toISOString())
                .maybeSingle();

            if (error || !cacheEntry) {
                return null;
            }

            // 获取缓存的法规详情
            if (cacheEntry.law_ids && cacheEntry.law_ids.length > 0) {
                const { data: laws } = await supabase
                    .from('law_cache')
                    .select('*')
                    .in('law_id', cacheEntry.law_ids);

                return {
                    results: laws || [],
                    totalCount: cacheEntry.total_count,
                    fromCache: true
                };
            }

            return null;
        } catch (error) {
            console.error('Law cache read error:', error);
            return null;
        }
    },

    /**
     * 保存搜索结果到缓存
     */
    async saveToCache(queryHash, params, results) {
        try {
            const supabase = getSupabaseClient();

            // 保存法规详情到 law_cache
            if (results.results && results.results.length > 0) {
                const lawsToInsert = results.results.map(l => ({
                    law_id: l.id || l.docId,
                    law_name: l.name || l.lawName,
                    content: l.content,
                    html_content: l.htmlContent,
                    effective_level: l.effectiveLevel,
                    timeliness: l.timeliness,
                    promulgation_department: l.department,
                    release_date: l.releaseDate,
                    similarity: l.similarity,
                    raw_data: l
                }));

                // 使用 upsert 避免重复
                await supabase
                    .from('law_cache')
                    .upsert(lawsToInsert, {
                        onConflict: 'law_id',
                        ignoreDuplicates: false
                    });
            }

            // 保存搜索缓存
            const lawIds = results.results?.map(l => l.id || l.docId) || [];

            await supabase
                .from('law_search_cache')
                .upsert({
                    query_hash: queryHash,
                    query: params.query,
                    law_ids: lawIds,
                    total_count: results.totalCount,
                    page_number: params.pageNumber || 1,
                    page_size: params.pageSize || 10,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }, {
                    onConflict: 'query_hash'
                });

            console.log('Law cache saved:', queryHash, lawIds.length, 'laws');
        } catch (error) {
            console.error('Law cache save error:', error);
        }
    },

    /**
     * 清除过期缓存
     */
    async cleanExpiredCache() {
        try {
            const supabase = getSupabaseClient();

            await supabase
                .from('law_search_cache')
                .delete()
                .lt('expires_at', new Date().toISOString());

            console.log('Expired law cache cleaned');
        } catch (error) {
            console.error('Law cache cleanup error:', error);
        }
    }
};
