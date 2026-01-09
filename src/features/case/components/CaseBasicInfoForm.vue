<template>
  <div class="smart-card section-card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-file-alt" />基础信息</div>
    </div>
    <div class="smart-card-content">
      <div class="smart-form-grid">
        <div class="smart-form-group full-width">
          <label class="smart-label required">案件名称</label>
          <input
            :value="form.name"
            type="text"
            placeholder="例如：ABC 公司诉 XYZ 有限公司合同纠纷案"
            class="smart-input"
            @input="$emit('update:form', { ...form, name: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">案件ID</label>
          <input
            :value="form.caseId"
            type="text"
            class="smart-input"
            disabled
            style="
              background: #f1f5f9;
              cursor: not-allowed;
              font-family: monospace;
              font-size: 12px;
            "
          />
          <span style="font-size: 11px; color: #94a3b8; margin-top: 4px">系统自动生成</span>
        </div>
        <div class="smart-form-group">
          <label class="smart-label">案号</label>
          <input
            :value="form.courtCaseNumber"
            type="text"
            placeholder="如 (2025)京0105民初67890号"
            class="smart-input"
            @input="$emit('update:form', { ...form, courtCaseNumber: $event.target.value })"
          />
          <span style="font-size: 11px; color: #94a3b8; margin-top: 4px"
            >法院正式案号，立案后填写</span
          >
        </div>
        <div class="smart-form-group">
          <label class="smart-label required">案由 (一级)</label>
          <select
            :value="form.type"
            class="smart-select"
            @change="$emit('update:form', { ...form, type: $event.target.value })"
          >
            <option value="">请选择...</option>
            <option value="民事">民事</option>
            <option value="刑事">刑事</option>
            <option value="行政">行政</option>
            <option value="知识产权">知识产权</option>
          </select>
        </div>
        <div class="smart-form-group">
          <label class="smart-label">具体案由</label>
          <input
            :value="form.legalCause"
            type="text"
            placeholder="例如：买卖合同纠纷"
            class="smart-input"
            @input="$emit('update:form', { ...form, legalCause: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">案件阶段</label>
          <select
            :value="form.caseStage"
            class="smart-select"
            @change="$emit('update:form', { ...form, caseStage: $event.target.value })"
          >
            <option value="">请选择...</option>
            <option value="咨询">咨询</option>
            <option value="立案">立案</option>
            <option value="一审">一审</option>
            <option value="二审">二审</option>
            <option value="执行">执行</option>
            <option value="结案">结案</option>
          </select>
        </div>
        <div class="smart-form-group">
          <label class="smart-label">管辖法院/机构</label>
          <input
            :value="form.court"
            type="text"
            placeholder="请输入受理法院"
            class="smart-input"
            @input="$emit('update:form', { ...form, court: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">承办法官</label>
          <input
            :value="form.judge"
            type="text"
            placeholder="请输入法官姓名"
            class="smart-input"
            @input="$emit('update:form', { ...form, judge: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">立案日期</label>
          <input
            :value="form.filingDate"
            type="date"
            class="smart-input"
            @input="$emit('update:form', { ...form, filingDate: $event.target.value })"
          />
        </div>
        <div class="smart-form-group">
          <label class="smart-label">诉讼时效/截止日</label>
          <input
            :value="form.deadline"
            type="date"
            class="smart-input"
            @input="$emit('update:form', { ...form, deadline: $event.target.value })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 案件基础信息表单组件
 * 提取自 CaseForm.vue，保持完全相同的 UI 和行为
 */
export default {
  name: 'CaseBasicInfoForm',
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  emits: ['update:form']
}
</script>
