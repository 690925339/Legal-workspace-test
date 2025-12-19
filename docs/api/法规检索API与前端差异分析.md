# 通义法睿 API 与现有前端功能差异分析及优化方案

## 📊 字段对比分析

### 1. 搜索页面筛选条件 (LegalResearch.js)

| 现有筛选条件 | API 支持 | 状态 | 说明 |
|-------------|---------|------|------|
| 关键词 (keywords) | `queryKeywords` | ✅ 支持 | 可直接映射 |
| 法院层级 (courtLevel) | ❌ 不支持 | ⛔ 移除 | 仅适用于案例检索，法规无此字段 |
| 地域与法院 (region) | ❌ 不支持 | ⛔ 移除 | 仅适用于案例检索 |
| 裁判年份 (yearStart/yearEnd) | `releaseYear` | ⚠️ 需调整 | API 用 releaseYear 列表，非范围 |
| 审判程序 (procedure) | ❌ 不支持 | ⛔ 移除 | 仅适用于案例检索 |
| 文书类型 (docType) | ❌ 不支持 | ⛔ 移除 | 仅适用于案例检索 |

### 需要新增的筛选条件（API 支持）

| API 字段 | 中文名 | 可选值 | 建议 |
|----------|--------|--------|------|
| `effectiveLevel` | 效力级别 | 法律、司法解释、行政法规、地方性法规、部门规章 | ✅ 新增 |
| `promulgationDepartment` | 颁布部门 | 全国人大常委会、国务院等 | ✅ 新增 |
| `timeliness` | 时效性 | 现行有效、已废止/失效、部分修改 | ✅ 已有（结果页） |
| `releaseYear` | 发布年份 | 年份列表 | ⚠️ 调整逻辑 |

---

### 2. 结果页数据结构 (RegulationSearchResults.js)

#### 现有字段 vs API 返回字段

| 现有字段 | API 字段 | 状态 | 说明 |
|---------|---------|------|------|
| `id` | `docId` | ⚠️ 重命名 | ID 字段名不同 |
| `title` | `lawName` | ⚠️ 重命名 | 法规名称 |
| `category` | `lawResultAttributeVo.effectiveLevel` | ⚠️ 重命名 | 效力级别 |
| `publisher` | `lawResultAttributeVo.promulgationDepartment` | ⚠️ 重命名 | 颁布部门 |
| `publisherCode` | ❌ 无 | ⛔ 移除 | API 不返回此字段 |
| `publishDate` | `lawResultAttributeVo.releaseDate` | ⚠️ 重命名 | 发布日期 |
| `effectiveDate` | ❌ 无 | ⛔ 移除 | API 不返回此字段 |
| `status` | `lawResultAttributeVo.timeliness` | ⚠️ 重命名 | 时效性 |
| `content` | `content` | ✅ 保持 | 法规内容 |
| ❌ 无 | `similarity` | ✅ 新增 | 相似度评分 |
| ❌ 无 | `htmlContent` | ✅ 新增 | HTML 格式内容 |
| ❌ 无 | `highlightMap` | ✅ 新增 | 高亮关键词 |

---

## 🔧 前端页面优化方案

### 1. 搜索页面 (LegalResearch.js) 优化

#### 修改筛选条件（法规检索专用）

```javascript
// 新增法规检索专用筛选条件
regulationFilters: {
    queryKeywords: [],      // 关键词列表
    effectiveLevel: [],     // 效力级别（多选）
    promulgationDepartment: '', // 颁布部门
    timeliness: [],         // 时效性（多选）
    releaseYear: []         // 发布年份（多选）
}
```

#### 建议的 UI 改进

