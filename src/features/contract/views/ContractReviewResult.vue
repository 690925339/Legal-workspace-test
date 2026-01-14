<template>
  <div style="display: flex; height: 100vh; overflow: hidden">
    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        <i
          class="fas"
          :class="{
            'fa-info-circle': toast.type === 'info',
            'fa-check-circle': toast.type === 'success',
            'fa-exclamation-circle': toast.type === 'error'
          }"
        />
        {{ toast.message }}
      </div>
    </Transition>

    <!-- 左侧：文档预览 -->
    <div
      style="
        flex: 1;
        background: white;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e5e5e5;
      "
    >
      <!-- 文档工具栏 -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
        "
      >
        <div style="display: flex; align-items: center; gap: 12px">
          <i class="fas fa-file-pdf" style="color: #d32f2f; font-size: 16px" />
          <span style="font-size: 13px; font-weight: 500; color: #1a1a1a">b2b2c高级版合同模板</span>
        </div>
        <button class="smart-btn-primary" style="padding: 8px 20px" @click="goBack">
          <i class="fas fa-plus" /> 新审查
        </button>
      </div>

      <!-- 文档内容区域 -->
      <div style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5">
        <!-- 模拟PDF页面 -->
        <div
          style="
            background: white;
            max-width: 800px;
            margin: 0 auto;
            padding: 60px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            min-height: 100%;
          "
        >
          <!-- 文档头部 -->
          <div style="text-align: center; margin-bottom: 40px">
            <div style="display: inline-block; margin-bottom: 20px">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Ctext x='10' y='25' font-family='Arial' font-size='16' fill='%234a90e2'%3EJavashop%3C/text%3E%3C/svg%3E"
                alt="Logo"
                style="height: 30px"
              />
            </div>
            <div style="text-align: right; color: #e74c3c; font-size: 14px; margin-bottom: 20px">
              合同编号：Y.J20040901
            </div>
            <h1
              style="
                font-size: 32px;
                font-weight: 600;
                color: #1a1a1a;
                margin: 40px 0;
                letter-spacing: 8px;
              "
            >
              软<br />件<br />授<br />权<br />服<br />务<br />合<br />同
            </h1>
          </div>

          <!-- 文档正文 -->
          <div style="line-height: 2; color: #333; font-size: 14px">
            <p style="margin-bottom: 20px; text-indent: 2em">甲方（被授权方）：_______________</p>
            <p style="margin-bottom: 20px; text-indent: 2em">
              乙方（授权方）：易族智汇（北京）科技有限公司
            </p>
            <p style="margin-bottom: 20px; text-indent: 2em">
              根据《中华人民共和国合同法》及相关法律法规的规定，甲乙双方在平等、自愿、公平、诚实信用的基础上，就软件授权使用事宜达成如下协议：
            </p>

            <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0">
              第一条 授权内容
            </h3>
            <p style="margin-bottom: 15px; text-indent: 2em">
              乙方授予甲方易族智汇B2B2C网店系统（Javashop）的永久使用权，授权范围限于1个域名。
            </p>

            <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0">
              第二条 合同金额
            </h3>
            <p style="margin-bottom: 15px; text-indent: 2em">
              合同总金额为人民币壹拾万元整（￥100,000.00），分两期支付。
            </p>

            <h3 style="font-size: 16px; font-weight: 600; margin: 30px 0 15px 0">
              第三条 履行期限
            </h3>
            <p style="margin-bottom: 15px; text-indent: 2em">
              自2020年04月09日至2021年05月01日（源码升级权限期），售后支持有效期为合同生效后6个月内，Bug永久免费修复。
            </p>
          </div>

          <!-- 页码 -->
          <div
            style="
              text-align: center;
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
            "
          >
            <span style="font-size: 12px; color: #999">第 1 页 共 3 页</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：操作栏 -->
    <div style="flex: 1; background: white; display: flex; flex-direction: column">
      <!-- 步骤指示器 -->
      <div style="padding: 16px 20px; border-bottom: 1px solid #e5e5e5; flex-shrink: 0">
        <div style="display: flex; align-items: center; gap: 12px">
          <!-- 步骤1 -->
          <div :style="getStepStyle(1)" @click="goToStep(1)">
            <div :style="getStepIconStyle(1)">1</div>
            <span :style="getStepTextStyle(1)">合同概览</span>
          </div>

          <!-- 步骤2 -->
          <div :style="getStepStyle(2)" @click="goToStep(2)">
            <div :style="getStepIconStyle(2)">2</div>
            <span :style="getStepTextStyle(2)">审查清单</span>
          </div>

          <!-- 步骤3 -->
          <div :style="getStepStyle(3)" @click="goToStep(3)">
            <div :style="getStepIconStyle(3)">3</div>
            <span :style="getStepTextStyle(3)">审查结果</span>
          </div>
        </div>
      </div>

      <!-- 操作内容区域 -->
      <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
        <!-- 滚动内容区域 -->
        <div
          class="scroll-content"
          :class="{ 'step3-layout': currentStep === 3 }"
          :style="
            currentStep === 3
              ? 'flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 24px; padding-bottom: 0'
              : 'flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 0'
          "
        >
          <!-- 步骤1：合同概览 -->
          <template v-if="currentStep === 1">
            <!-- 审查方式 -->
            <div style="margin-bottom: 40px">
              <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1a1a1a">
                审查方式
              </h3>

              <!-- 合同类型 -->
              <div style="margin-bottom: 24px">
                <label
                  style="
                    display: block;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                  "
                  >合同类型</label
                >
                <select
                  v-model="contractType"
                  style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e5e5e5;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #1a1a1a;
                  "
                >
                  <option value="著作权许可使用合同">著作权许可使用合同</option>
                  <option value="技术服务合同">技术服务合同</option>
                  <option value="软件开发合同">软件开发合同</option>
                  <option value="采购合同">采购合同</option>
                </select>
              </div>

              <!-- 审查立场 -->
              <div style="margin-bottom: 24px">
                <label
                  style="
                    display: block;
                    margin-bottom: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                  "
                  >审查立场</label
                >
                <div style="display: flex; gap: 12px">
                  <label :style="getStanceStyle('party_a')">
                    <input
                      v-model="reviewStance"
                      type="radio"
                      name="stance"
                      value="party_a"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">甲方立场</span>
                  </label>
                  <label :style="getStanceStyle('party_b')">
                    <input
                      v-model="reviewStance"
                      type="radio"
                      name="stance"
                      value="party_b"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">乙方立场</span>
                  </label>
                  <label :style="getStanceStyle('neutral')">
                    <input
                      v-model="reviewStance"
                      type="radio"
                      name="stance"
                      value="neutral"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">中立立场</span>
                  </label>
                </div>
              </div>

              <!-- 审查尺度 -->
              <div style="margin-bottom: 24px">
                <label
                  style="
                    display: block;
                    margin-bottom: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                  "
                  >审查尺度</label
                >
                <div style="display: flex; gap: 12px">
                  <label :style="getIntensityStyle('strong')">
                    <input
                      v-model="reviewIntensity"
                      type="radio"
                      name="intensity"
                      value="strong"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">强势</span>
                  </label>
                  <label :style="getIntensityStyle('weak')">
                    <input
                      v-model="reviewIntensity"
                      type="radio"
                      name="intensity"
                      value="weak"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">弱势</span>
                  </label>
                  <label :style="getIntensityStyle('balanced')">
                    <input
                      v-model="reviewIntensity"
                      type="radio"
                      name="intensity"
                      value="balanced"
                      style="display: none"
                    />
                    <span style="font-size: 14px; color: #1a1a1a">均势</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 合同概览 -->
            <div style="margin-bottom: 32px">
              <h3 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1a1a1a">
                合同概览
              </h3>

              <!-- 甲方 -->
              <div style="margin-bottom: 20px">
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px">
                  甲方
                </div>
                <div style="font-size: 14px; color: #666">
                  {{ overview.partyA.label }}
                  <span style="color: #1a1a1a">{{ overview.partyA.value }}</span>
                </div>
              </div>

              <!-- 乙方 -->
              <div style="margin-bottom: 20px">
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px">
                  乙方
                </div>
                <div style="font-size: 14px; color: #1a1a1a">
                  {{ overview.partyB.label }}
                </div>
              </div>

              <!-- 合同总金额 -->
              <div style="margin-bottom: 20px">
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px">
                  合同总金额
                </div>
                <div style="font-size: 14px; color: #1a1a1a">
                  {{ overview.amount.label }}
                </div>
              </div>

              <!-- 履行期限 -->
              <div style="margin-bottom: 20px">
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px">
                  履行期限
                </div>
                <div style="font-size: 14px; color: #1a1a1a; line-height: 1.6">
                  {{ overview.period.label }}
                </div>
              </div>

              <!-- 内容概览 -->
              <div style="margin-bottom: 20px">
                <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px">
                  内容概览
                </div>
                <div style="font-size: 14px; color: #1a1a1a; line-height: 1.8">
                  {{ overview.content.label }}
                </div>
              </div>
            </div>
          </template>

          <!-- 步骤2：审查清单 -->
          <template v-else-if="currentStep === 2">
            <!-- 标题 -->
            <div style="margin-bottom: 24px">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a">
                审查清单：智能生成
              </h3>
            </div>

            <!-- 全选 -->
            <div
              style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: #f5f5f5;
                border-radius: 6px;
                margin-bottom: 16px;
                cursor: pointer;
              "
              @click="toggleAllChecklist"
            >
              <div
                :style="{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #1a73e8',
                  borderRadius: '4px',
                  background: allChecked ? '#1a73e8' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }"
              >
                <i v-if="allChecked" class="fas fa-check" style="color: white; font-size: 12px" />
              </div>
              <span style="font-size: 15px; font-weight: 600; color: #1a1a1a"
                >全部规则 ({{ checklistItems.length }})</span
              >
            </div>

            <!-- 清单项列表 -->
            <div style="margin-bottom: 24px">
              <div
                v-for="item in checklistItems"
                :key="item.id"
                style="
                  display: flex;
                  align-items: flex-start;
                  gap: 12px;
                  padding: 14px;
                  border-bottom: 1px solid #f0f0f0;
                  cursor: pointer;
                  transition: background 0.2s;
                "
                :style="{ background: item.checked ? 'white' : '#fafafa' }"
                @click="toggleChecklistItem(item.id)"
              >
                <div
                  :style="{
                    width: '20px',
                    height: '20px',
                    border: '2px solid ' + (item.checked ? '#1a73e8' : '#d0d0d0'),
                    borderRadius: '4px',
                    background: item.checked ? '#1a73e8' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }"
                >
                  <i
                    v-if="item.checked"
                    class="fas fa-check"
                    style="color: white; font-size: 12px"
                  />
                </div>
                <div style="flex: 1">
                  <span style="font-size: 14px; color: #1a1a1a; line-height: 1.6"
                    >{{ item.id }}. {{ item.text }}</span
                  >
                </div>
              </div>
            </div>
          </template>

          <!-- 步骤3：审查结果 -->
          <template v-else-if="currentStep === 3">
            <!-- 固定头部区域 -->
            <div class="review-header-fixed">
              <!-- 审查结果头部 -->
              <div style="margin-bottom: 24px">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px">
                  <div
                    style="
                      width: 48px;
                      height: 48px;
                      border-radius: 50%;
                      background: #1a73e8;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <i class="fas fa-file-contract" style="color: white; font-size: 20px" />
                  </div>
                  <div>
                    <h3
                      style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1a1a1a"
                    >
                      审查结果
                    </h3>
                    <p style="margin: 0; font-size: 13px; color: #999">
                      共审查{{ totalCount }}项，{{ completedCount }}项已完成
                    </p>
                  </div>
                </div>
              </div>

              <!-- 标签页 -->
              <div
                style="
                  display: flex;
                  gap: 24px;
                  border-bottom: 2px solid #f0f0f0;
                  margin-bottom: 20px;
                "
              >
                <div :style="getResultTabStyle('risk')" @click="activeResultTab = 'risk'">
                  <i
                    class="fas fa-shield-alt"
                    :style="{
                      color: activeResultTab === 'risk' ? '#1a73e8' : '#999',
                      fontSize: '14px'
                    }"
                  />
                  <span
                    :style="{
                      fontSize: '14px',
                      fontWeight: activeResultTab === 'risk' ? '600' : '400',
                      color: activeResultTab === 'risk' ? '#1a73e8' : '#666'
                    }"
                    >风险审查</span
                  >
                </div>
                <div :style="getResultTabStyle('subject')" @click="activeResultTab = 'subject'">
                  <i
                    class="fas fa-user-check"
                    :style="{
                      color: activeResultTab === 'subject' ? '#1a73e8' : '#999',
                      fontSize: '14px'
                    }"
                  />
                  <span
                    :style="{
                      fontSize: '14px',
                      fontWeight: activeResultTab === 'subject' ? '600' : '400',
                      color: activeResultTab === 'subject' ? '#1a73e8' : '#666'
                    }"
                    >主体审查</span
                  >
                </div>
              </div>

              <!-- 风险筛选 -->
              <div v-if="activeResultTab === 'risk'" class="risk-filter-bar">
                <label
                  class="risk-filter-item"
                  :class="{ active: riskFilters.high }"
                  @click="toggleRiskFilter('high')"
                >
                  <span class="filter-checkbox" :class="{ checked: riskFilters.high }">
                    <i v-if="riskFilters.high" class="fas fa-check" />
                  </span>
                  <span class="filter-dot high" />
                  <span class="filter-label">高风险 ({{ highRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: riskFilters.medium }"
                  @click="toggleRiskFilter('medium')"
                >
                  <span class="filter-checkbox" :class="{ checked: riskFilters.medium }">
                    <i v-if="riskFilters.medium" class="fas fa-check" />
                  </span>
                  <span class="filter-dot medium" />
                  <span class="filter-label">中风险 ({{ mediumRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: riskFilters.low }"
                  @click="toggleRiskFilter('low')"
                >
                  <span class="filter-checkbox" :class="{ checked: riskFilters.low }">
                    <i v-if="riskFilters.low" class="fas fa-check" />
                  </span>
                  <span class="filter-dot low" />
                  <span class="filter-label">低风险 ({{ lowRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: riskFilters.pass }"
                  @click="toggleRiskFilter('pass')"
                >
                  <span class="filter-checkbox" :class="{ checked: riskFilters.pass }">
                    <i v-if="riskFilters.pass" class="fas fa-check" />
                  </span>
                  <span class="filter-dot pass" />
                  <span class="filter-label">通过 ({{ passCount }})</span>
                </label>
              </div>

              <!-- 主体审查筛选 -->
              <div v-if="activeResultTab === 'subject'" class="risk-filter-bar">
                <label
                  class="risk-filter-item"
                  :class="{ active: subjectFilters.high }"
                  @click="toggleSubjectFilter('high')"
                >
                  <span class="filter-checkbox" :class="{ checked: subjectFilters.high }">
                    <i v-if="subjectFilters.high" class="fas fa-check" />
                  </span>
                  <span class="filter-dot high" />
                  <span class="filter-label">高风险 ({{ subjectHighRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: subjectFilters.medium }"
                  @click="toggleSubjectFilter('medium')"
                >
                  <span class="filter-checkbox" :class="{ checked: subjectFilters.medium }">
                    <i v-if="subjectFilters.medium" class="fas fa-check" />
                  </span>
                  <span class="filter-dot medium" />
                  <span class="filter-label">中风险 ({{ subjectMediumRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: subjectFilters.low }"
                  @click="toggleSubjectFilter('low')"
                >
                  <span class="filter-checkbox" :class="{ checked: subjectFilters.low }">
                    <i v-if="subjectFilters.low" class="fas fa-check" />
                  </span>
                  <span class="filter-dot low" />
                  <span class="filter-label">低风险 ({{ subjectLowRiskCount }})</span>
                </label>
                <label
                  class="risk-filter-item"
                  :class="{ active: subjectFilters.pass }"
                  @click="toggleSubjectFilter('pass')"
                >
                  <span class="filter-checkbox" :class="{ checked: subjectFilters.pass }">
                    <i v-if="subjectFilters.pass" class="fas fa-check" />
                  </span>
                  <span class="filter-dot pass" />
                  <span class="filter-label">通过 ({{ subjectPassCount }})</span>
                </label>
              </div>
            </div>

            <!-- 可滚动的列表区域 -->
            <div class="review-list-scroll">
              <!-- 风险审查结果列表 -->
              <div v-if="activeResultTab === 'risk'" class="review-results-list">
                <div
                  v-for="item in sortedReviewResults"
                  :key="item.id"
                  class="risk-card"
                  :class="{
                    'risk-high': item.risk === 'high',
                    'risk-medium': item.risk === 'medium',
                    'risk-low': item.risk === 'low',
                    'risk-pass': item.risk === 'pass',
                    expanded: item.expanded
                  }"
                >
                  <!-- 卡片头部 -->
                  <div class="risk-card-header" @click="toggleRiskItem(item.id)">
                    <!-- 风险指示器 -->
                    <div
                      class="risk-indicator"
                      :style="{
                        background:
                          item.risk === 'high'
                            ? '#f44336'
                            : item.risk === 'medium'
                              ? '#ff9800'
                              : item.risk === 'low'
                                ? '#fbbf24'
                                : '#22c55e'
                      }"
                    />

                    <!-- 文本 -->
                    <div class="risk-title">{{ item.id }}. {{ item.text }}</div>

                    <!-- 问题数量 -->
                    <div
                      class="risk-badge"
                      :class="{
                        'has-issues': item.issues > 0
                      }"
                    >
                      {{ item.issues }}
                    </div>

                    <!-- 展开/收起图标 -->
                    <i
                      v-if="item.details"
                      class="fas"
                      :class="item.expanded ? 'fa-chevron-up' : 'fa-chevron-down'"
                      style="color: #999; font-size: 12px"
                    />
                  </div>

                  <!-- 展开的详情区域 -->
                  <div v-if="item.expanded && item.details" class="risk-details">
                    <!-- 风险点 -->
                    <div
                      v-for="point in item.details.riskPoints"
                      :key="point.id"
                      class="risk-point"
                    >
                      <div class="risk-point-header">
                        <span class="risk-point-title">风险点{{ point.id }}</span>
                        <i class="fas fa-chevron-down" style="font-size: 12px; color: #666" />
                      </div>

                      <p class="risk-point-desc">
                        {{ point.description }}
                      </p>

                      <!-- 合同原文区域 -->
                      <div class="content-section">
                        <div class="content-main">
                          <div class="section-label">合同原文</div>
                          <div class="original-text">
                            {{ item.details.originalText }}
                          </div>
                        </div>
                        <button
                          class="action-link"
                          @click.stop="locateInDocument(item.details.location)"
                        >
                          <i class="fas fa-bullseye" /> 定位至原文
                        </button>
                      </div>

                      <!-- AI修改建议区域 - 接受后隐藏 -->
                      <div v-if="!item.accepted" class="suggestion-section-wrapper">
                        <!-- 标题行：标签 + 操作按钮 -->
                        <div class="section-header-row">
                          <div class="section-label">
                            建议<span class="highlight-text">更正</span>合同条款为：
                          </div>
                          <!-- 编辑时显示保存和取消按钮 -->
                          <div v-if="item.editing" class="edit-actions-horizontal">
                            <button
                              class="edit-action-btn confirm"
                              title="保存"
                              @click.stop="saveSuggestion(item.id)"
                            >
                              <i class="fas fa-check" />
                            </button>
                            <button
                              class="edit-action-btn cancel"
                              title="取消"
                              @click.stop="cancelEditSuggestion(item.id)"
                            >
                              <i class="fas fa-times" />
                            </button>
                          </div>
                          <!-- 非编辑时显示编辑按钮 -->
                          <button
                            v-else
                            class="action-link"
                            @click.stop="startEditSuggestion(item.id)"
                          >
                            <i class="fas fa-pen" /> 编辑
                          </button>
                        </div>
                        <!-- 内容区域 -->
                        <div v-if="!item.editing" class="suggestion-text">
                          {{ item.details.suggestion }}
                        </div>
                        <textarea
                          v-else
                          v-model="item.details.suggestion"
                          class="suggestion-editor"
                          rows="5"
                          @click.stop
                        />
                      </div>
                    </div>

                    <!-- 接受建议按钮 -->
                    <button
                      class="accept-btn"
                      :class="{ accepted: item.accepted }"
                      :disabled="item.accepted"
                      @click.stop="acceptSuggestion(item.id)"
                    >
                      <i :class="item.accepted ? 'fas fa-check' : ''" />
                      {{ item.accepted ? '已接受' : '接受建议并添加修订' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 主体审查结果列表 -->
              <div v-if="activeResultTab === 'subject'" class="review-results-list">
                <div
                  v-for="item in sortedSubjectResults"
                  :key="item.id"
                  class="risk-card"
                  :class="{
                    'risk-high': item.risk === 'high',
                    'risk-medium': item.risk === 'medium',
                    'risk-low': item.risk === 'low',
                    'risk-pass': item.risk === 'pass',
                    expanded: item.expanded
                  }"
                >
                  <!-- 卡片头部 -->
                  <div class="risk-card-header" @click="toggleSubjectItem(item.id)">
                    <!-- 风险指示器 -->
                    <div
                      class="risk-indicator"
                      :style="{
                        background:
                          item.risk === 'high'
                            ? '#f44336'
                            : item.risk === 'medium'
                              ? '#ff9800'
                              : item.risk === 'low'
                                ? '#fbbf24'
                                : '#22c55e'
                      }"
                    />

                    <!-- 卡片标题 -->
                    <div class="risk-title">{{ item.id }}. {{ item.text }}</div>

                    <!-- 问题数量 -->
                    <div class="risk-badge">
                      {{ item.issues }}
                    </div>

                    <!-- 展开图标 -->
                    <i
                      class="fas"
                      :class="item.expanded ? 'fa-chevron-up' : 'fa-chevron-down'"
                      style="color: #999; font-size: 12px; margin-left: 8px"
                    />
                  </div>

                  <!-- 展开详情 -->
                  <!-- 展开详情 -->
                  <div v-if="item.expanded && item.details" class="risk-details">
                    <div class="risk-point">
                      <div class="risk-point-header">
                        <span class="risk-point-title">风险点1</span>
                        <i class="fas fa-chevron-down" style="font-size: 12px; color: #666" />
                      </div>

                      <p class="risk-point-desc">
                        {{ item.details.description }}
                      </p>

                      <!-- 合同原文区域 -->
                      <div class="content-section">
                        <div class="content-main">
                          <div class="section-label">合同原文</div>
                          <div class="original-text">
                            {{ item.details.originalText }}
                          </div>
                        </div>
                        <button
                          class="action-link"
                          @click.stop="locateInDocument(item.details.location)"
                        >
                          <i class="fas fa-bullseye" /> 定位至原文
                        </button>
                      </div>

                      <!-- AI修改建议区域 - 接受后隐藏 -->
                      <div
                        v-if="!item.accepted && item.details.suggestion"
                        class="suggestion-section-wrapper"
                      >
                        <!-- 标题行：标签 + 操作按钮 -->
                        <div class="section-header-row">
                          <div class="section-label">
                            建议<span class="highlight-text">更正</span>合同条款为：
                          </div>
                          <!-- 编辑时显示保存和取消按钮 -->
                          <div v-if="item.editing" class="edit-actions-horizontal">
                            <button
                              class="edit-action-btn confirm"
                              title="保存"
                              @click.stop="saveSuggestion(item.id, 'subject')"
                            >
                              <i class="fas fa-check" />
                            </button>
                            <button
                              class="edit-action-btn cancel"
                              title="取消"
                              @click.stop="cancelEditSuggestion(item.id, 'subject')"
                            >
                              <i class="fas fa-times" />
                            </button>
                          </div>
                          <!-- 非编辑时显示编辑按钮 -->
                          <button
                            v-else
                            class="action-link"
                            @click.stop="startEditSuggestion(item.id, 'subject')"
                          >
                            <i class="fas fa-pen" /> 编辑
                          </button>
                        </div>
                        <!-- 内容区域 -->
                        <div v-if="!item.editing" class="suggestion-text">
                          {{ item.details.suggestion }}
                        </div>
                        <textarea
                          v-else
                          v-model="item.details.suggestion"
                          class="suggestion-editor"
                          rows="5"
                          @click.stop
                        />
                      </div>
                    </div>

                    <!-- 接受建议按钮 -->
                    <button
                      class="accept-btn"
                      :class="{ accepted: item.accepted }"
                      :disabled="item.accepted"
                      @click.stop="acceptSuggestion(item.id, 'subject')"
                    >
                      <i :class="item.accepted ? 'fas fa-check' : ''" />
                      {{ item.accepted ? '已接受' : '接受建议并添加修订' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 固定底部按钮区域 -->
        <div
          style="
            padding: 16px 24px;
            border-top: 1px solid #e5e5e5;
            background: white;
            flex-shrink: 0;
          "
        >
          <button
            v-if="currentStep === 1"
            class="smart-btn-primary"
            style="width: 100%; padding: 14px; font-size: 15px"
            @click="generateChecklist"
          >
            生成审查清单
          </button>
          <button
            v-else-if="currentStep === 2"
            class="smart-btn-primary"
            style="width: 100%; padding: 14px; font-size: 15px"
            @click="startReview"
          >
            发起审查
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Toast 提示状态
const toast = ref({
  show: false,
  message: '',
  type: 'info' // info, success, error
})

const showToast = (message, type = 'info') => {
  toast.value.message = message
  toast.value.type = type
  toast.value.show = true
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// State
const currentStep = ref(1) // 1: 合同概览, 2: 审查清单, 3: 审查结果
const contractType = ref('著作权许可使用合同')
const reviewStance = ref('party_a') // party_a: 甲方立场, party_b: 乙方立场, neutral: 中立立场
const reviewIntensity = ref('strong') // strong: 强势, weak: 弱势, balanced: 均势
const activeResultTab = ref('risk') // risk: 风险审查, subject: 主体审查

// Helper methods
const getResultTabStyle = tab => {
  const isActive = activeResultTab.value === tab
  return {
    padding: '8px 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: isActive ? '2px solid #1a73e8' : '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.3s'
  }
}

// 风险筛选状态（默认全选）
const riskFilters = ref({
  high: true,
  medium: true,
  low: true,
  pass: true
})

// 主体审查筛选状态（默认全选）
const subjectFilters = ref({
  high: true,
  medium: true,
  low: true,
  pass: true
})

// 合同概览（可编辑）
const overview = ref({
  partyA: {
    label: '被授权单位：',
    value: '（未填写）',
    editable: true
  },
  partyB: {
    label: '易族智汇（北京）科技有限公司',
    value: '',
    editable: false
  },
  amount: {
    label: '￥100000元（人民币拾万元整）',
    value: '',
    editable: false
  },
  period: {
    label:
      '自2020年04月09日至2021年05月01日（源码升级权限期），售后支持有效期为合同生效后6个月内，Bug永久免费修复',
    value: '',
    editable: false
  },
  content: {
    label:
      '该合同约定，甲方从乙方处购买易族智汇B2B2C网店系统（Javashop）的永久使用权，授权限于1个域名，含源代码交付、Git访问权限1年、技术支持及培训服务。合同总金额为10万元，分两期支付。乙方提供永久Bug修复，支持服务有效期6个月。甲方验收后3日内未反馈视为确认收货。',
    value: '',
    editable: false
  }
})

// 审查清单
const allChecked = ref(true)
const checklistItems = ref([
  { id: 1, text: '在合同公开性条款中，作品公开性审查', checked: true },
  { id: 2, text: '在合同交付条款中，物料交付与相关安排审查', checked: true },
  { id: 3, text: '在合同解除条款中，审查是否约定合同解除条件', checked: true },
  { id: 4, text: '在合同违约责任条款中，根据双方的合同义务确定违约责任', checked: true },
  {
    id: 5,
    text: '在合同争议解决条款中，争议解决的方式必须明确不能既约定诉讼又约定仲裁',
    checked: true
  },
  { id: 6, text: '在合同争议解决条款中，争议解决机构应当明确', checked: true },
  { id: 7, text: '是否有送达与通知条款', checked: true },
  { id: 8, text: '在合同形式与生效条款中，合同生效与签订日期审查', checked: true },
  { id: 9, text: '在合同主体条款中，审查合同当事人的名称（姓名）、住所等基本信息', checked: true },
  { id: 10, text: '在合同法律引用条款中，确保引用法律文件名称的准确性和有效性', checked: true },
  { id: 11, text: '在合同作品信息条款中，作品基本信息审查', checked: true },
  { id: 12, text: '在合同权属条款中，著作权权属与负担审查', checked: true }
])

// 审查结果

const reviewResults = ref([
  {
    id: 1,
    text: '在合同赔偿条款中，重要是否约定合同解除条款',
    risk: 'high',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      riskPoints: [
        {
          id: 1,
          title: '缺失合同解除条款',
          description:
            '甲类与某家合同约定赔偿方式应明确规避，组装、在合同赔偿条件可设置有合同解除条款，经乙方有权于1-5月15日内发出通付款通知但未支付的，甲方迟于7日内付款应有权拒绝交货、延迟发货或应当终止合同，但无乙方产权损害重大的约'
        }
      ],
      originalText:
        '果不可抗力影响合同的履行超过180天，双方就合同的进一步履行问题进行协商并达成一致意见。',
      suggestion:
        '合同修改第1：在下列情况下，乙方有权解除甲方合同条件：\n1. 甲方未按本合同约定发货约定期限内发货；\n2. 甲方迟延付款超过约定期限7日以上；\n3. 甲方违约导致合同目的无法实现。',
      location: { page: 5, paragraph: 7 }
    }
  },
  {
    id: 2,
    text: '在合同权利范围条款中，著作权财产权明确性审查',
    risk: 'high',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      riskPoints: [
        {
          id: 1,
          title: '著作权财产权范围不明确',
          description: '合同未明确约定著作权财产权的具体范围，可能导致权利边界模糊。'
        }
      ],
      originalText:
        '乙方授予甲方易族智汇B2B2C网店系统（Javashop）的永久使用权，授权范围限于1个域名。',
      suggestion:
        '建议明确约定：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权等具体权利的授权范围。',
      location: { page: 1, paragraph: 3 }
    }
  },
  {
    id: 3,
    text: '在合同许可使用权性质条款中，许可使用权性质审查',
    risk: 'high',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      riskPoints: [
        {
          id: 1,
          title: '许可使用权性质未明确',
          description: '未明确约定是独占许可、排他许可还是普通许可。'
        }
      ],
      originalText: '乙方授予甲方易族智汇B2B2C网店系统（Javashop）的永久使用权。',
      suggestion: '建议明确约定许可类型为"独占许可"或"排他许可"，并说明乙方是否保留自用权。',
      location: { page: 1, paragraph: 2 }
    }
  },
  {
    id: 4,
    text: '在合同期限条款中，许可使用期限审查',
    risk: 'medium',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      riskPoints: [
        {
          id: 1,
          title: '期限条款存在歧义',
          description: '永久使用权与源码升级权限期存在概念混淆。'
        }
      ],
      originalText:
        '自2020年04月09日至2021年05月01日（源码升级权限期），售后支持有效期为合同生效后6个月内。',
      suggestion: '建议区分"软件使用权期限"和"技术支持服务期限"，分别明确约定。',
      location: { page: 3, paragraph: 1 }
    }
  },
  {
    id: 5,
    text: '在合同报酬条款中，报酬支付方式审查',
    risk: 'medium',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      riskPoints: [
        {
          id: 1,
          title: '付款节点不明确',
          description: '分两期支付未明确各期付款时间节点和比例。'
        }
      ],
      originalText: '合同总金额为人民币壹拾万元整（￥100,000.00），分两期支付。',
      suggestion:
        '建议明确约定：\n1. 第一期：合同签订后X日内支付XX%；\n2. 第二期：验收合格后X日内支付XX%。',
      location: { page: 2, paragraph: 1 }
    }
  },
  {
    id: 6,
    text: '在合同公开性条款中，作品公开性审查',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  },
  {
    id: 7,
    text: '在合同交付条款中，物料交付与相关安排审查',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  },
  {
    id: 8,
    text: '在合同作品信息条款中，作品基本信息审查',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  },
  {
    id: 9,
    text: '在合同权属条款中，著作权权属与负担审查',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  }
])

// 主体审查结果数据
const subjectResults = ref([
  {
    id: 1,
    text: '在合同主体条款中，审查合同当事人的名称（姓名）、住所等基本信息',
    risk: 'medium',
    issues: 1,
    expanded: false,
    editing: false,
    accepted: false,
    details: {
      description:
        '合同中甲方名称与营业执照登记名称不一致，可能导致合同主体认定困难，影响合同效力。',
      title: '甲方主体信息缺失',
      originalText: '甲方：易族智汇科技有限公司\n地址：北京市海淀区中关村大街1号',
      suggestion:
        '甲方：易族智汇（北京）科技有限公司\n统一社会信用代码：91110108XXXXXXXXXX\n地址：北京市海淀区中关村大街1号创业大厦A座501室',
      location: { page: 1, paragraph: 1 }
    }
  },
  {
    id: 2,
    text: '在合同主体条款中，审查法定代表人或授权代表信息',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  },
  {
    id: 3,
    text: '在合同主体条款中，审查当事人的资质与经营范围',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  },
  {
    id: 4,
    text: '在合同主体条款中，审查联系方式及送达地址',
    risk: 'pass',
    issues: 0,
    expanded: false,
    editing: false,
    accepted: false,
    details: null
  }
])

// 风险排序和筛选
const riskOrder = { high: 0, medium: 1, low: 2, pass: 3 }
const sortedReviewResults = computed(() => {
  // 先筛选，再排序
  const filtered = reviewResults.value.filter(item => riskFilters.value[item.risk])
  return filtered.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])
})

// 主体审查排序和筛选
const sortedSubjectResults = computed(() => {
  const filtered = subjectResults.value.filter(item => subjectFilters.value[item.risk])
  return filtered.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])
})

// 切换筛选
const toggleRiskFilter = riskType => {
  riskFilters.value[riskType] = !riskFilters.value[riskType]
}

const toggleSubjectFilter = riskType => {
  subjectFilters.value[riskType] = !subjectFilters.value[riskType]
}

// 主体审查计数
const subjectHighRiskCount = computed(
  () => subjectResults.value.filter(item => item.risk === 'high').length
)
const subjectMediumRiskCount = computed(
  () => subjectResults.value.filter(item => item.risk === 'medium').length
)
const subjectLowRiskCount = computed(
  () => subjectResults.value.filter(item => item.risk === 'low').length
)
const subjectPassCount = computed(
  () => subjectResults.value.filter(item => item.risk === 'pass').length
)

// 切换主体审查项展开
const toggleSubjectItem = itemId => {
  const item = subjectResults.value.find(i => i.id === itemId)
  if (item && item.details) {
    item.expanded = !item.expanded
  }
}

// Computed
const highRiskCount = computed(
  () => reviewResults.value.filter(item => item.risk === 'high').length
)
const mediumRiskCount = computed(
  () => reviewResults.value.filter(item => item.risk === 'medium').length
)
const lowRiskCount = computed(() => reviewResults.value.filter(item => item.risk === 'low').length)
const passCount = computed(() => reviewResults.value.filter(item => item.risk === 'pass').length)
const completedCount = computed(() => reviewResults.value.length)
const totalCount = computed(() => checklistItems.value.length)

// Methods
const goToStep = step => {
  currentStep.value = step
}

const generateChecklist = () => {
  currentStep.value = 2
}

const toggleAllChecklist = () => {
  allChecked.value = !allChecked.value
  checklistItems.value.forEach(item => {
    item.checked = allChecked.value
  })
}

const toggleChecklistItem = itemId => {
  const item = checklistItems.value.find(i => i.id === itemId)
  if (item) {
    item.checked = !item.checked
  }
  allChecked.value = checklistItems.value.every(i => i.checked)
}

const startReview = () => {
  currentStep.value = 3
}

const goBack = () => {
  router.back()
}

// 审查结果交互方法
const toggleRiskItem = itemId => {
  const item = reviewResults.value.find(i => i.id === itemId)
  if (item && item.details) {
    item.expanded = !item.expanded
  }
}

const locateInDocument = location => {
  // 滚动左侧文档到对应位置
  console.log('定位到文档位置:', location)
  // TODO: 实现文档滚动定位功能
  alert(`已定位到第 ${location.page} 页，第 ${location.paragraph} 段`)
}

// 编辑建议相关方法
const originalSuggestions = ref({}) // 存储原始建议文本用于取消时恢复

const getListByType = type => {
  return type === 'subject' ? subjectResults.value : reviewResults.value
}

const startEditSuggestion = (itemId, type = 'risk') => {
  const list = getListByType(type)
  const item = list.find(i => i.id === itemId)
  if (item && item.details) {
    // 保存原始文本
    originalSuggestions.value[`${type}_${itemId}`] = item.details.suggestion
    item.editing = true
  }
}

const saveSuggestion = (itemId, type = 'risk') => {
  const list = getListByType(type)
  const item = list.find(i => i.id === itemId)
  if (item) {
    item.editing = false
    // 清除保存的原始文本
    delete originalSuggestions.value[`${type}_${itemId}`]
    showToast('修改已保存', 'success')
  }
}

const cancelEditSuggestion = (itemId, type = 'risk') => {
  const list = getListByType(type)
  const item = list.find(i => i.id === itemId)
  if (item && item.details) {
    // 恢复原始文本
    if (originalSuggestions.value[`${type}_${itemId}`]) {
      item.details.suggestion = originalSuggestions.value[`${type}_${itemId}`]
      delete originalSuggestions.value[`${type}_${itemId}`]
    }
    item.editing = false
  }
}

const acceptSuggestion = (itemId, type = 'risk') => {
  const list = getListByType(type)
  const item = list.find(i => i.id === itemId)
  if (item) {
    // 检查是否在编辑状态
    if (item.editing) {
      showToast('请先保存合同条款', 'info')
      return
    }
    item.accepted = !item.accepted
    if (item.accepted) {
      console.log('已接受建议:', item.details.suggestion)
      showToast('已添加修订建议', 'success')
      // TODO: 将修改建议应用到文档
    }
  }
}

// Helpers for dynamic styles (formerly in template)
const getStepStyle = step => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  background: currentStep.value === step ? '#f0f7ff' : 'transparent',
  flex: 1
})

