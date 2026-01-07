<template>
  <CaseModuleLayout :case-id="caseId" active-module="facts" @case-loaded="onCaseLoaded">
    <div class="tab-pane">
      <div class="modern-card">
        <div class="card-header" style="background: transparent">
          <div class="card-title">案情描述</div>
          <button class="icon-btn" style="font-size: 14px" @click="editCaseFacts">
            <i class="fas fa-pen" />
          </button>
        </div>
        <div class="info-row" style="display: block">
          <span class="label" style="margin-bottom: 8px">案情摘要</span>
          <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.8; font-size: 14px">
            {{ factsData.description }}
          </p>
        </div>
        <div class="info-row" style="display: block; margin-top: 16px">
          <span class="label">争议焦点</span>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px">
            <span
              v-for="(focus, index) in factsData.disputeFocus"
              :key="index"
              class="tag"
              style="
                background: #e0e7ff;
                color: #4f46e5;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
              "
            >
              {{ focus }}
            </span>
          </div>
        </div>
        <div class="info-row" style="margin-top: 16px">
          <span class="label">客户诉求</span>
          <span class="value">{{ factsData.objective }}</span>
        </div>
      </div>
    </div>

    <!-- Case Facts Edit Modal -->
    <div v-if="showCaseFactsModal" class="modal-overlay" @click.self="showCaseFactsModal = false">
      <div class="modal-container" style="width: 700px">
        <div class="modal-header">
          <div class="modal-title">编辑案情描述</div>
          <button class="modal-close" @click="showCaseFactsModal = false">
            <i class="fas fa-times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="smart-form-group">
            <label class="smart-label">案情摘要</label>
            <textarea
              v-model="editForm.description"
              class="smart-textarea"
              rows="6"
              placeholder="请详细描述案件的基本情况"
              style="border: 1px solid #ccc"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">争议焦点</label>
            <textarea
              v-model="editForm.disputeFocus"
              class="smart-textarea"
              rows="4"
              placeholder="请输入案件的主要争议焦点，多个用逗号分隔"
              style="border: 1px solid #ccc"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">客户诉求</label>
            <textarea
              v-model="editForm.objective"
              class="smart-textarea"
              rows="3"
              placeholder="请输入客户的诉讼目标和诉求"
              style="border: 1px solid #ccc"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showCaseFactsModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveCaseFacts">
            <i class="fas fa-save" /> 保存
          </button>
        </div>
      </div>
    </div>
  </CaseModuleLayout>
</template>

<script>
import { ref } from 'vue'
import CaseModuleLayout from '@/components/case/CaseModuleLayout.js'
import { useCaseData, useModal } from '@/features/case/composables'

export default {
  name: 'CaseFacts',

  components: {
    CaseModuleLayout
  },

  setup() {
    // 使用 Composables
    const { caseId, caseData, onCaseLoaded } = useCaseData()
    const { openModal, closeModal, isModalOpen } = useModal()

    // 本地状态
    const factsData = ref({
      description:
        '2023年3月，原告张某与被告某科技有限公司签订软件开发合同，约定开发费用100万元。项目于2023年9月完成并交付，被告已支付50万元，剩余50万元尾款迟迟未支付。多次催款无果后，原告诉至法院。',
      disputeFocus: ['软件是否已实际交付', '质量验收是否合格', '违约损失金额'],
      objective: '支付剩余款项50万元 + 违约金8万元 + 利息'
    })

    const editForm = ref({})

    // 方法
    const editCaseFacts = () => {
      editForm.value = {
        description: factsData.value.description,
        disputeFocus: factsData.value.disputeFocus.join(', '),
        objective: factsData.value.objective
      }
      openModal('caseFacts')
    }

    const saveCaseFacts = () => {
      factsData.value.description = editForm.value.description
      factsData.value.disputeFocus = editForm.value.disputeFocus.split(',').map(s => s.trim())
      factsData.value.objective = editForm.value.objective
      closeModal('caseFacts')
      alert('案情描述已更新')
    }

    // 兼容模板中的 v-if 检查
    const showCaseFactsModal = () => isModalOpen('caseFacts')

    return {
      caseId,
      caseData,
      onCaseLoaded,
      factsData,
      editForm,
      showCaseFactsModal,
      editCaseFacts,
      saveCaseFacts,
      closeModal // Expose closeModal for template usage
    }
  }
}
</script>
