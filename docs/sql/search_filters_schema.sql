-- 创建 search_filter_options 表
create table search_filter_options (
  id uuid default uuid_generate_v4() primary key,
  category text not null check (category in ('case', 'regulation')), -- 检索类型：case(案例), regulation(法规)
  filter_key text not null, -- 筛选键：例如 court_level, doc_type, effective_level
  label text not null,      -- 显示名称：例如 '最高人民法院'
  value text not null,      -- 实际值：例如 '最高人民法院'
  display_order integer default 0, -- 显示顺序
  is_active boolean default true,    -- 是否启用
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 添加注释
comment on table search_filter_options is '存储案例和法规检索的筛选项数据';
comment on column search_filter_options.category is '检索类型：case=案例检索, regulation=法规检索';
comment on column search_filter_options.filter_key is '筛选维度的键名';
comment on column search_filter_options.label is '前端显示的文本';
comment on column search_filter_options.value is '传递给后端/API的值';

-- 开启 RLS
alter table search_filter_options enable row level security;

-- 创建策略：允许所有用户（包括未登录）读取筛选项
create policy "Allow public read access"
  on search_filter_options for select
  using (true);

-- 创建策略：仅允许 authenticated 用户（或特定管理员角色）修改（此处示例为允许 authenticated）
-- 实际生产中可能需要基于角色的访问控制
create policy "Allow authenticated insert"
  on search_filter_options for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
  on search_filter_options for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated delete"
  on search_filter_options for delete
  using (auth.role() = 'authenticated');

-- 插入初始数据：案例检索 (Case Search)

-- 1. 法院层级 (court_level)
insert into search_filter_options (category, filter_key, label, value, display_order) values
('case', 'court_level', '最高人民法院', '最高人民法院', 10),
('case', 'court_level', '高级人民法院', '高级人民法院', 20),
('case', 'court_level', '中级人民法院', '中级人民法院', 30),
('case', 'court_level', '基层人民法院', '基层人民法院', 40);

-- 2. 地域与法院 (region) - 支持搜索的下拉框
insert into search_filter_options (category, filter_key, label, value, display_order) values
('case', 'region', '最高人民法院', '最高人民法院', 1),
('case', 'region', '北京市', '北京市', 10),
('case', 'region', '上海市', '上海市', 20),
('case', 'region', '天津市', '天津市', 30),
('case', 'region', '重庆市', '重庆市', 40),
('case', 'region', '广东省', '广东省', 50),
('case', 'region', '山东省', '山东省', 60),
('case', 'region', '河南省', '河南省', 70),
('case', 'region', '江苏省', '江苏省', 80),
('case', 'region', '浙江省', '浙江省', 90),
('case', 'region', '四川省', '四川省', 100),
('case', 'region', '湖北省', '湖北省', 110),
('case', 'region', '湖南省', '湖南省', 120),
('case', 'region', '福建省', '福建省', 130),
('case', 'region', '安徽省', '安徽省', 140),
('case', 'region', '江西省', '江西省', 150),
('case', 'region', '陕西省', '陕西省', 160),
('case', 'region', '辽宁省', '辽宁省', 170),
('case', 'region', '黑龙江省', '黑龙江省', 180),
('case', 'region', '吉林省', '吉林省', 190),
('case', 'region', '云南省', '云南省', 200),
('case', 'region', '贵州省', '贵州省', 210),
('case', 'region', '甘肃省', '甘肃省', 220),
('case', 'region', '青海省', '青海省', 230),
('case', 'region', '海南省', '海南省', 240),
('case', 'region', '山西省', '山西省', 250),
('case', 'region', '河北省', '河北省', 260),
('case', 'region', '广西壮族自治区', '广西壮族自治区', 270),
('case', 'region', '内蒙古自治区', '内蒙古自治区', 280),
('case', 'region', '新疆维吾尔自治区', '新疆维吾尔自治区', 290),
('case', 'region', '西藏自治区', '西藏自治区', 300),
('case', 'region', '宁夏回族自治区', '宁夏回族自治区', 310);

-- 3. 审判程序 (procedure) - 支持搜索的下拉框
insert into search_filter_options (category, filter_key, label, value, display_order) values
('case', 'procedure', '一审', '一审', 10),
('case', 'procedure', '二审', '二审', 20),
('case', 'procedure', '再审', '再审', 30),
('case', 'procedure', '复核', '复核', 40),
('case', 'procedure', '执行', '执行', 50),
('case', 'procedure', '破产', '破产', 60),
('case', 'procedure', '再审复查与审判监督', '再审复查与审判监督', 70),
('case', 'procedure', '刑罚变更', '刑罚变更', 80);

-- 4. 文书类型 (doc_type)
insert into search_filter_options (category, filter_key, label, value, display_order) values
('case', 'doc_type', '判决书', '判决书', 10),
('case', 'doc_type', '裁定书', '裁定书', 20),
('case', 'doc_type', '调解书', '调解书', 30);


-- 插入初始数据：法规检索 (Regulation Search)

-- 1. 效力级别 (effective_level)
insert into search_filter_options (category, filter_key, label, value, display_order) values
('regulation', 'effective_level', '法律', '法律', 10),
('regulation', 'effective_level', '司法解释', '司法解释', 20),
('regulation', 'effective_level', '行政法规', '行政法规', 30),
('regulation', 'effective_level', '地方性法规', '地方性法规', 40),
('regulation', 'effective_level', '部门规章', '部门规章', 50);

-- 2. 时效性 (timeliness)
insert into search_filter_options (category, filter_key, label, value, display_order) values
('regulation', 'timeliness', '现行有效', '现行有效', 10),
('regulation', 'timeliness', '已废止/失效', '已废止/失效', 20),
('regulation', 'timeliness', '部分修改', '部分修改', 30);

-- 3. 颁布部门/发文机关 (issuing_authority)
insert into search_filter_options (category, filter_key, label, value, display_order) values
('regulation', 'issuing_authority', '全国人大常委会', '全国人大常委会', 10),
('regulation', 'issuing_authority', '国务院', '国务院', 20),
('regulation', 'issuing_authority', '最高人民法院', '最高人民法院', 30),
('regulation', 'issuing_authority', '最高人民检察院', '最高人民检察院', 40),
('regulation', 'issuing_authority', '各部委', '各部委', 50),
('regulation', 'issuing_authority', '省级人大', '省级人大', 60),
('regulation', 'issuing_authority', '省级政府', '省级政府', 70);
