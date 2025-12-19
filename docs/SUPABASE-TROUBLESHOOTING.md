# Supabase 初始化错误排查指南

## ❌ 错误信息
```
Supabase client not initialized
```

## 🔍 问题原因

这个错误表示 Supabase JavaScript 库没有正确加载。

### 常见原因

1. **CDN 加载失败**
   - 网络连接问题
   - CDN 服务不可用
   - 防火墙/代理阻止

2. **脚本加载顺序问题**
   - main.js 在 Supabase 库加载前执行
   - 浏览器缓存问题

3. **浏览器兼容性**
   - 使用了不支持的旧版浏览器
   - 浏览器扩展干扰

---

## ✅ 解决方案

### 方案 1: 清除缓存并刷新（最常见）

1. **硬刷新页面**
   - Windows: `Ctrl + Shift + R` 或 `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **清除浏览器缓存**
   - Chrome: 设置 → 隐私和安全 → 清除浏览数据
   - 选择"缓存的图片和文件"
   - 点击"清除数据"

### 方案 2: 检查网络连接

1. **打开浏览器控制台**（F12）
2. **切换到 Network 标签**
3. **刷新页面**
4. **查找 supabase-js 的请求**
   - 如果显示红色或失败，说明 CDN 加载失败
   - 检查网络连接或尝试使用 VPN

### 方案 3: 检查控制台错误

1. **打开浏览器控制台**（F12）
2. **切换到 Console 标签**
3. **查找错误信息**：
   ```
   ❌ Supabase library not loaded.
   请检查：
   1. index.html 中是否包含 Supabase CDN
   2. 网络连接是否正常
   3. 浏览器控制台是否有 CDN 加载错误
   ```

### 方案 4: 验证 Supabase 库加载

在浏览器控制台中输入：
```javascript
console.log(window.supabase);
```

**预期结果**：
- ✅ 显示对象：`{createClient: ƒ, ...}` - 库已加载
- ❌ 显示 `undefined` - 库未加载

### 方案 5: 使用备用 CDN

如果 unpkg CDN 不可用，可以尝试其他 CDN：

**编辑 `index.html`**，替换 Supabase CDN 为：

```html
<!-- 选项 1: jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 选项 2: unpkg（当前使用） -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>

<!-- 选项 3: cdnjs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/supabase-js/2.39.0/supabase.min.js"></script>
```

---

## 🛠️ 已实施的修复

### 1. 更换 CDN
- ❌ 旧: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- ✅ 新: `https://unpkg.com/@supabase/supabase-js@2`

### 2. 添加延迟重试
如果初次检测失败，会在 1 秒后自动重试。

### 3. 改进错误提示
控制台会显示详细的排查步骤。

### 4. 添加 defer 属性
确保 main.js 在所有 CDN 库加载后执行。

---

## 🧪 测试步骤

### 1. 验证修复
1. 清除浏览器缓存
2. 访问 `http://localhost:8080`
3. 打开控制台（F12）
4. 查找成功消息：
   ```
   ✅ Supabase client initialized successfully
   ```

### 2. 测试登录
1. 使用 `test@qq.com` 登录
2. 如果仍然失败，查看控制台错误
3. 按照错误提示排查

---

## 📊 常见场景

### 场景 1: 首次访问失败
**原因**: CDN 加载慢  
**解决**: 等待 1-2 秒后刷新

### 场景 2: 本地开发正常，部署后失败
**原因**: 生产环境网络限制  
**解决**: 使用国内 CDN 或自托管 Supabase JS

### 场景 3: 特定浏览器失败
**原因**: 浏览器扩展干扰  
**解决**: 使用无痕模式测试

---

## 🔗 相关资源

- [Supabase JS 文档](https://supabase.com/docs/reference/javascript)
- [unpkg CDN](https://unpkg.com/)
- [jsDelivr CDN](https://www.jsdelivr.com/)

---

**更新日期**: 2025-12-10  
**版本**: v1.1
