# RAGflow Python API 中文参考文档

本文档是 RAGflow Python SDK 的 API 参考手册。使用前请确保已[获取 RAGflow API 密钥](https://ragflow.io/docs/dev/acquire_ragflow_api_key)。

```bash
pip install ragflow-sdk
```

---

## 目录

1. [错误码](#错误码)
2. [OpenAI 兼容 API](#openai-兼容-api)
3. [数据集管理](#数据集管理)
4. [文档管理](#文档管理)
5. [分块管理](#分块管理)
6. [聊天助手管理](#聊天助手管理)
7. [会话管理](#会话管理)
8. [智能体管理](#智能体管理)

---

## 错误码

| 代码 | 消息                  | 说明           |
| ---- | --------------------- | -------------- |
| 400  | Bad Request           | 请求参数无效   |
| 401  | Unauthorized          | 未授权访问     |
| 403  | Forbidden             | 访问被拒绝     |
| 404  | Not Found             | 资源未找到     |
| 500  | Internal Server Error | 服务器内部错误 |
| 1001 | Invalid Chunk ID      | 无效的分块 ID  |
| 1002 | Chunk Update Failed   | 分块更新失败   |

---

## OpenAI 兼容 API

### 创建聊天补全

通过 OpenAI 的 API 格式生成对话响应。

```python
from openai import OpenAI

client = OpenAI(
    api_key="ragflow-api-key",
    base_url="http://ragflow_address/api/v1/chats_openai/<chat_id>"
)

completion = client.chat.completions.create(
    model="model",
    messages=[
        {"role": "system", "content": "你是一个有用的助手。"},
        {"role": "user", "content": "你是谁？"}
    ],
    stream=True,
    extra_body={"reference": True}
)
```

---

## 数据集管理

### 创建数据集

```python
RAGFlow.create_dataset(
    name: str,                              # 必填，数据集名称（最多128字符）
    avatar: str = None,                     # Base64 编码的头像
    description: str = None,                # 数据集描述
    embedding_model: str = "BAAI/bge-large-zh-v1.5@BAAI",  # 向量模型
    permission: str = "me",                 # "me" 或 "team"
    chunk_method: str = "naive",            # 分块方法
    parser_config: dict = None              # 解析配置
) -> DataSet
```

**分块方法选项**：

| 值             | 说明         |
| -------------- | ------------ |
| `naive`        | 通用（默认） |
| `manual`       | 手动         |
| `qa`           | 问答         |
| `table`        | 表格         |
| `paper`        | 论文         |
| `book`         | 书籍         |
| `laws`         | 法律法规     |
| `presentation` | 演示文稿     |
| `picture`      | 图片         |
| `one`          | 单块         |
| `email`        | 邮件         |

**示例**：

```python
from ragflow_sdk import RAGFlow

rag = RAGFlow(api_key="<YOUR_API_KEY>", base_url="http://<YOUR_BASE_URL>:9380")
dataset = rag.create_dataset(name="案件_001")
```

---

### 删除数据集

```python
RAGFlow.delete_datasets(ids: list[str] = None)
```

- `ids`: 要删除的数据集 ID 列表。若为 `None`，删除所有数据集。

---

### 列出数据集

```python
RAGFlow.list_datasets(
    page: int = 1,
    page_size: int = 30,
    orderby: str = "create_time",  # "create_time" 或 "update_time"
    desc: bool = True,
    id: str = None,
    name: str = None
) -> list[DataSet]
```

---

### 更新数据集

```python
dataset.update({
    "name": "新名称",
    "embedding_model": "BAAI/bge-zh-v1.5",
    "chunk_method": "manual",
    "permission": "team"
})
```

---

## 文档管理

### 上传文档

```python
dataset.upload_documents([
    {"display_name": "合同.pdf", "blob": open("合同.pdf", "rb").read()},
    {"display_name": "证据.docx", "blob": open("证据.docx", "rb").read()}
])
```

---

### 列出文档

```python
Dataset.list_documents(
    id: str = None,
    keywords: str = None,
    page: int = 1,
    page_size: int = 30,
    order_by: str = "create_time",
    desc: bool = True
) -> list[Document]
```

**Document 对象属性**：

| 属性               | 类型  | 说明                                             |
| ------------------ | ----- | ------------------------------------------------ |
| `id`               | str   | 文档 ID                                          |
| `name`             | str   | 文档名称                                         |
| `size`             | int   | 文件大小（字节）                                 |
| `chunk_count`      | int   | 分块数量                                         |
| `token_count`      | int   | Token 数量                                       |
| `progress`         | float | 处理进度（0-100%）                               |
| `run`              | str   | 状态：`UNSTART`/`RUNNING`/`DONE`/`FAIL`/`CANCEL` |
| `process_duration` | float | 处理耗时（秒）                                   |

---

### 删除文档

```python
dataset.delete_documents(ids=["doc_id_1", "doc_id_2"])
```

---

### 解析文档（异步）

```python
dataset.async_parse_documents(document_ids=["doc_id_1", "doc_id_2"])
```

> 解析是异步的，需要轮询文档状态直到 `run == "DONE"`。

---

### 解析文档（等待完成）

```python
results = dataset.parse_documents(document_ids=["doc_id_1", "doc_id_2"])
# 返回: [(doc_id, status, chunk_count, token_count), ...]
```

---

### 停止解析

```python
dataset.async_cancel_parse_documents(document_ids=["doc_id_1"])
```

---

## 分块管理

### 添加分块

```python
chunk = document.add_chunk(
    content="这是文本内容",
    important_keywords=["关键词1", "关键词2"]
)
```

---

### 列出分块

```python
Document.list_chunks(
    keywords: str = None,
    page: int = 1,
    page_size: int = 30,
    id: str = None
) -> list[Chunk]
```

**Chunk 对象属性**：

| 属性                 | 类型      | 说明          |
| -------------------- | --------- | ------------- |
| `id`                 | str       | 分块 ID       |
| `content`            | str       | 文本内容      |
| `important_keywords` | list[str] | 关键词列表    |
| `dataset_id`         | str       | 所属数据集 ID |
| `document_id`        | str       | 所属文档 ID   |
| `available`          | bool      | 是否可用      |

---

### 删除分块

```python
document.delete_chunks(chunk_ids=["chunk_id_1", "chunk_id_2"])
```

---

### 更新分块

```python
chunk.update({
    "content": "更新后的内容",
    "important_keywords": ["新关键词"],
    "available": True
})
```

---

### 检索分块（核心 API）

```python
RAGFlow.retrieve(
    question: str,                    # 必填，查询问题
    dataset_ids: list[str],           # 必填，数据集 ID 列表
    document_ids: list[str] = None,   # 限定文档范围
    page: int = 1,
    page_size: int = 30,
    similarity_threshold: float = 0.2,
    vector_similarity_weight: float = 0.3,
    top_k: int = 1024,
    rerank_id: str = None,
    keyword: bool = False
) -> list[Chunk]
```

**示例**：

```python
# 仅在指定案件的知识库中检索
chunks = rag.retrieve(
    question="付款时间是什么时候？",
    dataset_ids=["案件_001_dataset_id"]
)
for chunk in chunks:
    print(f"相似度: {chunk.similarity}, 内容: {chunk.content[:100]}")
```

---

## 聊天助手管理

### 创建聊天助手

```python
RAGFlow.create_chat(
    name: str,                        # 必填，助手名称
    avatar: str = "",
    dataset_ids: list[str] = [],      # 关联的数据集
    llm: Chat.LLM = None,             # LLM 配置
    prompt: Chat.Prompt = None        # 提示词配置
) -> Chat
```

**LLM 配置**：

| 属性                | 类型  | 说明          | 默认值   |
| ------------------- | ----- | ------------- | -------- |
| `model_name`        | str   | 模型名称      | 用户默认 |
| `temperature`       | float | 随机性（0-1） | 0.1      |
| `top_p`             | float | 核采样阈值    | 0.3      |
| `presence_penalty`  | float | 重复惩罚      | 0.2      |
| `frequency_penalty` | float | 频率惩罚      | 0.7      |

**Prompt 配置**：

| 属性                   | 类型  | 说明                | 默认值 |
| ---------------------- | ----- | ------------------- | ------ |
| `similarity_threshold` | float | 相似度阈值          | 0.2    |
| `top_n`                | int   | 发送给 LLM 的分块数 | 8      |
| `empty_response`       | str   | 无结果时的回复      | None   |
| `show_quote`           | bool  | 是否显示引用来源    | True   |

---

### 列出聊天助手

```python
for chat in rag.list_chats():
    print(chat.name)
```

---

### 删除聊天助手

```python
rag.delete_chats(ids=["chat_id_1", "chat_id_2"])
```

---

## 会话管理

### 创建会话

```python
session = chat.create_session(name="新会话")
```

---

### 对话（核心 API）

```python
Session.ask(
    question: str,         # 用户问题
    stream: bool = False   # 是否流式输出
) -> Message | iter[Message]
```

**Message 对象属性**：

| 属性        | 类型        | 说明           |
| ----------- | ----------- | -------------- |
| `id`        | str         | 消息 ID        |
| `content`   | str         | 回复内容       |
| `reference` | list[Chunk] | 引用的分块列表 |

**引用分块属性**：

| 属性                | 类型  | 说明              |
| ------------------- | ----- | ----------------- |
| `content`           | str   | 分块内容          |
| `document_name`     | str   | 来源文档名        |
| `similarity`        | float | 综合相似度（0-1） |
| `vector_similarity` | float | 向量相似度        |
| `term_similarity`   | float | 关键词相似度      |

**流式对话示例**：

```python
session = chat.create_session()
for msg in session.ask("这份合同的付款条款是什么？", stream=True):
    print(msg.content, end="", flush=True)
```

---

### 列出会话

```python
for session in chat.list_sessions():
    print(session.name)
```

---

### 删除会话

```python
chat.delete_sessions(ids=["session_id_1"])
```

---

## 智能体管理

### 列出智能体

```python
for agent in rag.list_agents():
    print(agent.title)
```

---

### 创建智能体

```python
rag.create_agent(
    title="法律助手",
    description="专业法律分析智能体",
    dsl={...}  # Canvas DSL 配置
)
```

---

### 智能体会话

```python
agent = rag.list_agents(id="agent_id")[0]
session = agent.create_session()

for msg in session.ask("分析这份合同的风险点", stream=True):
    print(msg.content, end="", flush=True)
```

---

### 删除智能体

```python
rag.delete_agent(agent_id="agent_id")
```

---

## 文件上传限制

| 类型           | 限制         | 可调整     |
| -------------- | ------------ | ---------- |
| 单次上传总大小 | 1GB          | ✅         |
| 单文件解析大小 | 128MB        | ✅         |
| 批量文件数/次  | 32（Web UI） | SDK 无限制 |
| 知识库总空间   | **无限制**   | -          |

> 修改限制：编辑 `docker/.env` 的 `MAX_CONTENT_LENGTH` 和 `nginx/nginx.conf` 的 `client_max_body_size`。

---

**文档版本**: v1.0  
**更新日期**: 2026-01-13  
**来源**: RAGflow Python SDK 官方文档
