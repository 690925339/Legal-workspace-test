/**
 * 通义法睿 API 服务
 * 案例检索功能封装
 */

import { getSupabaseClient } from '../config/supabase.js';
import { caseCache } from './caseCache.js';

// API 配置 - 从环境变量读取
const FARUI_CONFIG = {
    workspaceId: import.meta.env.VITE_FARUI_WORKSPACE_ID,
    appId: import.meta.env.VITE_FARUI_APP_ID
};

// 验证环境变量
if (!FARUI_CONFIG.workspaceId || !FARUI_CONFIG.appId) {
    console.error('❌ Missing Farui environment variables!');
    console.error('Please check your .env file contains:');
    console.error('  - VITE_FARUI_WORKSPACE_ID');
    console.error('  - VITE_FARUI_APP_ID');
}

/**
 * 案例检索服务
 */
export const faruiCaseService = {
    /**
     * 搜索案例
     * @param {Object} params - 搜索参数
     * @param {string} params.query - 搜索问题
     * @param {number} params.pageNumber - 页码（从1开始）
     * @param {number} params.pageSize - 每页数量
     * @param {Object} params.filterCondition - 筛选条件
     * @param {Object} params.sortKeyAndDirection - 排序条件
     * @param {string} params.referLevel - 案例类型（其他/参考/指导性）
     * @returns {Promise<Object>} 搜索结果
     */
    async searchCases(params) {
        const {
            query,
            pageNumber = 1,
            pageSize = 10,
            filterCondition = {},
            sortKeyAndDirection = { trialYearMonthDate: 'desc' },
            referLevel = null,
            queryKeywords = []
        } = params;


        // 0. 生成缓存Key (包含筛选和排序，保证准确性)
        // 注意：如果你只想要"query"作为key，那就无法区分筛选条件了。
        // Hybrid Strategy要求：筛选变了 -> Key变了 -> 查不到 -> 调API (Correct)
        const paramsForCache = {
            query,
            queryKeywords,
            filterCondition, // 关键：包含筛选
            sortKeyAndDirection, // 关键：包含排序
            referLevel
        };
        const queryHash = caseCache.generateQueryHash(paramsForCache);

        // 1. 尝试从缓存获取分页数据 (Pagination Cache)
        // 逻辑：如果请求的是 非第1页，且缓存里有数据，则直接返回
        if (pageNumber > 1) {
            const userCache = await this.getUserCaseCache(queryHash, pageNumber, pageSize);
            if (userCache && userCache.results.length > 0) {
                console.log('Pagination Cache Hit:', pageNumber);
                return userCache;
            }
        }

        console.log('Cache miss or Page 1, calling API...');

        // 2. 准备API请求
        // 策略:单次API调用获取200条数据,最大化节省API费用,支持前20页秒开
        const BATCH_SIZE = 200;
        // 计算实际请求的页码。由于API是无状态的，我们只能请求 "Page 1, Size 50" 来覆盖 1-5页
        // 或者，如果用户请求 Page 6，我们需要 请求 "Page 2, Size 50" ? 
        // 简化策略：
        // - Page 1: 请求 page=1, size=50. (覆盖 1-50)
        // - Page 2-5: 命中缓存.
        // - Page 6: 请求 page=6 ?? 不，API分页是基于size的。
        //   如果API支持 page=1, size=50. 那么第6页(51-60) 应该是 page=2, size=50 的前10条?
        //   不，page=2, size=50 是 51-100. Correct.

        // 映射逻辑：
        // Target Range: start = (pageNumber-1) * pageSize
        // Batch Page: floor(start / BATCH_SIZE) + 1
        // Batch Start Index: (pageNumber-1) * pageSize % BATCH_SIZE

        const realStart = (pageNumber - 1) * pageSize; // e.g. Page 6 (size 10) -> start 50
        const apiPageNumber = Math.floor(realStart / BATCH_SIZE) + 1; // 50 / 50 + 1 = 2. Correct.

        // 构建请求体
        const requestBody = {
            appId: FARUI_CONFIG.appId,
            workspaceId: FARUI_CONFIG.workspaceId,
            query,
            pageParam: {
                pageNumber: apiPageNumber, // Use Batch Page
                pageSize: BATCH_SIZE       // Force 200
            },
            sortKeyAndDirection
        };

        // 添加可选参数
        if (queryKeywords && queryKeywords.length > 0) {
            requestBody.queryKeywords = queryKeywords;
        }
        if (filterCondition && Object.keys(filterCondition).length > 0) {
            requestBody.filterCondition = filterCondition;
        }
        if (referLevel) {
            requestBody.referLevel = referLevel;
        }

        try {
            // 调用 Supabase Edge Function 代理
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.functions.invoke('farui-search', {
                body: requestBody
            });

            if (error) {
                console.error('Farui API Error:', error);
                throw new Error(error.message || '案例检索失败');
            }

            if (!data.success) {
                throw new Error(data.message || '案例检索失败');
            }

            // 格式化响应数据
            const result = this.formatCaseResults(data.data);

            // 2. 保存到缓存
            await caseCache.saveToCache(queryHash, params, result);

            // 保存搜索历史
            await this.saveSearchHistory({
                query,
                keywords: result.queryKeywords,
                totalResults: result.totalCount,
                params: {
                    pageSize,
                    sortBy: sortKeyAndDirection,
                    filters: filterCondition
                }
            });

            // 保存到用户案例缓存关联表 (存 Full Batch)
            await this.saveUserCaseCache({
                queryHash, // 必须传 Hash
                query,
                caseIds: result.results.map(r => r.id),
                totalCount: result.totalCount,
                keywords: result.queryKeywords,
                params: paramsForCache // 存完整参数
            });

            // 3. 切片返回 (Return Subset)
            // 我们拿到了 50 条 (result.results)，但前端只要 10 条
            // 计算在 Batch 中的偏移量
            // batch index start = (apiPageNumber - 1) * 50
            // user request start = (pageNumber - 1) * 10
            // offset = user request start - batch index start
            // e.g. Page 1 (req 0): 0 - 0 = 0. slice(0, 10)
            // e.g. Page 2 (req 10): 10 - 0 = 10. slice(10, 20)
            // e.g. Page 6 (req 50): batch page 2 (start 50). 50 - 50 = 0. slice(0, 10).

            const batchStart = (apiPageNumber - 1) * BATCH_SIZE;
            const reqStart = (pageNumber - 1) * pageSize;
            const offset = reqStart - batchStart;

            const subsetOps = result.results.slice(offset, offset + pageSize);

            // 构造返回对象
            return {
                ...result,
                results: subsetOps,
                // totalCount 保持不变
            };

            return result;
        } catch (error) {
            console.error('Case search error:', error);
            throw error;
        }
    },

    /**
     * 格式化案例结果
     * @param {Object} data - API 返回的原始数据
     * @returns {Object} 格式化后的数据
     */
    formatCaseResults(data) {
        const { caseResult = [], currentPage, pageSize, query, queryKeywords, totalCount } = data;

        // 转换每个案例的数据格式
        const formattedResults = caseResult.map((item, index) => {
            const caseDomain = item.caseDomain || {};
            const trialCourt = caseDomain.trialCourt || {};

            return {
                id: caseDomain.caseId || `case-${index}`,
                title: caseDomain.caseTitle || '未知案件',
                caseNumber: (caseDomain.caseNo && caseDomain.caseNo !== 'null') ? caseDomain.caseNo : null,
                court: (trialCourt.name && trialCourt.name !== 'null') ? trialCourt.name : null,
                courtProvince: (trialCourt.province && trialCourt.province !== 'null') ? trialCourt.province : null,
                courtCity: (trialCourt.city && trialCourt.city !== 'null') ? trialCourt.city : null,
                courtLevel: (trialCourt.commonLevel && trialCourt.commonLevel !== 'null') ? trialCourt.commonLevel : null,
                date: (caseDomain.trialDate && caseDomain.trialDate !== 'null') ? caseDomain.trialDate : null,
                procedure: this.formatTrialProgram(caseDomain.trialProgram),
                caseType: caseDomain.caseType || '',
                documentType: caseDomain.documentType || '',
                category: this.formatReferLevel(caseDomain.referLevel),
                summary: caseDomain.caseSummary || '',
                verdictContent: caseDomain.courtThink || '',
                judgmentContent: caseDomain.verdict || '',
                courtFindOut: caseDomain.courtFindOut || '',
                appliedLaws: caseDomain.appliedLaws || '',
                litigants: caseDomain.litigants || '',
                disputeFocus: caseDomain.disputeFocus || '',
                keyFacts: caseDomain.keyfacts || '',
                sourceContent: caseDomain.sourceContent || '',
                openCaseCause: caseDomain.openCaseCause || [],
                closeCaseCause: caseDomain.closeCaseCause || [],
                similarity: item.similarity || '0',
                activeTab: 'verdict', // 默认显示"本院认为"
                laws: null // 相关法条需要单独处理
            };
        });

        return {
            results: formattedResults,
            currentPage,
            pageSize,
            query,
            queryKeywords: queryKeywords || [],
            totalCount: totalCount || 0
        };
    },

    /**
     * 格式化审判程序
     */
    formatTrialProgram(trialProgram) {
        if (!trialProgram || trialProgram === 'null' || trialProgram === 'undefined') return null;
        if (typeof trialProgram === 'string') return trialProgram;
        const result = trialProgram.name || trialProgram.level || null;
        return (result === 'null' || result === 'undefined') ? null : result;
    },

    /**
     * 格式化案例类型
     */
    formatReferLevel(referLevel) {
        const levelMap = {
            '指导性': '指导性案例',
            '参考': '参考案例',
            '其他': '普通案例'
        };
        return levelMap[referLevel] || '普通案例';
    },

    /**
     * 获取案例类型过滤选项
     */
    getReferLevelOptions() {
        return [
            { value: '', label: '全部' },
            { value: '指导性', label: '指导性案例' },
            { value: '参考', label: '参考案例' },
            { value: '其他', label: '普通案例' }
        ];
    },

    /**
     * 保存搜索历史
     */
    async saveSearchHistory(searchData) {
        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.warn('User not logged in, skip saving history');
                return;
            }

            const { error } = await supabase
                .from('case_search_history')
                .insert({
                    user_id: user.id,
                    query: searchData.query,
                    keywords: searchData.keywords || [],
                    total_results: searchData.totalResults || 0,
                    search_params: searchData.params || {}
                });

            if (error) {
                console.error('Failed to save search history:', error);
            }
        } catch (error) {
            console.error('Error in saveSearchHistory:', error);
        }
    },

    /**
     * 保存用户案例缓存关联
     */
    // 新增：从缓存获取分页数据
    async getUserCaseCache(queryHash, pageNumber, pageSize) {
        try {
            const supabase = getSupabaseClient();

            // 查 user_case_cache 找 IDs
            const { data: userCache } = await supabase
                .from('user_case_cache')
                .select('case_ids, total_count, keywords')
                .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
                .eq('query', queryHash)
                .maybeSingle();

            if (!userCache || !userCache.case_ids) return null;

            // 计算请求范围
            const reqStart = (pageNumber - 1) * pageSize;
            if (reqStart + pageSize > userCache.case_ids.length) {
                return null; // 超出缓存范围
            }

            const targetIds = userCache.case_ids.slice(reqStart, reqStart + pageSize);

            // 根据 IDs 查 case_cache (使用正确的字段名 case_id)
            const { data: cases } = await supabase
                .from('case_cache')
                .select('*')
                .in('case_id', targetIds);  // ✅ 修复: 使用 case_id 而不是 id

            if (!cases || cases.length === 0) return null;

            // 按 targetIds 顺序重排并格式化数据
            const sortedCases = targetIds
                .map(id => cases.find(c => c.case_id === id))  // ✅ 修复: 使用 case_id
                .filter(Boolean)
                .map(c => ({  // ✅ 新增: 格式化为前端需要的数据结构
                    id: c.case_id,
                    title: c.case_title,
                    caseNumber: c.case_no,
                    court: c.court_name,
                    courtProvince: c.court_province,
                    courtCity: c.court_city,
                    courtLevel: c.court_level,
                    date: c.trial_date,
                    procedure: c.trial_program,
                    caseType: c.case_type,
                    documentType: c.document_type,
                    category: c.refer_level || '普通案例',
                    summary: c.case_summary,
                    verdictContent: c.court_think,
                    judgmentContent: c.verdict,
                    courtFindOut: c.court_find_out,
                    appliedLaws: c.applied_laws,
                    litigants: c.litigants,
                    disputeFocus: c.dispute_focus,
                    keyFacts: c.key_facts,
                    sourceContent: c.source_content,
                    similarity: c.similarity || '0',
                    activeTab: 'verdict',
                    laws: null
                }));

            return {
                results: sortedCases,
                totalCount: userCache.total_count,
                queryKeywords: userCache.keywords
            };

        } catch (error) {
            console.error('Error in getUserCaseCache:', error);
            return null;
        }
    },

    /**
     * 保存用户案例缓存关联
     */
    async saveUserCaseCache({ queryHash, query, caseIds, totalCount, keywords, params }) {
        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // 注意：这里我们得决定用什么作为 Unique Key。
            // 如果用 queryHash，那不同 Page 的 Batch 会互相覆盖吗？
            // 既然我们要支持 pagination cache，最好只存 Page 1 的 Batch (前50条)。
            // 后面 Page 6 的 Batch 覆盖 Page 1 也没关系 (LRU ish)，或者不存。
            // 这里的逻辑是：upsert.

            const cacheData = {
                user_id: user.id,
                query: queryHash || query, // 优先用 Hash 作为 Key
                case_ids: caseIds,
                total_count: totalCount,
                keywords: keywords,
                created_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('user_case_cache')
                .upsert(cacheData, {
                    onConflict: 'user_id,query',
                    ignoreDuplicates: false
                });

            if (error) console.error('Failed to save user case cache:', error);
        } catch (error) {
            console.error('Error in saveUserCaseCache:', error);
        }
    },

    /**
     * 获取搜索历史
     */
    /**
     * 获取搜索历史（带本地缓存）
     */
    async getSearchHistory(limit = 10) {
        // 1. 获取当前用户ID
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('User not logged in');
            return [];
        }

        // 使用用户ID作为缓存key的一部分,避免跨用户数据泄露
        const cacheKey = `search_history_cache_${user.id}`;

        // 2. 尝试读取本地缓存（实现秒开）
        try {
            const stored = localStorage.getItem(cacheKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.data && parsed.data.length > 0) {
                    // 立即返回缓存数据
                    // 注意：这里我们立即返回，但同时也触发下面的网络请求去更新缓存
                    // 为了简化调用方逻辑，我们这里无法做到"返回缓存->再异步更新UI"的双重回调
                    // 所以策略是：优先返回缓存。如果是首次加载或缓存为空，则等待网络。
                    // 并在后台静默更新缓存，供*下次*使用。

                    // 触发后台更新
                    this._fetchAndCacheHistory(limit, user.id).catch(e => console.warn('Background history fetch failed', e));

                    return parsed.data;
                }
            }
        } catch (e) {
            console.warn('Failed to read local history cache:', e);
        }

        // 3. 如果无缓存，则等待网络请求
        return await this._fetchAndCacheHistory(limit, user.id);
    },

    // 内部方法：获取并缓存历史
    async _fetchAndCacheHistory(limit, userId) {
        try {
            const supabase = getSupabaseClient();

            // 如果没有传入userId,重新获取
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    console.warn('User not logged in, cannot fetch history');
                    return [];
                }
                userId = user.id;
            }

            // 查询当前用户的搜索历史
            const { data, error } = await supabase
                .from('case_search_history')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Failed to fetch search history:', error);
                return [];
            }

            // 更新缓存 - 使用用户特定的key
            if (data) {
                try {
                    const cacheKey = `search_history_cache_${userId}`;
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: data,
                        timestamp: Date.now()
                    }));
                } catch (e) { }
            }

            return data || [];
        } catch (error) {
            console.error('Error in getSearchHistory:', error);
            return [];
        }
    },

    /**
     * 获取搜索推荐列表
     */
    async getSearchSuggestions() {
        try {
            const supabase = getSupabaseClient();

            // 尝试从 search_suggestions 表获取
            const { data, error } = await supabase
                .from('search_suggestions')
                .select('content')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(50); // 获取最新的50条作为池子

            if (error || !data || data.length === 0) {
                // 如果表不存在或无数据，返回空数组，前端会使用默认兜底数据
                return [];
            }

            return data.map(item => item.content);
        } catch (error) {
            console.error('Error in getSearchSuggestions:', error);
            return [];
        }
    },

    /**
     * 删除搜索历史记录
     */
    /**
     * 删除搜索历史记录（级联删除user_case_cache和case_cache）
     */
    async deleteSearchHistory(historyId, query) {
        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.warn('User not logged in, skip deletion');
                return false;
            }

            // 0. 乐观更新：立即从本地缓存移除
            try {
                const cacheKey = `search_history_cache_${user.id}`;  // 使用用户特定的key
                const stored = localStorage.getItem(cacheKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    let currentCache = parsed.data || [];
                    // 移除目标ID
                    const newCache = currentCache.filter(item => item.id !== historyId);

                    if (newCache.length !== currentCache.length) {
                        localStorage.setItem(cacheKey, JSON.stringify({
                            data: newCache,
                            timestamp: Date.now()
                        }));
                    }
                }
            } catch (e) {
                console.warn('Failed to update local history cache on delete:', e);
            }

            // 1. 如果有查询词，先根据user_id和query找到关联的case_ids
            if (query) {
                const { data: userCache } = await supabase
                    .from('user_case_cache')
                    .select('case_ids')
                    .eq('user_id', user.id)
                    .eq('query', query)
                    .single();

                // 2. 删除user_case_cache记录
                await supabase
                    .from('user_case_cache')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('query', query);

                // 3. 如果找到了case_ids，则删除case_cache中的对应记录
                if (userCache && userCache.case_ids && userCache.case_ids.length > 0) {
                    const { error: deleteCaseError, count } = await supabase
                        .from('case_cache')
                        .delete()
                        .in('case_id', userCache.case_ids);

                    if (deleteCaseError) {
                        console.error('Failed to delete legacy case cache:', deleteCaseError);
                    } else {
                        console.log(`Deleted ${count} dependent cases from case_cache`);
                    }
                }
            }

            // 4. 最后删除历史记录条目
            const { error } = await supabase
                .from('case_search_history')
                .delete()
                .eq('id', historyId);

            if (error) {
                console.error('Failed to delete search history:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error in deleteSearchHistory:', error);
            return false;
        }
    },

    /**
     * 清空所有搜索历史
     */
    async clearAllSearchHistory() {
        try {
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return false;

            const { error } = await supabase
                .from('case_search_history')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                console.error('Failed to clear search history:', error);
                return false;
            }

            // 清除本地缓存 - 使用用户特定的key
            try {
                const cacheKey = `search_history_cache_${user.id}`;
                localStorage.removeItem(cacheKey);
            } catch (e) { }

            return true;
        } catch (error) {
            console.error('Error in clearAllSearchHistory:', error);
            return false;
        }
    }
};

