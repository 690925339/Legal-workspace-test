/**
 * 案例检索排序和筛选 Mixin
 * 导入此mixin为CaseSearchResults添加排序和筛选功能
 */

export const searchFilterMixin = {
    data() {
        return {
            // 排序选项
            sortOptions: [
                { value: 'relevance', label: '相关度' },
                { value: 'date_desc', label: '时间降序' },
                { value: 'date_asc', label: '时间升序' }
            ],
            // 筛选条件
            selectedReferLevel: '',
            filterCaseTitle: '',
            filterCaseNo: ''
        };
    },

    methods: {
        /**
         * 切换排序方式
         */
        changeSortBy(sortValue) {
            this.sortBy = sortValue;
            this.showSortDropdown = false;
            this.currentPage = 1;
            this.searchCases();
        },

        /**
         * 获取当前排序标签
         */
        getSortLabel() {
            const option = this.sortOptions.find(o => o.value === this.sortBy);
            return option ? option.label : '相关度';
        },

        /**
         * 切换排序下拉菜单
         */
        toggleSortDropdown() {
            this.showSortDropdown = !this.showSortDropdown;
        },

        /**
         * 切换高级筛选面板
         */
        toggleAdvancedFilter() {
            this.showAdvancedFilter = !this.showAdvancedFilter;
        },

        /**
         * 切换案例类型
         */
        switchCategory(category) {
            this.activeCategory = category;
            const categoryMap = {
                'general': '',
                'public': '参考',
                'guide': '指导性'
            };
            this.selectedReferLevel = categoryMap[category] || '';
            this.currentPage = 1;
            this.searchCases();
        },

        /**
         * 应用筛选
         */
        applyFilter() {
            this.currentPage = 1;
            this.searchCases();
            this.showAdvancedFilter = false;
        },

        /**
         * 重置筛选
         */
        resetFilter() {
            this.selectedReferLevel = '';
            this.filterCaseTitle = '';
            this.filterCaseNo = '';
            this.activeCategory = 'general';
            this.applyFilter();
        },

        /**
         * 构建筛选条件
         */
        buildFilterCondition() {
            const filter = {};
            if (this.filterCaseTitle) {
                filter.caseTitle = this.filterCaseTitle;
            }
            if (this.filterCaseNo) {
                filter.caseNo = this.filterCaseNo;
            }
            return filter;
        },

        /**
         * 构建排序参数
         */
        buildSortParams() {
            if (this.sortBy === 'date_desc') {
                return { trialYearMonthDate: 'desc' };
            } else if (this.sortBy === 'date_asc') {
                return { trialYearMonthDate: 'asc' };
            }
            return {};
        }
    }
};
