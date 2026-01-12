---
layout: page
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

onMounted(() => {
  const router = useRouter()
  router.go('/help/getting-started.html')
})
</script>

# 正在跳转...

请稍候，正在跳转到 [快速入门](/getting-started) 页面。
