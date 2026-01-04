<template>
  <div
    v-if="visible"
    class="modal-overlay"
    @click.self="close"
  >
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-title">
          {{ title }}
        </div>
        <button
          class="modal-close"
          @click="close"
        >
          <i class="fas fa-times" />
        </button>
      </div>
      
      <!-- Tabs -->
      <div
        v-if="tabs.length > 0"
        class="tabs-container"
      >
        <button 
          v-for="tab in tabs" 
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="switchTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
      
      <div class="modal-body">
        <div
          v-if="filteredRecords.length === 0"
          class="empty-state"
        >
          <p>暂无历史记录</p>
        </div>
        <div
          v-else
          class="history-list"
        >
          <div 
            v-for="record in filteredRecords" 
            :key="record.id" 
            class="history-item"
            @click="selectRecord($event, record)"
          >
            <div class="record-title">
              {{ record.title }}
            </div>
            <button 
              class="delete-btn" 
              title="删除此记录"
              @click.stop.prevent="deleteRecord($event, record)"
            >
              <i class="fas fa-trash-alt" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '历史记录'
    },
    records: {
      type: Array,
      default: () => []
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:visible', 'select', 'delete'],
  data() {
    return {
      activeTab: ''
    }
  },
  computed: {
    filteredRecords() {
      let records = this.records
      if (this.tabs.length > 0 && this.activeTab) {
        records = records.filter(r => r.type === this.activeTab)
      }
      return [...records].sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
    }
  },
  watch: {
    visible(val) {
      if (val && this.tabs.length > 0) {
        this.activeTab = this.tabs[0]
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    selectRecord(event, record) {
      // 检查点击是否来自删除按钮
      if (event && event.target) {
        const target = event.target;
        if (target.closest('.delete-btn')) {
          // 如果点击的是删除按钮，不触发选择
          return;
        }
      }
      this.$emit('select', record)
      this.close()
    },
    switchTab(tab) {
      this.activeTab = tab
    },
    deleteRecord(event, record) {
      // 确保事件不会冒泡到父元素
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.$emit('delete', record)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 500px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: none;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  color: #999;
}

.tabs-container {
  display: flex;
  gap: 0;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-button {
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #999;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}

.tab-button.active {
  color: #1a1a1a;
  font-weight: 500;
  border-bottom-color: #1a1a1a;
}

.modal-body {
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: #999;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.history-item {
  padding: 12px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f9fafb;
}

.record-title {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-btn {
  opacity: 0;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: #e53e3e;
}
</style>
