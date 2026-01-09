<template>
  <div class="smart-card section-card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-align-left" />案情描述</div>
    </div>
    <div class="smart-card-content">
      <div class="smart-form-group full-width">
        <label class="smart-label">案情摘要</label>
        <textarea
          :value="form.description"
          class="smart-textarea bordered-textarea"
          rows="4"
          placeholder="请输入案件的详细背景和经过..."
          @input="$emit('update:form', { ...form, description: $event.target.value })"
        />
      </div>
      <div class="smart-form-group full-width">
        <label class="smart-label">争议焦点</label>
        <input
          :value="form.disputeFocus"
          type="text"
          placeholder="多个焦点请用逗号分隔"
          class="smart-input"
          @input="$emit('update:form', { ...form, disputeFocus: $event.target.value })"
        />
      </div>
      <div class="smart-form-group full-width">
        <label class="smart-label">客户诉求</label>
        <textarea
          :value="form.objective"
          class="smart-textarea bordered-textarea"
          rows="2"
          placeholder="请输入客户的具体诉求..."
          @input="$emit('update:form', { ...form, objective: $event.target.value })"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 案情描述表单组件
 * 提取自 CaseForm.vue，保持完全相同的 UI 和行为
 */
export default {
  name: 'CaseDescriptionForm',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  emits: ['update:form']
}
</script>