```html
<!-- 法规检索专用筛选面板 -->
<div v-if="activeTab === 'regulations' && showFilters">
    <!-- 效力级别（多选标签） -->
    <div class="smart-form-group">
        <label>效力级别</label>
        <div class="filter-tags">
            <span v-for="level in effectiveLevels" 
                  :class="{ active: regulationFilters.effectiveLevel.includes(level) }"
                  @click="toggleEffectiveLevel(level)">
                {{ level }}
            </span>
        </div>
    </div>
    
    <!-- 时效性（多选标签） -->
    <div class="smart-form-group">
        <label>时效性</label>
        <div class="filter-tags">
            <span v-for="status in timelinessOptions"
                  :class="{ active: regulationFilters.timeliness.includes(status) }"
                  @click="toggleTimeliness(status)">
                {{ status }}
            </span>
        </div>
    </div>
    
    <!-- 发布年份（多选下拉） -->
    <div class="smart-form-group">
        <label>发布年份</label>
        <select multiple v-model="regulationFilters.releaseYear">
            <option v-for="year in years" :value="year">{{ year }}</option>
        </select>
    </div>
</div>
```

---

### 2. 结果页面 (RegulationSearchResults.js) 优化

#### 数据结构映射

```javascript
// 将 API 响应转换为前端数据结构
function mapApiResponse(apiData) {
    return apiData.list.map(item => ({
        id: item.docId,
        title: item.lawName,
        category: item.lawResultAttributeVo?.effectiveLevel || '法律',
        publisher: item.lawResultAttributeVo?.promulgationDepartment || '',
        publishDate: item.lawResultAttributeVo?.releaseDate || '',
        status: item.lawResultAttributeVo?.timeliness || '现行有效',
        content: item.content,
        htmlContent: item.htmlContent,
        similarity: parseFloat(item.similarity) || 0,
        highlights: item.highlightMap || {}
    }));
}
```

#### 新增相似度显示

```html
<!-- 在结果卡片中显示相似度 -->
<div style="display: flex; align-items: center; gap: 8px;">
    <span class="similarity-badge">
        相关度：{{ (result.similarity * 100).toFixed(0) }}%
    </span>
</div>
```

#### 使用高亮内容

```html
<!-- 使用 API 返回的 HTML 高亮内容 -->
<p v-if="result.htmlContent" 
   v-html="result.htmlContent" 
   class="regulation-content">
</p>
<p v-else>{{ result.content }}</p>
```

---

### 3. 分页优化

#### 当前状态
- 前端无分页功能

#### 优化方案

```javascript
data() {
    return {
        // 分页数据
        pagination: {
            pageNo: 1,
            pageSize: 10,
            totalCount: 0,
            pageTotalCount: 0
        }
    }
},
methods: {
    async search() {
        const response = await this.callApi({
            query: this.searchQuery,
            pageParam: {
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize
            },
            filterCondition: this.buildFilterCondition()
        });
        
        this.results = this.mapApiResponse(response.data);
        this.pagination.totalCount = response.data.totalCount;
        this.pagination.pageTotalCount = response.data.pageTotalCount;
    },
    
    changePage(pageNo) {
        this.pagination.pageNo = pageNo;
        this.search();
    }
}
```

---

## 📋 优化任务清单

### 高优先级

- [ ] 修改法规检索筛选条件，使用 API 支持的字段
- [ ] 调整结果页数据结构映射
- [ ] 添加分页组件和功能
- [ ] 使用 API 返回的高亮内容

### 中优先级

- [ ] 新增相似度显示
- [ ] 优化筛选条件 UI（使用标签多选）
- [ ] 区分案例检索和法规检索的筛选面板

### 低优先级

- [ ] 添加搜索历史持久化
- [ ] 添加关键词推荐功能
- [ ] 添加法规收藏功能

---

## 🚀 实施建议

### 第一阶段：适配 API（1-2天）
1. 创建 API 服务层封装
2. 修改数据结构映射
3. 实现分页功能

### 第二阶段：优化筛选（1天）
1. 分离案例/法规筛选面板
2. 实现法规检索专用筛选条件
3. 添加效力级别、时效性多选

### 第三阶段：增强体验（1天）
1. 使用高亮内容展示
2. 添加相似度显示
3. 优化加载状态和错误处理

---

**文档版本**: v1.0  
**更新日期**: 2025-12-10
