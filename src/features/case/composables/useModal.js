import { ref } from 'vue'

/**
 * 模态框状态管理 Composable
 * 
 * 职责：
 * - 管理多个模态框的显示/隐藏状态
 * - 提供统一的打开/关闭接口
 */
export function useModal() {
    const modals = ref({})

    /**
     * 打开指定模态框
     * @param {string} name - 模态框名称
     */
    const openModal = (name) => {
        modals.value[name] = true
    }

    /**
     * 关闭指定模态框
     * @param {string} name - 模态框名称
     */
    const closeModal = (name) => {
        modals.value[name] = false
    }

    /**
     * 切换模态框状态
     * @param {string} name - 模态框名称
     */
    const toggleModal = (name) => {
        modals.value[name] = !modals.value[name]
    }

    /**
     * 检查模态框是否打开
     * @param {string} name - 模态框名称
     * @returns {boolean}
     */
    const isModalOpen = (name) => {
        return !!modals.value[name]
    }

    return {
        modals,
        openModal,
        closeModal,
        toggleModal,
        isModalOpen
    }
}
