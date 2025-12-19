-- 创建品牌设置表
create table brand_settings (
  id uuid default uuid_generate_v4() primary key,
  setting_key text not null unique, -- 设置项键名
  setting_value text,               -- 设置项值
  setting_type text default 'text' check (setting_type in ('text', 'url', 'color', 'boolean')),
  description text,                 -- 描述
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 添加注释
comment on table brand_settings is '品牌配置表，用于存储可动态配置的品牌信息';
comment on column brand_settings.setting_key is '设置项键名，如 brand_name, logo_url 等';
comment on column brand_settings.setting_value is '设置项值';
comment on column brand_settings.setting_type is '值类型：text/url/color/boolean';

-- 开启 RLS
alter table brand_settings enable row level security;

-- 创建策略：允许所有用户读取品牌设置
create policy "Allow public read access"
  on brand_settings for select
  using (true);

-- 创建策略：仅允许 authenticated 用户修改
create policy "Allow authenticated insert"
  on brand_settings for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
  on brand_settings for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete"
  on brand_settings for delete
  using (auth.role() = 'authenticated');

-- 插入默认品牌配置
insert into brand_settings (setting_key, setting_value, setting_type, description) values
-- 基本信息
('brand_name', 'Alpha&Leader', 'text', '品牌名称'),
('brand_subtitle', '安华理达', 'text', '品牌副标题（中文名）'),
('brand_slogan', 'AI 法律工作空间', 'text', '品牌标语'),
('page_title', 'Alpha&Leader - AI 法律工作空间', 'text', '页面标题'),

-- Logo 设置
('logo_url', '', 'url', 'Logo 图片 URL（留空使用文字 Logo）'),
('logo_text', 'LOGO', 'text', '文字 Logo 内容（当无图片时显示）'),
('favicon_url', '', 'url', '网站图标 URL'),

-- 登录页文案
('brand_quote', '"迟来的正义即非正义"', 'text', '登录页品牌语录'),
('brand_description', '体验 AI 驱动的法律工作空间，简化案件管理，智能分析文档，专注于最重要的事情。', 'text', '登录页品牌描述'),

-- 注册页文案
('brand_quote_register', '"效率是把事情做对，效能是做对的事情"', 'text', '注册页品牌语录'),
('brand_description_register', '加入数千名信赖 Alpha&Leader 管理法律实务的专业人士行列。', 'text', '注册页品牌描述'),

-- 颜色主题
('primary_color', '#1a73e8', 'color', '主题色'),
('secondary_color', '#667eea', 'color', '次要色'),

-- 联系信息
('contact_email', '', 'text', '联系邮箱'),
('support_phone', '', 'text', '客服电话'),

-- 版权信息
('copyright_text', '© 2024 Alpha&Leader. All rights reserved.', 'text', '版权声明'),
('icp_number', '', 'text', 'ICP 备案号');
