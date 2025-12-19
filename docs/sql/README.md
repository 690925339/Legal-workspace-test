# Supabase 数据库脚本

本目录包含所有 Supabase 数据库的 SQL 脚本文件。

## 📁 文件说明

### 01-profiles-schema.sql
**用户资料表**
- 创建 `profiles` 表
- 存储用户扩展信息（姓名、职位、手机、部门等）
- 配置 RLS 策略
- 设置自动触发器

**执行顺序**: 第一个执行（依赖 auth.users）

---

### 02-feedback-schema.sql
**产品反馈表**
- 创建 `product_feedback` 表
- 存储用户反馈（功能建议、问题反馈等）
- 配置 RLS 策略
- 创建反馈统计视图

**执行顺序**: 第二个执行（依赖 profiles 表的触发器函数）

---

## 🚀 执行方式

### 方法 1: 在 Supabase Dashboard 中执行

1. 访问 SQL Editor：
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor/sql
   ```

2. 按顺序执行每个文件：
   - 先执行 `01-profiles-schema.sql`
   - 再执行 `02-feedback-schema.sql`

### 方法 2: 使用 Supabase CLI（可选）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 执行脚本
supabase db push --db-url "your-database-url"
```

---

## ✅ 验证执行结果

执行完成后，运行以下查询验证：

```sql
-- 检查所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'product_feedback');

-- 检查 RLS 是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'product_feedback');

-- 检查策略数量
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('profiles', 'product_feedback')
GROUP BY tablename;
```

**预期结果**：
- 第一个查询：返回 2 行（profiles, product_feedback）
- 第二个查询：两个表的 `rowsecurity` 都为 `true`
- 第三个查询：profiles 有 3 个策略，product_feedback 有 3 个策略

---

## 📝 添加新脚本

当需要添加新的数据库表时：

1. 创建新文件：`03-table-name-schema.sql`
2. 使用数字前缀表示执行顺序
3. 在本 README 中添加说明
4. 更新验证查询

---

## 🔒 安全注意事项

- ✅ 所有表都启用了 RLS（行级安全）
- ✅ 用户只能访问自己的数据
- ✅ 使用 `auth.uid()` 验证用户身份
- ⚠️ 不要在 SQL 中硬编码敏感信息

---

**最后更新**: 2025-12-09  
**维护者**: AI法律助手开发团队
