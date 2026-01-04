import { ref } from 'vue'

/**
 * 标签管理 Composable
 * 
 * 职责：
 * - 管理标签列表（争议焦点、证据分类等）
 * - 提供添加/删除标签功能
 * - 支持常用标签快速选择
 */
export function useTags(initialTags = []) {
    const tags = ref([...initialTags])
    const newTagInput = ref('')

    /**
     * 添加新标签
     * 自动去重和去空格
     */
    const addTag = () => {
        const val = newTagInput.value.trim()
        if (val && !tags.value.includes(val)) {
            tags.value.push(val)
        }
        newTagInput.value = ''
    }

    /**
     * 删除指定位置的标签
     * @param {number} index - 标签索引
     */
    const removeTag = (index) => {
        tags.value.splice(index, 1)
    }

    /**
     * 快速添加常用标签
     * @param {string} tag - 标签内容
     */
    const addCommonTag = (tag) => {
        if (!tags.value.includes(tag)) {
            tags.value.push(tag)
        }
    }

    /**
     * 清空所有标签
     */
    const clearTags = () => {
        tags.value = []
    }

    /**
     * 设置标签列表
     * @param {array} newTags - 新的标签数组
     */
    const setTags = (newTags) => {
        tags.value = [...newTags]
    }

    return {
        tags,
        newTagInput,
        addTag,
        removeTag,
        addCommonTag,
        clearTags,
        setTags
    }
}
