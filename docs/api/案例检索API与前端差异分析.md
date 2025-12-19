# 通义法睿案例检索 API 与前端差异分析及优化方案

## 📊 字段对比分析

### 1. 搜索页面筛选条件 (LegalResearch.js)

| 现有筛选条件 | API 支持 | 状态 | 说明 |
|-------------|---------|------|------|
| 关键词 (keywords) | `queryKeywords` | ✅ 支持 | 可直接映射 |
| 法院层级 (courtLevel) | `trialCourt.commonLevel` | ⚠️ 结果返回 | API 过滤需用其他方式 |
| 地域与法院 (region) | `trialCourt.province/city` | ⚠️ 结果返回 | API 过滤需用其他方式 |
| 裁判年份 (yearStart/yearEnd) | `sortKeyAndDirection` | ⚠️ 只支持排序 | 用 trialYearMonthDate 排序 |
| 审判程序 (procedure) | `trialProgram` | ⚠️ 结果返回 | 无显式过滤 |
| 文书类型 (docType) | `documentType` | ⚠️ 结果返回 | 无显式过滤 |

### API 支持的筛选条件（需新增）

| API 字段 | 中文名 | 可选值 | 建议 |
|----------|--------|--------|------|
| `referLevel` | 案例类型 | 其他、参考、指导性 | ✅ **新增** |
| `caseNo` | 案号 | - | ✅ **新增** |
| `caseTitle` | 案例标题 | - | ✅ **新增** |

---

### 2. 结果页数据结构 (CaseSearchResults.js)

#### 现有字段 vs API 返回字段

| 现有字段 | API 字段 | 状态 | 说明 |
|---------|---------|------|------|
| `id` | `caseDomain.caseId` | ⚠️ 路径不同 | 嵌套在 caseDomain 内 |
| `title` | `caseDomain.caseTitle` | ⚠️ 路径不同 | 文书名称 |
| `caseNo` | `caseDomain.caseNo` | ⚠️ 路径不同 | 案号 |
| `court` | `caseDomain.trialCourt.name` | ⚠️ 路径不同 | 法院名称 |
| `date` | `caseDomain.trialDate` | ⚠️ 路径不同 | 审理日期 |
| `type` | `caseDomain.caseType` | ⚠️ 路径不同 | 案件类型 |
| ❌ 无 | `similarity` | ✅ **新增** | 相似度评分 |
| ❌ 无 | `caseDomain.courtThink` | ✅ **新增** | 本院认为 |
| ❌ 无 | `caseDomain.verdict` | ✅ **新增** | 裁判结果 |
| ❌ 无 | `caseDomain.referLevel` | ✅ **新增** | 参考级别 |

---

## 🔧 前端页面优化方案

### 1. 搜索页面 (LegalResearch.js) 优化

#### 修改案例检索筛选条件

```javascript
// 案例检索筛选条件（匹配通义法睿 API）
caseFilters: {
    keywords: '',           // 关键词
    referLevel: '',         // 案例类型：其他/参考/指导性
    caseNo: '',            // 案号
    caseTitle: '',         // 案例标题
    sortBy: 'desc'         // 排序：desc 最新优先
}
```

#### 建议的 UI 改进

```html
<!-- 案例类型（单选按钮组） -->
<div class="smart-form-group">
    <label>案例类型</label>
    <div class="filter-tags">
        <span :class="{ active: caseFilters.referLevel === '' }" 
              @click="caseFilters.referLevel = ''">全部</span>
        <span :class="{ active: caseFilters.referLevel === '指导性' }"
              @click="caseFilters.referLevel = '指导性'">指导性案例</span>
        <span :class="{ active: caseFilters.referLevel === '参考' }"
              @click="caseFilters.referLevel = '参考'">参考案例</span>
        <span :class="{ active: caseFilters.referLevel === '其他' }"
              @click="caseFilters.referLevel = '其他'">普通案例</span>
    </div>
</div>

<!-- 案号/标题搜索 -->
<div class="smart-form-group">
    <label>案号</label>
    <input v-model="caseFilters.caseNo" placeholder="例如：（2024）京01民终123号">
</div>
```

