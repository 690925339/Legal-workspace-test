import { ref } from 'vue'
import { caseService } from '../services/caseService'

/**
 * 案件基础信息与案情描述逻辑 Composable
 * 
 * 职责：
 * - 管理基础信息表单状态与保存
 * - 管理案情描述表单状态与保存
 * - 管理争议焦点标签
 */
export function useCaseBasicInfo() {
    const editForm = ref({})
    const saving = ref(false)
    const newFocusInput = ref('')

    // 常用争议焦点选项
    const commonFocusOptions = [
        '合同效力',
        '违约责任',
        '赔偿金额',
        '交付标准',
        '工期延误',
        '质量异议',
        '付款条件',
        '解除合同'
    ]

    /**
     * 初始化基础信息表单
     * @param {object} data - 当前案件数据
     */
    const initBasicInfoForm = (data) => {
        editForm.value = {
            name: data.name,
            caseNumber: data.caseNumber, // 案件ID (只读)
            courtCaseNumber: data.courtCaseNumber || '', // 案号 (可编辑)
            type: data.type,
            category: data.category,
            court: data.court || '',
            filingDate: data.filingDate || '',
            stage: data.stage || '咨询'
        }
    }

    /**
     * 保存基础信息
     * @param {string|number} caseId 
     * @param {object} currentData - 当前显示的案件数据对象 (用于更新本地视图)
     */
    const saveBasicInfo = async (caseId, currentData) => {
        saving.value = true
        try {
            // 构建数据库更新数据
            const dbData = {
                case_title: editForm.value.name,
                court_case_number: editForm.value.courtCaseNumber || null,
                case_type: editForm.value.type,
                court: editForm.value.court,
                filing_date: editForm.value.filingDate || null,
                stage: editForm.value.stage
            }

            await caseService.update(caseId, dbData)

            // 更新本地状态
            Object.assign(currentData, {
                name: editForm.value.name,
                courtCaseNumber: editForm.value.courtCaseNumber,
                type: editForm.value.type,
                court: editForm.value.court,
                filingDate: editForm.value.filingDate,
                stage: editForm.value.stage
            })
        } finally {
            saving.value = false
        }
    }

    /**
     * 初始化案情描述表单
     * @param {object} factsData - 当前案情数据
     */
    const initFactsForm = (factsData) => {
        editForm.value = {
            description: factsData.description,
            disputeFocus: JSON.parse(JSON.stringify(factsData.disputeFocus || [])),
            objective: factsData.objective
        }
        newFocusInput.value = ''
    }

    /**
     * 保存案情描述
     * @param {string|number} caseId 
     * @param {object} caseData - 只读引用，实际上我们需要更新触发 update
     * 注意：CaseBasicInfo.vue 中 factsData 是 computed，更新 caseData 会触发它更新
     */
    const saveCaseFacts = async (caseId, caseDataRef) => {
        saving.value = true
        try {
            const dbData = {
                description: editForm.value.description,
                dispute_focus: editForm.value.disputeFocus,
                objective: editForm.value.objective
            }

            await caseService.update(caseId, dbData)

            // 更新本地状态
            caseDataRef.description = editForm.value.description
            caseDataRef.disputeFocus = editForm.value.disputeFocus
            caseDataRef.objective = editForm.value.objective
        } finally {
            saving.value = false
        }
    }

    // --- 标签管理逻辑 ---

    const addFocusTag = () => {
        const val = newFocusInput.value.trim()
        if (val && !editForm.value.disputeFocus.includes(val)) {
            editForm.value.disputeFocus.push(val)
        }
        newFocusInput.value = ''
    }

    const removeFocusTag = (index) => {
        editForm.value.disputeFocus.splice(index, 1)
    }

    const addCommonFocus = (focus) => {
        if (!editForm.value.disputeFocus.includes(focus)) {
            editForm.value.disputeFocus.push(focus)
        }
    }

    return {
        editForm,
        saving,
        newFocusInput,
        commonFocusOptions,
        initBasicInfoForm,
        saveBasicInfo,
        initFactsForm,
        saveCaseFacts,
        addFocusTag,
        removeFocusTag,
        addCommonFocus
    }
}
