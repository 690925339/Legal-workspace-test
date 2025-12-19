# 产品反馈功能 - Supabase 集成指南

## 📋 功能概述

用户可以通过产品反馈表单提交功能建议、问题反馈等，数据将保存到 Supabase 数据库。

---

## 🗄️ 数据库设置

### 步骤 1: 创建反馈表

在 Supabase SQL Editor 中执行 `docs/feedback-schema.sql`：

1. 访问：https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor/sql
2. 复制 `feedback-schema.sql` 的全部内容
3. 粘贴并点击 **Run**

### 步骤 2: 验证表创建

```sql
-- 检查表是否存在
SELECT * FROM public.product_feedback LIMIT 1;

-- 检查 RLS 策略
SELECT policyname FROM pg_policies WHERE tablename = 'product_feedback';
```

---

## 📊 数据表结构

### product_feedback 表

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | UUID | 主键 | 自动生成 |
| `user_id` | UUID | 提交用户ID | 外键 auth.users |
| `type` | TEXT | 反馈类型 | feature/bug/improvement/other |
| `title` | TEXT | 标题 | 必填 |
| `description` | TEXT | 详细描述 | 必填 |
| `user_email` | TEXT | 用户邮箱 | 可选 |
| `user_name` | TEXT | 用户姓名 | 自动填充 |
| `status` | TEXT | 状态 | pending/in_progress/resolved/closed |
| `priority` | TEXT | 优先级 | low/medium/high/urgent |
| `browser_info` | TEXT | 浏览器信息 | 自动收集 |
| `page_url` | TEXT | 提交页面URL | 自动收集 |
| `created_at` | TIMESTAMP | 创建时间 | 自动生成 |
| `updated_at` | TIMESTAMP | 更新时间 | 自动更新 |

---

## 💻 代码变更

### 修改文件
[ProductFeedback.js](file:///e:/工作台/odoo/legal-workspace-vue/src/views/ProductFeedback.js)

### 主要变更

#### 1. 导入依赖
```javascript
import { getSupabaseClient } from '../config/supabase.js';
import { authStore } from '../store/authStore.js';
```

#### 2. 提交反馈到数据库
```javascript
async submitFeedback() {
    const supabase = getSupabaseClient();
    const userId = authStore.user?.id;
    
    const feedbackData = {
        user_id: userId,
        type: this.feedback.type,
        title: this.feedback.title.trim(),
        description: this.feedback.description.trim(),
        user_email: this.feedback.email || authStore.user?.email,
        user_name: authStore.user?.user_metadata?.full_name,
        browser_info: navigator.userAgent,
        page_url: window.location.href,
        status: 'pending',
        priority: 'medium'
    };
    
    const { data, error } = await supabase
        .from('product_feedback')
        .insert([feedbackData])
        .select();
}
```

---

## 🔒 安全策略 (RLS)

### 已配置的策略

1. **插入权限**：所有登录用户可以提交反馈
2. **查看权限**：用户只能查看自己的反馈
3. **更新权限**：用户只能更新自己的待处理反馈

---

## ✅ 测试步骤

### 1. 创建数据表
- 在 Supabase 中执行 `feedback-schema.sql`
- 验证表创建成功

### 2. 测试提交反馈
1. 登录系统
2. 点击侧边栏用户菜单 → "产品反馈"
3. 填写表单：
   - 反馈类型：功能建议
   - 标题：测试反馈
   - 描述：这是一个测试反馈
4. 点击"提交反馈"
5. 应该看到"感谢您的反馈"提示

### 3. 验证数据保存
在 Supabase Table Editor 中查看：
```sql
SELECT * FROM public.product_feedback ORDER BY created_at DESC LIMIT 5;
```

应该看到刚提交的反馈记录。

---

## 📈 查看反馈统计

使用预定义的视图查看统计：

```sql
SELECT * FROM public.feedback_stats;
```

返回按类型和状态分组的反馈数量。

---

## 🔧 管理反馈（可选）

### 创建管理员视图

如果需要管理员查看所有反馈，可以：

1. 在 `profiles` 表添加 `is_admin` 字段
2. 取消注释 `feedback-schema.sql` 中的管理员策略
3. 创建管理页面查询所有反馈

---

## 🚀 未来扩展

### 附件上传功能

当前代码已预留附件上传接口，可扩展：

1. 创建 `feedback-attachments` Storage bucket
2. 在提交时上传附件到 Storage
3. 保存附件 URL 到数据库

### 邮件通知

可集成 Supabase Edge Functions 实现：
- 新反馈提交时发送邮件通知管理员
- 反馈状态更新时通知用户

---

**创建日期**: 2025-12-09  
**状态**: ✅ 已完成集成
