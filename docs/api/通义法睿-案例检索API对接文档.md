# 通义法睿 - 案例检索 API 对接文档

## 📋 概述

通义法睿案例检索 API 提供智能案例搜索功能，用户输入问题后，大模型会解析问题生成检索条件，并返回相关案例。

---

## 🔐 认证授权

### 所需凭证
- **AccessKey ID**: 阿里云 AccessKey
- **AccessKey Secret**: 阿里云 Secret
- **WorkspaceId**: 百炼平台工作空间 ID

### 请求头
```
x-acs-action: RunSearchCaseFullText
x-acs-version: 2024-06-28
x-acs-date: {timestamp}
Authorization: ACS3-HMAC-SHA256 Credential=...
```

---

## 📡 接口信息

### 请求地址
```
POST https://farui.cn-beijing.aliyuncs.com/{workspaceId}/farui/search/case/fulltext
```

---

## 📥 请求参数

### 请求体（JSON）

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `appId` | string | 否 | 应用 ID | `"farui"` |
| `workspaceId` | string | 否 | 工作空间 ID | `"your-workspace-id"` |
| `query` | string | **是** | 搜索问题 | `"涉及建设工程造价鉴定的案例"` |
| `queryKeywords` | List\<string\> | 否 | 关键词列表 | `["盗窃", "抢劫"]` |
| `pageParam` | object | **是** | 分页参数 | 见下表 |
| `sortKeyAndDirection` | Map | 否 | 排序字段 | `{"trialYearMonthDate": "desc"}` |
| `filterCondition` | object | 否 | 筛选条件 | 见下表 |
| `referLevel` | string | 否 | 案例类型 | `"其他"`, `"参考"`, `"指导性"` |

### 分页参数 (pageParam)

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `pageNumber` | int | 是 | 当前页（从1开始） | `1` |
| `pageSize` | int | 是 | 每页数量 | `10` |

### 筛选条件 (filterCondition)

| 参数名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `caseTitle` | string | 案例标题 | `"牛鹏明与康小锋盗窃罪二审刑事裁定书"` |
| `caseNo` | string | 案号 | `"（2017）晋01刑终740号"` |

### 排序字段 (sortKeyAndDirection)

| 字段 | 说明 |
|------|------|
| `trialYearMonthDate` | 裁判日期，`asc` 升序，`desc` 降序 |

---

## 📤 响应格式

### 响应结构

```json
{
  "requestId": "string",
  "httpStatusCode": 200,
  "success": true,
  "data": {
    "caseResult": [...],
    "currentPage": 1,
    "pageSize": 10,
    "query": "检索的问题",
    "queryKeywords": ["关键词"],
    "totalCount": 200
  }
}
```

### data 字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `caseResult` | array | 案例结果列表 |
| `currentPage` | int | 当前页码 |
| `pageSize` | int | 每页数量 |
| `query` | string | 检索问题 |
| `queryKeywords` | array | 关键词列表 |
| `totalCount` | int | 总结果数 |

### 案例对象结构 (caseResult 中的每个元素)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `caseDomain` | object | 案例详细信息 |
| `similarity` | string | 相似度评分 |

### caseDomain 主要字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `caseId` | string | 案件 ID |
| `caseNo` | string | 案号 |
| `caseTitle` | string | 文书名称 |
| `caseType` | string | 案件类型 |
| `caseSummary` | string | 案件概述 |
| `openCaseCause` | array | 立案案由 |
| `closeCaseCause` | array | 结案案由 |
| `trialDate` | string | 审理日期 |
| `trialLevel` | string | 审判层级 |
| `trialProgram` | object | 审判程序 |
| `trialCourt` | object | 审理法院信息 |
| `documentType` | string | 文书类型 |
| `referLevel` | string | 参考类型（指导性/参考/其他）|
| `courtThink` | string | 本院认为 |
| `courtFindOut` | string | 本院查明 |
| `verdict` | string | 裁判结果 |
| `sourceContent` | string | 文书正文 |
| `appliedLaws` | string | 应用法条 |
| `litigants` | string | 当事人信息 |
| `disputeFocus` | string | 争议焦点 |
| `keyfacts` | string | 核心事实 |

### trialCourt（审理法院）字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `name` | string | 法院名称 |
| `province` | string | 省份 |
| `city` | string | 城市 |
| `county` | string | 区县 |
| `commonLevel` | string | 法院层级（基层/中级/高级/最高）|
| `specialLevel` | string | 法院级别 |

---

## 📋 响应示例

```json
{
  "data": {
    "caseResult": [{
      "caseDomain": {
        "caseId": "f5192ebfd331ecf8b8c84053e0bfc834",
        "caseNo": "（2024）黔0304行审57号",
        "caseTitle": "遵义市某某局与杨某某非诉行政行为申请执行审查裁定书",
        "caseType": "非诉行政行为申请执行审查案件",
        "documentType": "裁定书",
        "trialDate": "2024-05-13",
        "trialLevel": "其他",
        "referLevel": "其他",
        "courtThink": "本院认为，申请执行人遵义市某某局提出撤回申请符合法律规定...",
        "verdict": "准许遵义市某某局撤回审查执行...",
        "trialCourt": {
          "name": "遵义市播州区人民法院",
          "city": "遵义市",
          "province": "贵州省",
          "commonLevel": "基层人民法院"
        }
      },
      "similarity": "0.008838743222222221"
    }],
    "currentPage": 1,
    "pageSize": 10,
    "query": "行政机关违反法定程序作出的行政处罚是否应被撤销的案例",
    "queryKeywords": ["行政机关", "违反法定程序", "行政处罚", "撤销"],
    "totalCount": 200
  },
  "httpStatusCode": 200,
  "requestId": "8e53eee2-ab98-4d9c-b2f2-e10bdb133d59",
  "success": true
}
```

---

## ❌ 错误码

| HTTP 状态码 | 错误码 | 错误信息 | 解决方式 |
|-------------|--------|----------|----------|
| 400 | `Request.Signature.Error` | 请求签名错误 | 检查 AccessKey 和 Secret |
| 400 | `Request.Params.Error` | 请求参数缺失 | 检查必填参数 |
| 403 | `Auth.AccessDenied.WorkSpace` | 无权访问工作空间 | 检查百炼平台权限 |
| 403 | `Auth.InstanceInvalid.PostPay` | 后付费实例不可用 | 检查法睿实例开通和费用 |
| 500 | `Internal.Server.Error` | 服务器错误 | 联系技术支持 |

---

## 🔧 Python 调用示例

```python
import hmac
import hashlib
import json
from datetime import datetime
from urllib.parse import urlparse, urlencode, quote
import requests

access_key_id = "your-access-key"
access_key_secret = "your-secret"
workspace_id = 'your-workspace-id'

def call_case_search():
    host = 'farui.cn-beijing.aliyuncs.com'
    url = f"https://{host}/{workspace_id}/farui/search/case/fulltext"
    
    body = {
        'appId': 'farui',
        'workspaceId': workspace_id,
        'query': '涉及建设工程造价鉴定的案例',
        'pageParam': {
            'pageSize': 10,
            'pageNumber': 1
        },
        'sortKeyAndDirection': {
            'trialYearMonthDate': 'desc'
        }
    }
    
    # ... 添加签名逻辑 ...
    
    response = requests.post(url, headers=headers, data=json.dumps(body))
    return response.json()
```

---

**文档版本**: v1.0  
**更新日期**: 2025-12-10  
**数据来源**: https://tongyi.aliyun.com/farui/guide/case_search_api
