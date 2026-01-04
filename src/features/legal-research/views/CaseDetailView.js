import router from '@/router/index.js'

export default {
    name: 'CaseDetailView',
    data() {
        return {
            caseId: null,
            caseDetail: {
                title: '张志祥诉东辽县人民政府、东辽县自贵镇人民政府、东辽县城市管理行政执法局及东辽县自然资源局强制拆除违法建筑物及行政赔偿一案二审行政判决书',
                court: '吉林省高级人民法院',
                docType: '行政判决书',
                caseNumber: '(2020) 吉行终199号',
                fullText: `吉林省高级人民法院

行政判决书

（2020）吉行终199号

上诉人（原审原告）张志祥，男，1970年2月26日出生，汉族，住吉林省辽源市。

被上诉人（原审被告）东辽县人民政府，住所地吉林省辽源市东辽县东辽大街28号。

法定代表人王卫国，县长。

委托代理人周俊杰，东辽县人民政府法律顾问。

被上诉人（原审被告）东辽县自贵镇人民政府，住所地吉林省辽源市东辽县四合公路北50米。

法定代表人杜坤鹏，镇长。

出庭行政机关负责人张洪杰，副镇长。

委托代理人张波，东辽县自贵镇人民政府法律顾问。

被上诉人（原审被告）东辽县城市管理行政执法局，住所地吉林省辽源市东辽县自贵镇东辽大街28号。

法定代表人张志民，局长。

委托代理人张东辉，东辽县城市管理行政执法局法规科科员。

委托代理人吴洪君，吉林恒大律师事务所律师。

上诉人张志祥因诉被上诉人东辽县人民政府、东辽县自贵镇人民政府、东辽县城市管理行政执法局强制拆除违法建筑物及行政赔偿一案，不服吉林省辽源市中级人民法院（2020）吉04行初2号行政判决，向本院提起上诉。本院于2020年7月20日立案后，依法组成合议庭，于2020年9月10日公开开庭审理了本案。上诉人张志祥及其委托代理人吴洪君，被上诉人东辽县人民政府的委托代理人周俊杰，被上诉人东辽县自贵镇人民政府的出庭行政机关负责人张洪杰及委托代理人张波，被上诉人东辽县城市管理行政执法局的委托代理人张东辉、吴洪君到庭参加诉讼。本案现已审理终结。

原审法院认定，2019年11月15日，东辽县城市管理行政执法局作出东城管限拆字（2019）第001号《限期拆除违法建筑决定书》，认定张志祥在东辽县自贵镇建设家村土地上建设的建筑物属于违法建筑，责令其在2019年11月20日前自行拆除。张志祥未在规定期限内自行拆除。2019年12月3日，东辽县人民政府组织相关部门对张志祥位于东辽县自贵镇建设家村土地上的建筑物实施了强制拆除。

原审法院认为，根据《中华人民共和国行政强制法》第四十四条规定，对违法的建筑物、构筑物、设施等需要强制拆除的，应当由行政机关予以公告，限期当事人自行拆除。当事人在法定期限内不申请行政复议或者提起行政诉讼，又不拆除的，行政机关可以依法强制拆除。本案中，东辽县城市管理行政执法局作出《限期拆除违法建筑决定书》后，张志祥未在规定期限内自行拆除，也未在法定期限内申请行政复议或者提起行政诉讼。东辽县人民政府组织相关部门对张志祥的建筑物实施强制拆除，符合法律规定。但是，东辽县人民政府在实施强制拆除前，未依法履行催告程序，程序违法。依照《中华人民共和国行政诉讼法》第七十四条第二款第（一）项之规定，判决：确认被告东辽县人民政府组织的强制拆除张志祥位于东辽县自贵镇建设家村土地上的建筑物的行政行为违法。案件受理费50元，由被告东辽县人民政府负担。

张志祥不服原审判决，向本院提起上诉称：原审判决认定事实不清，适用法律错误。请求：撤销原审判决，改判支持上诉人的诉讼请求。

被上诉人东辽县人民政府、东辽县自贵镇人民政府、东辽县城市管理行政执法局答辩称：原审判决认定事实清楚，适用法律正确，请求驳回上诉，维持原判。

本院经审理查明的事实与原审法院查明的事实一致。

本院认为，根据《中华人民共和国行政强制法》第四十四条规定，对违法的建筑物、构筑物、设施等需要强制拆除的，应当由行政机关予以公告，限期当事人自行拆除。当事人在法定期限内不申请行政复议或者提起行政诉讼，又不拆除的，行政机关可以依法强制拆除。本案中，东辽县城市管理行政执法局作出《限期拆除违法建筑决定书》后，张志祥未在规定期限内自行拆除，也未在法定期限内申请行政复议或者提起行政诉讼。东辽县人民政府组织相关部门对张志祥的建筑物实施强制拆除，符合法律规定。但是，东辽县人民政府在实施强制拆除前，未依法履行催告程序，程序违法。原审判决认定事实清楚，适用法律正确，应予维持。

综上，依照《中华人民共和国行政诉讼法》第八十九条第一款第（一）项之规定，判决如下：

驳回上诉，维持原判。

二审案件受理费50元，由上诉人张志祥负担。

本判决为终审判决。

审判长  李明
审判员  王芳
审判员  张伟

二〇二〇年九月三十日
书记员  刘洋`
            }
        };
    },
    mounted() {
        // 从路由参数获取案例ID
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        this.caseId = urlParams.get('id') || '1';
    },
    methods: {
        goBack() {
            router.back();
        },
        downloadCase() {
            // 创建下载内容
            const content = `${this.caseDetail.title}\n\n${this.caseDetail.fullText}`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.caseDetail.caseNumber}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    },
    template: `
        <div class="smart-page" style="background: #fff; min-height: 100vh;">
            <div class="smart-container" style="max-width: 1000px; padding: 20px;">
                <!-- 顶部标题栏 -->
                <div style="padding: 20px 0; border-bottom: 2px solid #e5e5e5;">
                    <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.6;">
                        {{ caseDetail.title }}
                    </h1>
                    
                    <!-- 操作按钮 -->
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button class="smart-btn-secondary" @click="goBack" style="padding: 8px 16px;">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                        <div style="flex: 1;"></div>
                        <button class="smart-btn-secondary" @click="downloadCase" style="padding: 8px 16px;">
                            <i class="fas fa-download"></i> 原文下载
                        </button>
                    </div>
                </div>

                <!-- 原文内容 -->
                <div style="padding: 40px 0;">
                    <div style="background: #fafafa; padding: 40px; border-radius: 8px; line-height: 2; color: #1a1a1a; white-space: pre-wrap; font-size: 15px;">{{ caseDetail.fullText }}</div>
                </div>
            </div>
        </div>
    `
};
