-- ================================================
-- 产品反馈表 - Supabase Schema
-- ================================================

-- 1. 创建 product_feedback 表
CREATE TABLE IF NOT EXISTS public.product_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 反馈内容
    type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- 用户信息（冗余存储，方便查询）
    user_email TEXT,
    user_name TEXT,
    
    -- 状态管理
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- 附加信息
    browser_info TEXT,  -- 浏览器信息
    page_url TEXT,      -- 提交时的页面URL
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.product_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.product_feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.product_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.product_feedback(created_at DESC);

-- 3. 启用行级安全 (RLS)
ALTER TABLE public.product_feedback ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略
-- 所有登录用户都可以提交反馈
CREATE POLICY "Authenticated users can insert feedback"
    ON public.product_feedback FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 用户可以查看自己的反馈
CREATE POLICY "Users can view own feedback"
    ON public.product_feedback FOR SELECT
    USING (auth.uid() = user_id);

-- 用户可以更新自己的反馈（仅限未解决的）
CREATE POLICY "Users can update own pending feedback"
    ON public.product_feedback FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

-- 管理员可以查看所有反馈（可选，需要设置 is_admin 字段）
-- CREATE POLICY "Admins can view all feedback"
--     ON public.product_feedback FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE id = auth.uid() AND is_admin = true
--         )
--     );

-- 5. 创建触发器：自动更新 updated_at
CREATE TRIGGER on_feedback_updated
    BEFORE UPDATE ON public.product_feedback
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 6. 创建视图：反馈统计（可选）
CREATE OR REPLACE VIEW public.feedback_stats AS
SELECT 
    type,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as count_last_7_days,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as count_last_30_days
FROM public.product_feedback
GROUP BY type, status;

-- 7. 授予视图访问权限
GRANT SELECT ON public.feedback_stats TO authenticated;