const getStepIconStyle = step => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: currentStep.value === step ? '#1a73e8' : '#e5e5e5',
  color: currentStep.value === step ? 'white' : '#999',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '600',
  fontSize: '12px',
  flexShrink: 0
})

const getStepTextStyle = step => ({
  fontSize: '13px',
  color: currentStep.value === step ? '#1a73e8' : '#666',
  fontWeight: currentStep.value === step ? '500' : '400'
})

const getStanceStyle = stance => ({
  flex: 1,
  padding: '10px',
  border: reviewStance.value === stance ? '2px solid #1a73e8' : '1px solid #e5e5e5',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'center',
  background: reviewStance.value === stance ? '#f0f7ff' : 'white'
})

const getIntensityStyle = intensity => ({
  flex: 1,
  padding: '10px',
  border: reviewIntensity.value === intensity ? '2px solid #1a73e8' : '1px solid #e5e5e5',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'center',
  background: reviewIntensity.value === intensity ? '#f0f7ff' : 'white'
})
</script>

<style scoped>
/* Toast 提示样式 */
.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  z-index: 1000;
  color: #333;
}

.toast-notification.info {
  border-left: 4px solid #1a73e8;
}

.toast-notification.info i {
  color: #1a73e8;
}

.toast-notification.success {
  border-left: 4px solid #22c55e;
}

