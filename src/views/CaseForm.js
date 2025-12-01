import { router } from '../router.js';

export default {
    name: 'CaseForm',
    data() {
        return {
            isEdit: false,
            form: {
                name: '',
                type: '',
                client: '',
                opposingParty: '',
                court: '',
                amount: '',
                filingDate: new Date().toISOString().split('T')[0],
                description: ''
            }
        };
    },
    created() {
        // Check if editing
        const hash = window.location.hash;
        if (hash.includes('edit')) {
            this.isEdit = true;
            // In a real app, we would fetch data by ID. Here we simulate it.
            this.loadCaseData();
        }
    },
    methods: {
        loadCaseData() {
            // Simulate fetching data
            this.form = {
                name: 'ABC 公司诉 XYZ 有限公司合同纠纷案',
                type: 'civil',
                client: 'ABC 公司',
                opposingParty: 'XYZ 有限公司',
                court: '上海市浦东新区人民法院',
                amount: '500,000.00 CNY',
                filingDate: '2023-10-01',
                description: '因被告未按合同约定支付广告费用引发的纠纷。'
            };
        },
        saveCase() {
            if (!this.validateForm()) return;

            alert(this.isEdit ? '案件已更新！' : '案件已创建！');
            router.push('/');
        },
        saveAndNew() {
            if (!this.validateForm()) return;

            alert('案件已保存！');
            // Reset form
            this.form = {
                name: '',
                type: '',
                client: '',
                opposingParty: '',
                court: '',
                amount: '',
                filingDate: new Date().toISOString().split('T')[0],
                description: ''
            };
            this.isEdit = false;
            router.push('/create'); // Ensure we are on create route
        },
        cancel() {
            router.push('/');
        },
        validateForm() {
            if (!this.form.name) {
                alert('请输入案件名称');
                return false;
            }
            if (!this.form.type) {
                alert('请选择案件类型');
                return false;
            }
            if (!this.form.filingDate) {
                alert('请选择立案日期');
                return false;
            }
            return true;
        }
    },
    template: `
        <div class="case-form-page">
            <div class="o_control_panel">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a @click.prevent="cancel" href="#" style="text-decoration: none; color: #4c4c4c;">案件</a></li>
                    <li class="breadcrumb-item active">{{ isEdit ? '编辑' : '新建' }}</li>
                </ol>
                <div class="o_cp_buttons">
                    <button class="btn btn-primary" @click="saveCase"><i class="fas fa-save"></i> 保存</button>
                    <button class="btn btn-secondary" @click="cancel">取消</button>
                </div>
            </div>

            <div class="o_content">
                <div class="o_form_view">
                    <div class="o_form_sheet_bg">
                        <div class="o_form_sheet">
                            <div class="oe_title">
                                <h1>{{ isEdit ? '编辑案件' : '新建案件' }}</h1>
                            </div>

                            <form @submit.prevent>
                                <div class="form-group">
                                    <label class="required">案件名称</label>
                                    <input type="text" v-model="form.name" placeholder="请输入案件名称" class="form-control">
                                </div>

                                <div class="o_group">
                                    <div class="o_group_col">
                                        <div class="form-group">
                                            <label class="required">案件类型</label>
                                            <select v-model="form.type" class="form-control">
                                                <option value="">请选择...</option>
                                                <option value="civil">民事</option>
                                                <option value="criminal">刑事</option>
                                                <option value="administrative">行政</option>
                                                <option value="ip">知识产权</option>
                                                <option value="labor">劳动争议</option>
                                                <option value="other">其他</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label>客户名称</label>
                                            <input type="text" v-model="form.client" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label>受理机关</label>
                                            <input type="text" v-model="form.court" class="form-control">
                                        </div>
                                    </div>
                                    <div class="o_group_col">
                                        <div class="form-group">
                                            <label class="required">立案日期</label>
                                            <input type="date" v-model="form.filingDate" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label>对方当事人</label>
                                            <input type="text" v-model="form.opposingParty" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <label>涉案金额</label>
                                            <input type="text" v-model="form.amount" class="form-control">
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>案件描述</label>
                                    <textarea v-model="form.description" class="form-control" rows="4" placeholder="请输入案件的详细描述..."></textarea>
                                </div>

                                <div class="form-actions">
                                    <button type="button" class="btn btn-primary" @click="saveCase">
                                        <i class="fas fa-save"></i> 保存
                                    </button>
                                    <button v-if="!isEdit" type="button" class="btn btn-secondary" @click="saveAndNew">
                                        <i class="fas fa-plus"></i> 保存并新建
                                    </button>
                                    <button type="button" class="btn btn-secondary" @click="cancel">
                                        <i class="fas fa-times"></i> 取消
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
