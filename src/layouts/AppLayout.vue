<template>
  <div class="app-layout">
    <Sidebar />
    <main class="workspace">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/layout/Sidebar.vue'

export default {
  name: 'AppLayout',
  components: {
    Sidebar
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}
</style>

