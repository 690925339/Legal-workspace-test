# 通义法睿 - 法规检索 API 对接文档

## 📋 概述

通义法睿法规检索 API 提供智能法规搜索功能，可根据用户输入的问题或关键词检索相关法律法规。

---

## 🔐 认证授权

### 所需凭证
- **AccessKey ID**: 阿里云 AccessKey
- **AccessKey Secret**: 阿里云 Secret
- **WorkspaceId**: 百炼平台工作空间 ID

### 签名方式
使用阿里云 SDK 进行请求签名（AK/SK 签名）

---

## 📡 接口信息

### 请求地址
```
POST https://farui.cn-beijing.aliyuncs.com/{workspaceId}/farui/search/law/query
```

### 参数说明
- `{workspaceId}`: 阿里云百炼平台工作空间 ID，例如 `your-workspace-id`

---

## 📥 请求参数

### 请求体（JSON）

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `appId` | string | 否 | 应用 ID | `"farui"` |
| `workspaceId` | string | 否 | 工作空间 ID | `"your-workspace-id"` |
| `query` | string | **是** | 搜索问题/关键词 | `"劳动法"`, `"抢劫"` |
| `queryKeywords` | List\<string\> | 否 | 关键词列表 | `["盗窃", "抢劫"]` |
| `pageParam` | object | **是** | 分页参数 | 见下表 |
| `filterCondition` | object | 否 | 筛选条件 | 见下表 |

### 分页参数 (pageParam)

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `pageNo` | int | 是 | 页码（从1开始） | `1` |
| `pageSize` | int | 是 | 每页数量 | `10` |

### 筛选条件 (filterCondition)

| 参数名 | 类型 | 说明 | 可选值 |
|--------|------|------|--------|
| `effectiveLevel` | List\<string\> | 效力级别 | `"法律"`, `"司法解释"`, `"行政法规"`, `"地方性法规"`, `"部门规章"` |
| `promulgationDepartment` | string | 颁布部门 | `"全国人大常委会"`, `"国务院"` 等 |
| `timeliness` | List\<string\> | 时效性 | `"现行有效"`, `"已废止/失效"`, `"部分修改"` |
| `releaseYear` | List\<string\> | 发布年份 | `["2023", "2024"]` |

---

## 📤 响应格式

### 响应结构

```json
{
  "requestId": "string",
  "statusCode": 200,
  "httpStatusCode": 200,
  "success": true,
  "data": {
    "list": [...],
    "pageSize": 10,
    "pageTotalCount": 20,
    "query": "抢劫",
    "queryKeywords": ["抢劫"],
    "sortKeyAndDirection": {},
    "totalCount": 198
  }
}
```

### data 字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `list` | List | 法规结果列表 |
| `pageSize` | int | 每页大小 |
| `pageTotalCount` | int | 总页数 |
| `query` | string | 查询词 |
| `queryKeywords` | List | 查询关键词 |
| `sortKeyAndDirection` | object | 排序字段和方向 |
| `totalCount` | int | 总结果数 |

### 法规对象结构 (list 中的每个元素)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `lawName` | string | 法规名称 |
| `content` | string | 法规内容（摘要） |
| `htmlContent` | string | HTML 格式内容 |
| `docId` | string | 文档 ID |
| `similarity` | string | 相似度评分 |
| `highlightMap` | object | 高亮关键词信息 |
| `lawResultAttributeVo` | object | 法规属性 |
| `lawResultReferInfoVo` | object | 引用信息 |

### 法规属性 (lawResultAttributeVo)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `effectiveLevel` | string | 效力级别 |
| `timeliness` | string | 时效性 |
| `promulgationDepartment` | string | 颁布部门 |
| `releaseDate` | string | 发布日期 |

---

## 📝 请求示例

### JavaScript 示例

```javascript
// 使用阿里云 SDK (需要安装 @alicloud/farui20240628)
import Farui20240628, * as $Farui20240628 from '@alicloud/farui20240628';
import * as $OpenApi from '@alicloud/openapi-client';

// 初始化客户端
const config = new $OpenApi.Config({
    accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    endpoint: 'farui.cn-beijing.aliyuncs.com'
});
const client = new Farui20240628.default(config);

// 构造请求
const request = new $Farui20240628.RunSearchLawQueryRequest({
    appId: 'farui',
    query: '劳动合同解除',
    pageParam: {
        pageNo: 1,
        pageSize: 10
    },
    filterCondition: {
        effectiveLevel: ['法律', '司法解释'],
        timeliness: ['现行有效']
    }
});

// 调用接口
const response = await client.runSearchLawQuery('your-workspace-id', request);
console.log(response.body.data);
```

