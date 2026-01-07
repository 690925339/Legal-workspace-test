<template>
  <div class="skeleton-container">
    <div v-for="i in rows" :key="i" class="skeleton-row">
      <div class="skeleton-cell cell-info">
        <div class="skeleton-line title" />
        <div class="skeleton-line meta" />
      </div>
      <div class="skeleton-cell cell-type">
        <div class="skeleton-line short" />
      </div>
      <div class="skeleton-cell cell-stage">
        <div class="skeleton-line short" />
      </div>
      <div class="skeleton-cell cell-status">
        <div class="skeleton-badge" />
      </div>
      <div class="skeleton-cell cell-date">
        <div class="skeleton-line short" />
      </div>
      <div class="skeleton-cell cell-actions">
        <div class="skeleton-actions">
          <div class="skeleton-btn" />
          <div class="skeleton-btn" />
          <div class="skeleton-btn" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaseListSkeleton',
  props: {
    rows: {
      type: Number,
      default: 5
    }
  }
}
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

.skeleton-row {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cell-info {
  width: 35%;
}

.cell-type,
.cell-stage {
  width: 15%;
}

.cell-status {
  width: 12%;
}

.cell-date {
  width: 13%;
}

.cell-actions {
  width: 13%;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.title {
  width: 70%;
  height: 16px;
}

.skeleton-line.meta {
  width: 50%;
  height: 12px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-badge {
  width: 56px;
  height: 24px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

.skeleton-actions {
  display: flex;
  gap: 8px;
}

.skeleton-btn {
  width: 28px;
  height: 28px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