.toast-notification.success i {
  color: #22c55e;
}

.toast-notification.error {
  border-left: 4px solid #f44336;
}

.toast-notification.error i {
  color: #f44336;
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 风险筛选栏 */
.risk-filter-bar {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.risk-filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.risk-filter-item:hover {
  background: #f9fafb;
}

.risk-filter-item.active {
  border-bottom-color: #1a73e8;
}

.filter-checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: transparent;
  transition: all 0.2s;
}

.filter-checkbox.checked {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
}

.filter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.filter-dot.high {
  background: #f44336;
}

.filter-dot.medium {
  background: #ff9800;
}

.filter-dot.low {
  background: #fbbf24;
}

.filter-dot.pass {
  background: #22c55e;
}

.filter-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

/* 隐藏滚动条但保持滚动功能 */
.scroll-content {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scroll-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 审查结果固定头部 */
.review-header-fixed {
  flex-shrink: 0;
  background: white;
}

/* 审查结果可滚动列表区域 */
.review-list-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.review-list-scroll::-webkit-scrollbar {
  display: none;
}

.smart-btn-primary {
  /* Inherit global styles or define here */
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.smart-btn-primary:hover {
  background-color: #1557b0;
}

/* 审查结果列表样式 */
.review-results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 风险卡片基础样式 */
.risk-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
  transition: all 0.2s ease;
}

.risk-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.risk-card.risk-high {
  border-left: 4px solid #f44336;
}

.risk-card.risk-high.expanded {
  background: #fff5f5;
}

.risk-card.risk-medium {
  border-left: 4px solid #ff9800;
}

.risk-card.risk-medium.expanded {
  background: #fff8e1;
}

.risk-card.risk-low {
  border-left: 4px solid #fbbf24;
}

.risk-card.risk-pass {
  border-left: 4px solid #22c55e;
}

/* 卡片头部 */
.risk-card-header {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.risk-card-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.risk-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.risk-title {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  line-height: 1.5;
}

.risk-badge {
  padding: 4px 12px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.risk-badge.has-issues {
  background: #fee;
  color: #f44336;
}

/* 展开的详情区域 */
.risk-details {
  padding: 0 16px 16px;
  border-top: 1px solid #f0f0f0;
  background: white;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 风险点样式 */
.risk-point {
  margin-top: 16px;
}

.risk-point-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 12px;
}

.risk-point-title {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.risk-point-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 16px 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

/* 内容区域布局 - 左右结构 */
.content-section {
  display: flex;
  gap: 12px;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.content-main {
  flex: 1;
}

.section-label {
  font-weight: 500;
  color: #666;
  font-size: 13px;
  margin-bottom: 8px;
}

.highlight-text {
  color: #1a73e8;
  font-weight: 600;
}

/* 水平链接按钮 */
.action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #1a73e8;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  transition: all 0.2s;
}

.action-link:hover {
  color: #0d5bdb;
}

.action-link i {
  font-size: 12px;
}

/* 建议区域新布局 */
.suggestion-section-wrapper {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 水平编辑按钮容器 */
.edit-actions-horizontal {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 编辑操作按钮容器 - 垂直 */
.edit-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}

/* 编辑操作按钮 */
.edit-action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.edit-action-btn.confirm {
  background: transparent;
  color: #1a73e8;
}

.edit-action-btn.confirm:hover {
  background: rgba(26, 115, 232, 0.1);
}

.edit-action-btn.cancel {
  background: transparent;
  color: #999;
}

.edit-action-btn.cancel:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
}

.action-link i {
  font-size: 12px;
}

/* 竖排按钮样式 */
.action-btn-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #1a73e8;
  transition: all 0.2s;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.action-btn-vertical:hover {
  color: #0d5bdb;
  background: rgba(26, 115, 232, 0.08);
  border-radius: 4px;
}

.action-btn-vertical i {
  font-size: 14px;
  margin-bottom: 4px;
  writing-mode: horizontal-tb;
}

.action-btn-vertical span {
  writing-mode: horizontal-tb;
  line-height: 1.2;
}

/* 原有样式保留兼容 */
.original-text-section,
.suggestion-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header span {
  font-weight: 500;
  color: #666;
  font-size: 13px;
}

.action-btn {
  padding: 4px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #1a73e8;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  color: #0d5bdb;
  text-decoration: underline;
}

.action-btn i {
  font-size: 11px;
}

.original-text,
.suggestion-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

/* AI建议编辑器 */
.suggestion-editor {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #1a73e8;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.8;
  resize: vertical;
  font-family: inherit;
  background: white;
}

.suggestion-editor:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
}

/* 接受建议按钮 */
.accept-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #1a73e8, #0d5bdb);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.accept-btn:hover {
  background: linear-gradient(135deg, #1557b0, #0a48b0);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.accept-btn.accepted {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.accept-btn.accepted:hover {
  background: linear-gradient(135deg, #16a34a, #15803d);
}
</style>
