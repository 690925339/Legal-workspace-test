<template>
  <CaseModuleLayout :case-id="caseId" active-module="basic" @case-loaded="onCaseLoaded">
    <div class="tab-pane">
      <!-- 顶部双栏容器 (基础信息 + 案情描述) -->
      <div style="display: grid; grid-template-columns: 450px 1fr; gap: 24px; margin-bottom: 24px">
        <!-- 1. 左侧：基础信息 (2列布局) -->
        <div class="modern-card" style="height: 100%">
          <div class="card-header" style="background: transparent">
            <div class="card-title">案件总览</div>
            <button class="icon-btn" style="font-size: 14px" @click="editBasicInfo">
              <i class="fas fa-pen" />
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 20px">
            <div class="info-row" style="grid-column: span 2">
              <span class="label">案件标题</span>
              <span class="value">{{ caseData.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">案件编号</span>
              <span class="value">{{ caseData.id }}</span>
            </div>
            <div class="info-row">
              <span class="label">案件状态</span>
              <span class="value">
                <span class="tag" :style="getStatusStyle(caseData.statusCode)" style="margin: 0">
                  {{ caseData.status }}
                </span>
              </span>
            </div>

            <div class="info-row">
              <span class="label">案由</span>
              <span class="value">{{ caseData.type }}</span>
            </div>
            <div class="info-row">
              <span class="label">案件阶段</span>
              <span class="value">{{ caseData.stage || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">管辖法院</span>
              <span class="value">{{ caseData.court || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">负责人</span>
              <span class="value">{{ caseData.assignee }}</span>
            </div>
            <div class="info-row">
              <span class="label">立案日期</span>
              <span class="value">{{ caseData.filingDate || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">最后更新</span>
              <span class="value">{{ caseData.lastUpdate }}</span>
            </div>

            <div class="info-row" style="grid-column: span 2">
              <span class="label">诉讼时效/上诉截止日</span>
              <span class="value" style="color: #dc2626; font-weight: 500">{{
                caseData.deadline || '-'
              }}</span>
            </div>
          </div>
        </div>

        <!-- 2. 右侧：案情描述 (高度自适应) -->
        <div class="modern-card" style="height: 100%">
          <div class="card-header" style="background: transparent">
            <div class="card-title">案情描述</div>
            <button class="icon-btn" style="font-size: 14px" @click="editCaseFacts">
              <i class="fas fa-pen" />
            </button>
          </div>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px">
            <p
              style="
                margin: 0;
                color: #334155;
                line-height: 1.8;
                font-size: 14px;
                text-align: justify;
              "
            >
              {{ factsData.description }}
            </p>
          </div>
          <div class="info-row" style="display: block; margin-bottom: 16px">
            <span class="label">争议焦点</span>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px">
              <span
                v-for="(focus, index) in factsData.disputeFocus"
                :key="index"
                class="tag"
                style="
                  background: #e0e7ff;
                  color: #4f46e5;
                  padding: 4px 10px;
                  border-radius: 6px;
                  font-size: 13px;
                "
              >
                {{ focus }}
              </span>
            </div>
          </div>
          <div class="info-row">
            <span class="label">客户诉求</span>
            <span class="value">{{ factsData.objective }}</span>
          </div>
        </div>
      </div>

      <!-- 3. 底部：当事人信息 (列表式) -->
      <div class="modern-card" style="margin-bottom: 24px">
        <div
          class="card-header"
          style="
            background: transparent;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 12px;
            margin-bottom: 12px;
          "
        >
          <div class="card-title">当事人信息</div>
          <div style="display: flex; gap: 8px">
            <button
              class="smart-btn-secondary"
              style="font-size: 12px; padding: 4px 10px"
              @click="addStakeholder('plaintiff')"
            >
              <i class="fas fa-plus" /> 原告
            </button>
            <button
              class="smart-btn-secondary"
              style="font-size: 12px; padding: 4px 10px"
              @click="addStakeholder('defendant')"
            >
              <i class="fas fa-plus" /> 被告
            </button>
            <button
              class="smart-btn-secondary"
              style="font-size: 12px; padding: 4px 10px"
              @click="addStakeholder('thirdParty')"
            >
              <i class="fas fa-plus" /> 第三人
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <!-- 原告列表 -->
          <div>
            <div
              style="
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
              "
            >
              <span
                style="
                  display: inline-block;
                  width: 4px;
                  height: 14px;
                  background: #4f46e5;
                  margin-right: 8px;
                  border-radius: 2px;
                "
              />
              原告 ({{ stakeholders.plaintiffs.length }})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px">
              <div
                v-for="item in stakeholders.plaintiffs"
                :key="item.id"
                style="
                  display: flex;
                  flex-direction: column;
                  padding: 12px 16px;
                  background: #fff;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  transition: all 0.2s;
                "
              >
                <div style="display: flex; align-items: center; justify-content: space-between">
                  <div style="display: flex; align-items: center; gap: 12px">
                    <div
                      style="
                        width: 32px;
                        height: 32px;
                        background: #eef2ff;
                        color: #4f46e5;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                      "
                    >
                      <i class="fas" :class="item.type === 'person' ? 'fa-user' : 'fa-building'" />
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px">
                        {{ item.name }}
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 2px">
                        {{ getStakeholderSummary(item) }}
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px">
                    <button class="icon-btn" @click="editStakeholder('plaintiff', item)">
                      <i class="fas fa-edit" />
                    </button>
                    <button
                      class="icon-btn"
                      style="color: #ef4444"
                      @click="deleteStakeholder('plaintiff', item.id)"
                    >
                      <i class="fas fa-trash-alt" />
                    </button>
                  </div>
                </div>
                <div
                  v-if="item.contactName"
                  style="
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px dashed #f1f5f9;
                    font-size: 13px;
                    color: #64748b;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                  "
                >
                  <span
                    ><i class="fas fa-user-tie" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactName
                    }}
                    <span v-if="item.contactRole">({{ item.contactRole }})</span></span
                  >
                  <span v-if="item.contactPhone"
                    ><i class="fas fa-phone-alt" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactPhone
                    }}</span
                  >
                  <span v-if="item.contactEmail"
                    ><i class="fas fa-envelope" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactEmail
                    }}</span
                  >
                </div>
              </div>
              <div
                v-if="stakeholders.plaintiffs.length === 0"
                style="
                  padding: 12px;
                  text-align: center;
                  color: #94a3b8;
                  font-size: 13px;
                  border: 1px dashed #e2e8f0;
                  border-radius: 8px;
                "
              >
                暂无原告信息
              </div>
            </div>
          </div>

          <!-- 被告列表 -->
          <div>
            <div
              style="
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
              "
            >
              <span
                style="
                  display: inline-block;
                  width: 4px;
                  height: 14px;
                  background: #dc2626;
                  margin-right: 8px;
                  border-radius: 2px;
                "
              />
              被告 ({{ stakeholders.defendants.length }})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px">
              <div
                v-for="item in stakeholders.defendants"
                :key="item.id"
                style="
                  display: flex;
                  flex-direction: column;
                  padding: 12px 16px;
                  background: #fff;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  transition: all 0.2s;
                "
              >
                <div style="display: flex; align-items: center; justify-content: space-between">
                  <div style="display: flex; align-items: center; gap: 12px">
                    <div
                      style="
                        width: 32px;
                        height: 32px;
                        background: #fef2f2;
                        color: #dc2626;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                      "
                    >
                      <i class="fas" :class="item.type === 'person' ? 'fa-user' : 'fa-building'" />
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px">
                        {{ item.name }}
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 2px">
                        {{ getStakeholderSummary(item) }}
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px">
                    <button class="icon-btn" @click="editStakeholder('defendant', item)">
                      <i class="fas fa-edit" />
                    </button>
                    <button
                      class="icon-btn"
                      style="color: #ef4444"
                      @click="deleteStakeholder('defendant', item.id)"
                    >
                      <i class="fas fa-trash-alt" />
                    </button>
                  </div>
                </div>
                <div
                  v-if="item.contactName"
                  style="
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px dashed #f1f5f9;
                    font-size: 13px;
                    color: #64748b;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                  "
                >
                  <span
                    ><i class="fas fa-user-tie" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactName
                    }}
                    <span v-if="item.contactRole">({{ item.contactRole }})</span></span
                  >
                  <span v-if="item.contactPhone"
                    ><i class="fas fa-phone-alt" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactPhone
                    }}</span
                  >
                  <span v-if="item.contactEmail"
                    ><i class="fas fa-envelope" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactEmail
                    }}</span
                  >
                </div>
              </div>
              <div
                v-if="stakeholders.defendants.length === 0"
                style="
                  padding: 12px;
                  text-align: center;
                  color: #94a3b8;
                  font-size: 13px;
                  border: 1px dashed #e2e8f0;
                  border-radius: 8px;
                "
              >
                暂无被告信息
              </div>
            </div>
          </div>

          <!-- 第三人列表 -->
          <div v-if="stakeholders.thirdParties.length > 0">
            <div
              style="
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
              "
            >
              <span
                style="
                  display: inline-block;
                  width: 4px;
                  height: 14px;
                  background: #d97706;
                  margin-right: 8px;
                  border-radius: 2px;
                "
              />
              第三人 ({{ stakeholders.thirdParties.length }})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px">
              <div
                v-for="item in stakeholders.thirdParties"
                :key="item.id"
                style="
                  display: flex;
                  flex-direction: column;
                  padding: 12px 16px;
                  background: #fff;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  transition: all 0.2s;
                "
              >
                <div style="display: flex; align-items: center; justify-content: space-between">
                  <div style="display: flex; align-items: center; gap: 12px">
                    <div
                      style="
                        width: 32px;
                        height: 32px;
                        background: #fffbeb;
                        color: #d97706;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                      "
                    >
                      <i class="fas" :class="item.type === 'person' ? 'fa-user' : 'fa-building'" />
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #1e293b; font-size: 14px">
                        {{ item.name }}
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 2px">
                        {{ getStakeholderSummary(item) }}
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; gap: 8px">
                    <button class="icon-btn" @click="editStakeholder('thirdParty', item)">
                      <i class="fas fa-edit" />
                    </button>
                    <button
                      class="icon-btn"
                      style="color: #ef4444"
                      @click="deleteStakeholder('thirdParty', item.id)"
                    >
                      <i class="fas fa-trash-alt" />
                    </button>
                  </div>
                </div>
                <div
                  v-if="item.contactName"
                  style="
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px dashed #f1f5f9;
                    font-size: 13px;
                    color: #64748b;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                  "
                >
                  <span
                    ><i class="fas fa-user-tie" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactName
                    }}
                    <span v-if="item.contactRole">({{ item.contactRole }})</span></span
                  >
                  <span v-if="item.contactPhone"
                    ><i class="fas fa-phone-alt" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactPhone
                    }}</span
                  >
                  <span v-if="item.contactEmail"
                    ><i class="fas fa-envelope" style="margin-right: 6px; color: #94a3b8" />{{
                      item.contactEmail
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- 1. Basic Info Modal -->
    <div v-if="showBasicInfoModal" class="modal-overlay" @click.self="showBasicInfoModal = false">
      <div class="modal-container" style="width: 600px">
        <div class="modal-header">
          <div class="modal-title">编辑基础信息</div>
          <button class="modal-close" @click="showBasicInfoModal = false">
            <i class="fas fa-times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="smart-form-group">
            <label class="smart-label required">案件名称</label
            ><input v-model="editForm.name" type="text" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">案件编号</label
            ><input v-model="editForm.id" type="text" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">案由</label
            ><input v-model="editForm.type" type="text" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">具体案由</label
            ><input v-model="editForm.category" type="text" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">管辖法院</label
            ><input v-model="editForm.court" type="text" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">立案日期</label
            ><input v-model="editForm.filingDate" type="date" class="smart-input" />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">案件阶段</label>
            <select v-model="editForm.stage" class="smart-select">
              <option v-for="stage in stageOptions" :key="stage" :value="stage">
                {{ stage }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showBasicInfoModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveBasicInfo">保存</button>
        </div>
      </div>
    </div>

    <!-- 2. Facts Modal -->
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
              style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px"
            />
          </div>
          <div class="smart-form-group">
            <label class="smart-label">争议焦点 (回车添加)</label>

            <!-- 标签输入区域 -->
            <div
              style="
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 4px 8px;
                min-height: 40px;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                background: #fff;
                align-items: center;
              "
            >
              <!-- 已选标签 -->
              <span
                v-for="(focus, index) in editForm.disputeFocus"
                :key="index"
                class="tag"
                style="
                  background: #e0e7ff;
                  color: #4f46e5;
                  margin: 0;
                  padding: 4px 10px;
                  border-radius: 16px;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                "
              >
                {{ focus }}
                <i
                  class="fas fa-times"
                  style="cursor: pointer; opacity: 0.6"
                  @click="removeFocusTag(index)"
                />
              </span>

              <!-- 输入框 -->
              <input
                v-model="newFocusInput"
                type="text"
                placeholder="输入焦点并回车..."
                style="
                  border: none;
                  outline: none;
                  flex: 1;
                  padding: 4px;
                  font-size: 14px;
                  min-width: 120px;
                "
                @keydown.enter.prevent="addFocusTag"
                @blur="addFocusTag"
              />
            </div>

            <!-- 常用选项 -->
            <div style="margin-top: 8px; font-size: 12px; color: #64748b">
              推荐标签：
              <span
                v-for="opt in commonFocusOptions"
                :key="opt"
                style="
                  cursor: pointer;
                  margin-right: 8px;
                  display: inline-block;
                  padding: 2px 8px;
                  background: #f1f5f9;
                  border-radius: 12px;
                  margin-bottom: 4px;
                "
                @click="addCommonFocus(opt)"
              >
                + {{ opt }}
              </span>
            </div>
          </div>
          <div class="smart-form-group">
            <label class="smart-label">客户诉求</label>
            <textarea
              v-model="editForm.objective"
              class="smart-textarea"
              rows="3"
              style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showCaseFactsModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveCaseFacts">保存</button>
        </div>
      </div>
    </div>

    <!-- 3. Stakeholder Modal -->
    <div
      v-if="showStakeholderModal"
      class="modal-overlay"
      @click.self="showStakeholderModal = false"
    >
      <div class="modal-container" style="width: 600px">
        <div class="modal-header">
          <div class="modal-title">
            {{ currentStakeholder.id ? '编辑' : '添加' }}{{ currentStakeholder.role }}
          </div>
          <button class="modal-close" @click="showStakeholderModal = false">
            <i class="fas fa-times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="smart-form-group">
            <label class="smart-label">主体类型</label>
            <div style="display: flex; gap: 16px">
              <label
                ><input v-model="currentStakeholder.type" type="radio" value="person" />
                自然人</label
              >
              <label
                ><input v-model="currentStakeholder.type" type="radio" value="company" />
                法人/组织</label
              >
            </div>
          </div>
          <div class="smart-form-group">
            <label class="smart-label required">姓名/名称</label>
            <input v-model="currentStakeholder.name" type="text" class="smart-input" />
          </div>
          <template v-if="currentStakeholder.type === 'person'">
            <div class="smart-form-group">
              <label class="smart-label">身份证号</label
              ><input v-model="currentStakeholder.idNumber" type="text" class="smart-input" />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">电话</label
              ><input v-model="currentStakeholder.phone" type="text" class="smart-input" />
            </div>
          </template>
          <template v-if="currentStakeholder.type === 'company'">
            <div class="smart-form-group">
              <label class="smart-label">信用代码</label
              ><input v-model="currentStakeholder.creditCode" type="text" class="smart-input" />
            </div>
            <div class="smart-form-group">
              <label class="smart-label">法定代表人</label
              ><input
                v-model="currentStakeholder.legalRepresentative"
                type="text"
                class="smart-input"
              />
            </div>
          </template>

          <!-- 联络人信息 -->
          <div style="margin-top: 16px; border-top: 1px dashed #e2e8f0; padding-top: 16px">
            <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 12px">
              联络人信息
            </div>
            <div class="smart-form-group">
              <label class="smart-label">联络人姓名</label>
              <div style="display: flex; gap: 12px">
                <input
                  v-model="currentStakeholder.contactName"
                  type="text"
                  class="smart-input"
                  placeholder="姓名"
                  style="flex: 1"
                />
                <input
                  v-model="currentStakeholder.contactRole"
                  type="text"
                  class="smart-input"
                  placeholder="职位/角色 (选填)"
                  style="width: 140px"
                />
              </div>
            </div>
            <div class="smart-form-group">
              <label class="smart-label">联系方式</label>
              <div style="display: flex; gap: 12px">
                <input
                  v-model="currentStakeholder.contactPhone"
                  type="text"
                  class="smart-input"
                  placeholder="电话号码"
                  style="flex: 1"
                />
                <input
                  v-model="currentStakeholder.contactEmail"
                  type="text"
                  class="smart-input"
                  placeholder="电子邮箱"
                  style="flex: 1"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="smart-btn-secondary" @click="showStakeholderModal = false">取消</button>
          <button class="smart-btn-primary" @click="saveStakeholder">保存</button>
        </div>
      </div>
    </div>
  </CaseModuleLayout>
</template>

<script>
import { ref, computed } from 'vue'
import CaseModuleLayout from '@/components/case/CaseModuleLayout.js'
import { useCaseData, useModal, useStakeholders } from '@/features/case/composables'

export default {
  name: 'CaseBasicInfo',

  components: {
    CaseModuleLayout
  },

  setup() {
    // 1. 案件数据管理
    const { caseId, caseData, statusOptions, getStatusStyle, onCaseLoaded } = useCaseData()
    const stageOptions = ['咨询', '立案', '一审', '二审', '再审', '执行', '结案']

    // 2. 模态框管理
    const { openModal, closeModal, isModalOpen } = useModal()

    // 为了兼容模板中的 v-model 和 v-if，使用 computed 包装
    const showBasicInfoModal = computed({
      get: () => isModalOpen('basicInfo'),
      set: val => (val ? openModal('basicInfo') : closeModal('basicInfo'))
    })

    const showCaseFactsModal = computed({
      get: () => isModalOpen('caseFacts'),
      set: val => (val ? openModal('caseFacts') : closeModal('caseFacts'))
    })

    const showStakeholderModal = computed({
      get: () => isModalOpen('stakeholder'),
      set: val => (val ? openModal('stakeholder') : closeModal('stakeholder'))
    })

    // 3. 当事人管理
    // 初始数据 (Hardcoded for demo)
    const initialStakeholders = {
      plaintiffs: [
        {
          id: 1,
          name: '张三',
          type: 'person',
          idNumber: '110101198001011234',
          phone: '13800138000',
          address: '北京市朝阳区某某街道123号',
          role: '原告',
          contactName: '王经理',
          contactRole: '主要联络人',
          contactPhone: '138-0000-1234',
          contactEmail: 'wang@abc.com'
        }
      ],
      defendants: [
        {
          id: 1,
          name: '某科技有限公司',
          type: 'company',
          legalRepresentative: '李四',
          creditCode: '91110000MA01A2B3C4',
          address: '北京市海淀区某某大厦10层',
          lawyer: '王律师（某律所）',
          role: '被告',
          contactName: '',
          contactRole: '',
          contactPhone: '',
          contactEmail: ''
        }
      ],
      thirdParties: []
    }

    const {
      stakeholders,
      currentStakeholder,
      stakeholderType,
      addStakeholder: _addStakeholder,
      editStakeholder: _editStakeholder,
      deleteStakeholder: _deleteStakeholder,
      saveStakeholder: _saveStakeholder,
      getStakeholderSummary
    } = useStakeholders(initialStakeholders)

    // 包装方法以处理模态框和交互
    const addStakeholder = type => {
      _addStakeholder(type)
      openModal('stakeholder')
    }

    const editStakeholder = (type, stakeholder) => {
      _editStakeholder(type, stakeholder)
      openModal('stakeholder')
    }

    const deleteStakeholder = (type, id) => {
      if (confirm('确定要删除该当事人吗？')) {
        _deleteStakeholder(type, id)
      }
    }

    const saveStakeholder = () => {
      try {
        _saveStakeholder()
        closeModal('stakeholder')
      } catch (e) {
        alert(e.message)
      }
    }

    // 4. 案情描述与标签
    const factsData = ref({
      description:
        '2023年3月，原告张某与被告某科技有限公司签订软件开发合同，约定开发费用100万元。项目于2023年9月完成并交付，被告已支付50万元，剩余50万元尾款迟迟未支付。多次催款无果后，原告诉至法院。',
      disputeFocus: ['软件是否已实际交付', '质量验收是否合格', '违约损失金额'],
      objective: '支付剩余款项50万元 + 违约金8万元 + 利息'
    })

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
    const newFocusInput = ref('')
    const editForm = ref({})

    // 5. 本地业务逻辑
    const editBasicInfo = () => {
      editForm.value = {
        name: caseData.value.name,
        id: caseData.value.id,
        type: caseData.value.type,
        category: caseData.value.category,
        court: caseData.value.court || '',
        filingDate: caseData.value.filingDate || '',
        stage: caseData.value.stage || '咨询'
      }
      openModal('basicInfo')
    }

    const saveBasicInfo = () => {
      Object.assign(caseData.value, editForm.value)
      closeModal('basicInfo')
    }

    const editCaseFacts = () => {
      editForm.value = {
        description: factsData.value.description,
        disputeFocus: JSON.parse(JSON.stringify(factsData.value.disputeFocus)),
        objective: factsData.value.objective
      }
      newFocusInput.value = ''
      openModal('caseFacts')
    }

    const saveCaseFacts = () => {
      factsData.value.description = editForm.value.description
      factsData.value.disputeFocus = editForm.value.disputeFocus
      factsData.value.objective = editForm.value.objective
      closeModal('caseFacts')
    }

    const addFocusTag = () => {
      const val = newFocusInput.value.trim()
      if (val && !editForm.value.disputeFocus.includes(val)) {
        editForm.value.disputeFocus.push(val)
      }
      newFocusInput.value = ''
    }

    const removeFocusTag = index => {
      editForm.value.disputeFocus.splice(index, 1)
    }

    const addCommonFocus = focus => {
      if (!editForm.value.disputeFocus.includes(focus)) {
        editForm.value.disputeFocus.push(focus)
      }
    }

    return {
      // Data
      caseId,
      caseData,
      stageOptions,
      statusOptions,
      factsData,
      commonFocusOptions,
      newFocusInput,
      stakeholders,
      currentStakeholder,
      stakeholderType,
      editForm,

      // Modal State (Computed)
      showBasicInfoModal,
      showCaseFactsModal,
      showStakeholderModal,

      // Methods
      onCaseLoaded,
      getStatusStyle,
      getStakeholderSummary,
      editBasicInfo,
      saveBasicInfo,
      editCaseFacts,
      saveCaseFacts,
      addFocusTag,
      removeFocusTag,
      addCommonFocus,

      // Stakeholder Wrapper Methods
      addStakeholder,
      editStakeholder,
      deleteStakeholder,
      saveStakeholder
    }
  }
}
</script>
```