---

### 2. 结果页面 (CaseSearchResults.js) 优化

#### 数据结构映射

```javascript
// 将 API 响应转换为前端数据结构
function mapCaseApiResponse(apiData) {
    return apiData.caseResult.map(item => ({
        id: item.caseDomain.caseId,
        title: item.caseDomain.caseTitle,
        caseNo: item.caseDomain.caseNo,
        court: item.caseDomain.trialCourt?.name || '',
        courtLevel: item.caseDomain.trialCourt?.commonLevel || '',
        province: item.caseDomain.trialCourt?.province || '',
        city: item.caseDomain.trialCourt?.city || '',
        date: item.caseDomain.trialDate,
        caseType: item.caseDomain.caseType,
        documentType: item.caseDomain.documentType,
        referLevel: item.caseDomain.referLevel,
        courtThink: item.caseDomain.courtThink,
        verdict: item.caseDomain.verdict,
        summary: item.caseDomain.caseSummary,
        similarity: parseFloat(item.similarity) || 0
    }));
}
```

#### 新增相似度和案例类型显示

```html
<!-- 在结果卡片中显示 -->
<div class="case-card">
    <div class="case-header">
        <h3>{{ result.title }}</h3>
        <div class="badges">
            <span class="similarity-badge">
                相关度 {{ (result.similarity * 100).toFixed(1) }}%
            </span>
            <span v-if="result.referLevel === '指导性'" class="guide-badge">
                指导性案例
            </span>
        </div>
    </div>
    
    <div class="case-info">
        <span>{{ result.court }}</span>
        <span>{{ result.caseNo }}</span>
        <span>{{ result.date }}</span>
    </div>
    
    <div v-if="result.verdict" class="verdict">
        <strong>裁判结果：</strong>{{ result.verdict }}
    </div>
</div>
```

---

### 3. 分页优化

```javascript
data() {
    return {
        pagination: {
            pageNumber: 1,  // API 用 pageNumber 而不是 pageNo
            pageSize: 10,
            totalCount: 0
        }
    }
},
methods: {
    async searchCases() {
        const response = await this.callApi({
            query: this.searchQuery,
            pageParam: {
                pageNumber: this.pagination.pageNumber,
                pageSize: this.pagination.pageSize
            },
            sortKeyAndDirection: {
                trialYearMonthDate: 'desc'
            },
            filterCondition: {
                caseNo: this.caseFilters.caseNo || undefined,
                caseTitle: this.caseFilters.caseTitle || undefined
            },
            referLevel: this.caseFilters.referLevel || undefined
        });
        
        this.results = this.mapCaseApiResponse(response.data);
        this.pagination.totalCount = response.data.totalCount;
    }
}
```

---

## 📋 优化任务清单

### 高优先级
- [ ] 添加案例类型（referLevel）筛选
- [ ] 修改数据结构映射适配 caseDomain
- [ ] 添加分页组件
- [ ] 添加排序功能（按裁判日期）

### 中优先级
- [ ] 添加相似度显示
- [ ] 添加案号/标题精确搜索
- [ ] 添加指导性案例标识

### 低优先级
- [ ] 添加案例详情页（courtThink, verdict）
- [ ] 添加应用法条显示
- [ ] 添加当事人信息展示

---

## 📌 API 对比总结

| 功能 | 法规检索 API | 案例检索 API |
|------|-------------|-------------|
| 接口路径 | `/search/law/query` | `/search/case/fulltext` |
| 分页参数 | `pageNo` / `pageSize` | `pageNumber` / `pageSize` |
| 效力级别 | ✅ `effectiveLevel` | ❌ 无 |
| 时效性 | ✅ `timeliness` | ❌ 无 |
| 案例类型 | ❌ 无 | ✅ `referLevel` |
| 排序 | ❌ 不支持 | ✅ `sortKeyAndDirection` |
| 相似度 | ✅ `similarity` | ✅ `similarity` |

---

**文档版本**: v1.0  
**更新日期**: 2025-12-10
