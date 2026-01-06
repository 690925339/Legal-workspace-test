<template>
  <div v-if="isOpen" class="modal-overlay" style="z-index: 9999" @click.self="handleMaskClick">
    <div class="modal-container" style="width: 400px; max-width: 90vw">
      <div class="modal-header" :class="{ 'warning-header': type === 'danger' }">
        <div class="modal-title">
          <i
            class="fas"
            :class="type === 'danger' ? 'fa-exclamation-triangle' : 'fa-info-circle'"
            style="margin-right: 8px"
          ></i>
          {{ title }}
        </div>
        <button v-if="showClose" class="modal-close" @click="handleCancel">
          <i class="fas fa-times" />
        </button>
      </div>
      <div class="modal-body">
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 10px 0 20px 0">
          {{ message }}
        </p>
      </div>
      <div class="modal-footer">
        <button v-if="showCancel" class="smart-btn-secondary" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button
          :class="type === 'danger' ? 'smart-btn-danger' : 'smart-btn-primary'"
          :disabled="loading"
          @click="handleConfirm"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin" style="margin-right: 4px"></i>
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '确认'
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info' // info, danger
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    loading: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleMaskClick() {
      if (this.maskClosable) {
        this.handleCancel()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modal-fade-in 0.2s ease-out;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-header {
  border-bottom: 2px solid #ef4444 !important;
}

.warning-header .modal-title {
  color: #ef4444;
}

.modal-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #64748b;
}

.modal-body {
  padding: 20px;
  background: #fff;
}

.modal-footer {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.smart-btn-secondary {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.smart-btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.smart-btn-primary {
  background: #4f46e5;
  border: 1px solid #4f46e5;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.smart-btn-primary:hover {
  background: #4338ca;
  border-color: #4338ca;
}

.smart-btn-danger {
  background-color: #ef4444;
  color: white;
  border: 1px solid #ef4444;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.smart-btn-danger:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}
</style>