/**
 * 法规检索服务
 */
import { lawCache } from './lawCache.js';

export const faruiLawService = {
    /**
     * 搜索法规
     * @param {Object} params - 搜索参数
     * @param {string} params.query - 搜索问题
     * @param {number} params.pageNumber - 页码（从1开始）
     * @param {number} params.pageSize - 每页数量
     * @param {Object} params.filterCondition - 筛选条件
     * @returns {Promise<Object>} 搜索结果
     */
    async searchLaws(params) {
        const {
            query,
            pageNumber = 1,
            pageSize = 50,
            filterCondition = {}
        } = params;

        // 生成缓存Key
        const queryHash = lawCache.generateQueryHash({
            query,
            filterCondition,
            pageNumber,
            pageSize
        });

        // 尝试从缓存获取
        const cached = await lawCache.getFromCache(queryHash);
        if (cached) {
            console.log('Law cache hit:', queryHash);
            return {
                ...cached,
                results: this.formatLawResults({ list: cached.results.map(l => l.raw_data || l) }).results
            };
        }

        console.log('Law cache miss, calling API...');

        // 准备 API 请求
        const supabase = getSupabaseClient();

        const requestBody = {
            workspaceId: FARUI_CONFIG.workspaceId,
            appId: FARUI_CONFIG.appId,
            query: query,
            pageParam: {
                pageNo: pageNumber,
                pageSize: pageSize
            }
        };

        // 添加筛选条件
        if (Object.keys(filterCondition).length > 0) {
            requestBody.filterCondition = {};

            if (filterCondition.effectiveLevel && filterCondition.effectiveLevel.length > 0) {
                requestBody.filterCondition.effectiveLevel = Array.isArray(filterCondition.effectiveLevel)
                    ? filterCondition.effectiveLevel
                    : [filterCondition.effectiveLevel];
            }

            if (filterCondition.timeliness && filterCondition.timeliness.length > 0) {
                requestBody.filterCondition.timeliness = Array.isArray(filterCondition.timeliness)
                    ? filterCondition.timeliness
                    : [filterCondition.timeliness];
            }

            if (filterCondition.promulgationDepartment) {
                requestBody.filterCondition.promulgationDepartment = filterCondition.promulgationDepartment;
            }
        }

        // 调用 Edge Function
        const { data, error } = await supabase.functions.invoke('farui-law-search', {
            body: requestBody
        });

        if (error) {
            console.error('Farui Law API Error:', error);
            throw new Error(error.message || '法规检索失败');
        }

        // 调试日志 - 查看 API 返回的数据结构
        console.log('Farui Law API Response:', JSON.stringify(data, null, 2));

        if (!data.success && data.message) {
            throw new Error(data.message);
        }

        // 格式化响应数据 - 尝试多种数据路径
        const responseData = data.data || data;
        const result = this.formatLawResults(responseData);

        console.log('Formatted law results:', result.results.length, 'laws');

        // 保存到缓存
        await lawCache.saveToCache(queryHash, params, result);

        return result;
    },

    /**
     * 格式化法规结果
     */
    formatLawResults(data) {
        // API 返回的是 lawResult 而不是 list
        const lawList = data?.lawResult || data?.list || [];

        if (!lawList || lawList.length === 0) {
            return {
                results: [],
                totalCount: 0,
                queryKeywords: data?.queryKeywords || []
            };
        }

        const results = lawList.map(item => ({
            id: item.docId || item.lawId,
            name: item.lawName,
            title: item.lawName,
            content: item.content || item.lawSourceContent || '',
            htmlContent: item.htmlContent || '',
            // 字段可能在顶层或在 lawResultAttributeVo 中
            effectiveLevel: item.potencyLevel || item.lawResultAttributeVo?.effectiveLevel || '',
            timeliness: item.timeliness || item.lawResultAttributeVo?.timeliness || '',
            department: item.lawDomain?.level1Name || item.lawResultAttributeVo?.promulgationDepartment || '',
            releaseDate: item.implementYearMonthDate || item.lawResultAttributeVo?.releaseDate || '',
            similarity: item.similarity,
            highlightMap: item.highlightMap || {},
            // 保留原始数据用于缓存
            _raw: item
        }));

        return {
            results,
            totalCount: data.totalCount || results.length,
            queryKeywords: data.queryKeywords || [],
            pageSize: data.pageSize,
            pageTotalCount: data.pageTotalCount
        };
    }
};

export default faruiCaseService;
