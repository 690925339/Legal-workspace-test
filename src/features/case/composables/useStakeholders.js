import { ref } from 'vue'

/**
 * 当事人管理 Composable
 * 
 * 职责：
 * - 管理当事人列表（原告/被告/第三人）
 * - 提供增删改查操作
 * - 生成当事人摘要信息
 */
export function useStakeholders(initialData = {}) {
    const stakeholders = ref({
        plaintiffs: initialData.plaintiffs || [],
        defendants: initialData.defendants || [],
        thirdParties: initialData.thirdParties || []
    })

    const currentStakeholder = ref(null)
    const stakeholderType = ref('plaintiff')

    /**
     * 创建新当事人对象
     * @param {string} type - 当事人类型: 'plaintiff' | 'defendant' | 'thirdParty'
     * @returns {object} 新当事人对象
     */
    const addStakeholder = (type) => {
        stakeholderType.value = type
        currentStakeholder.value = {
            id: null,
            name: '',
            type: 'person',
            idNumber: '',
            phone: '',
            address: '',
            role: type === 'plaintiff' ? '原告' : (type === 'defendant' ? '被告' : '第三人'),
            legalRepresentative: '',
            creditCode: '',
            lawyer: '',
            contactName: '',
            contactRole: '',
            contactPhone: '',
            contactEmail: ''
        }
        return currentStakeholder.value
    }

    /**
     * 编辑当事人
     * @param {string} type - 当事人类型
     * @param {object} stakeholder - 当事人对象
     * @returns {object} 当事人副本
     */
    const editStakeholder = (type, stakeholder) => {
        stakeholderType.value = type
        currentStakeholder.value = JSON.parse(JSON.stringify(stakeholder))
        return currentStakeholder.value
    }

    /**
     * 删除当事人
     * @param {string} type - 当事人类型
     * @param {number} id - 当事人 ID
     */
    const deleteStakeholder = (type, id) => {
        const listName = type === 'plaintiff' ? 'plaintiffs' :
            (type === 'defendant' ? 'defendants' : 'thirdParties')
        stakeholders.value[listName] = stakeholders.value[listName].filter(item => item.id !== id)
    }

    /**
     * 保存当事人（新增或更新）
     * @throws {Error} 如果姓名为空
     */
    const saveStakeholder = () => {
        if (!currentStakeholder.value?.name) {
            throw new Error('请输入姓名/名称')
        }

        const listName = stakeholderType.value === 'plaintiff' ? 'plaintiffs' :
            (stakeholderType.value === 'defendant' ? 'defendants' : 'thirdParties')

        if (currentStakeholder.value.id) {
            // 更新现有当事人
            const index = stakeholders.value[listName].findIndex(
                item => item.id === currentStakeholder.value.id
            )
            if (index !== -1) {
                stakeholders.value[listName].splice(index, 1, currentStakeholder.value)
            }
        } else {
            // 新增当事人
            currentStakeholder.value.id = Date.now()
            stakeholders.value[listName].push(currentStakeholder.value)
        }
    }

    /**
     * 生成当事人摘要信息
     * @param {object} s - 当事人对象
     * @returns {string} 摘要字符串
     */
    const getStakeholderSummary = (s) => {
        const parts = []
        if (s.idNumber) parts.push(`身份证: ${s.idNumber}`)
        if (s.creditCode) parts.push(`信用代码: ${s.creditCode}`)
        if (s.legalRepresentative) parts.push(`法定代表人: ${s.legalRepresentative}`)
        if (s.phone) parts.push(`电话: ${s.phone}`)
        return parts.join(' | ')
    }

    return {
        stakeholders,
        currentStakeholder,
        stakeholderType,
        addStakeholder,
        editStakeholder,
        deleteStakeholder,
        saveStakeholder,
        getStakeholderSummary
    }
}