### Python 示例

```python
import os
from alibabacloud_farui20240628.client import Client as Farui20240628Client
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_farui20240628 import models as farui_models

# 初始化客户端
config = open_api_models.Config(
    access_key_id=os.environ.get('ALIBABA_CLOUD_ACCESS_KEY_ID'),
    access_key_secret=os.environ.get('ALIBABA_CLOUD_ACCESS_KEY_SECRET'),
    endpoint='farui.cn-beijing.aliyuncs.com'
)
client = Farui20240628Client(config)

# 构造请求
request = farui_models.RunSearchLawQueryRequest(
    app_id='farui',
    query='劳动合同解除',
    page_param=farui_models.RunSearchLawQueryRequestPageParam(
        page_no=1,
        page_size=10
    ),
    filter_condition=farui_models.RunSearchLawQueryRequestFilterCondition(
        effective_level=['法律', '司法解释'],
        timeliness=['现行有效']
    )
)

# 调用接口
response = client.run_search_law_query('your-workspace-id', request)
print(response.body.data)
```

---

## 📋 响应示例

```json
{
  "requestId": "abc123-def456-ghi789",
  "statusCode": 200,
  "httpStatusCode": 200,
  "success": true,
  "data": {
    "list": [
      {
        "lawName": "《中华人民共和国刑法》",
        "content": "第二百六十三条规定，以暴力、胁迫或者其他方法抢劫公私财物的，处三年以上十年以下有期徒刑...",
        "docId": "law_doc_12345",
        "htmlContent": "<p>第二百六十三条规定...</p>",
        "similarity": "0.987",
        "highlightMap": {
          "content": ["<em>抢劫</em>"]
        },
        "lawResultAttributeVo": {
          "effectiveLevel": "法律",
          "timeliness": "现行有效",
          "promulgationDepartment": "全国人民代表大会",
          "releaseDate": "2020-12-26"
        },
        "lawResultReferInfoVo": {}
      }
    ],
    "pageSize": 10,
    "pageTotalCount": 20,
    "query": "抢劫",
    "queryKeywords": ["抢劫"],
    "totalCount": 198
  }
}
```

---

## ❌ 错误码

| HTTP 状态码 | 错误码 | 错误信息 | 解决方式 |
|-------------|--------|----------|----------|
| 400 | `Request.Signature.Error` | 请求签名错误 | 检查 AccessKey 和 Secret 是否正确 |
| 400 | `Request.Params.Error` | 请求参数缺失 | 检查必填参数是否完整 |
| 403 | `Auth.AccessDenied.WorkSpace` | 无权访问工作空间 | 检查百炼平台权限配置 |
| 403 | `Auth.InstanceInvalid.PostPay` | 商品后付费实例不可用 | 检查法睿实例是否开通并有余额 |
| 500 | `Internal.Server.Error` | 服务器内部错误 | 稍后重试或联系技术支持 |

---

## 🔧 集成建议

### 1. 前端调用方案

由于 API 需要阿里云签名认证，**不能直接从前端调用**。建议架构：

```
前端 → 后端代理 API → 阿里云法睿 API
```

### 2. 后端代理实现

```javascript
// Node.js 后端代理示例
app.post('/api/law-search', async (req, res) => {
    const { query, pageNo, pageSize, filters } = req.body;
    
    // 调用阿里云 SDK
    const response = await faruiClient.runSearchLawQuery(workspaceId, {
        appId: 'farui',
        query,
        pageParam: { pageNo, pageSize },
        filterCondition: filters
    });
    
    res.json(response.body.data);
});
```

### 3. 费用说明

- 法规检索 API 为**后付费**服务
- 需要在阿里云百炼平台开通法睿实例
- 按调用次数计费

---

## 📚 相关资源

- [阿里云百炼平台](https://bailian.console.aliyun.com/)
- [通义法睿官网](https://tongyi.aliyun.com/farui)
- [阿里云 SDK 下载](https://next.api.aliyun.com/api-tools/sdk/Farui)

---

**文档版本**: v1.0  
**更新日期**: 2025-12-10  
**数据来源**: https://tongyi.aliyun.com/farui/guide/law_search_api
