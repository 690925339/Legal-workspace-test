<template>
  <CaseModuleLayout :case-id="caseId" active-module="advanced" @case-loaded="onCaseLoaded">
    <!-- Sub Tabs -->
    <div class="tabs-container" style="margin-top: -24px; margin-bottom: 16px">
      <div class="smart-tabs">
        <div
          v-for="tab in subTabs"
          :key="tab.id"
          :class="['tab-pill', { active: activeSubTab === tab.id }]"
          @click="switchSubTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>

    <!-- AI Analysis -->
    <div v-if="activeSubTab === 'ai-analysis'" class="tab-pane">
      <AIAnalysis :case-data="caseData" />
    </div>

    <!-- AI Assistant -->
    <div v-if="activeSubTab === 'ai-assistant'" class="tab-pane">
      <AIAssistant :case-data="caseData" />
    </div>

    <!-- Relationship Graph -->
    <div v-if="activeSubTab === 'relationship-graph'" class="tab-pane">
      <RelationshipGraph />
    </div>

    <!-- Evidence Timeline -->
    <div v-if="activeSubTab === 'timeline'" class="tab-pane">
      <EvidenceTimeline />
    </div>

    <!-- Quote Generator -->
    <div v-if="activeSubTab === 'quote-generator'" class="tab-pane">
      <QuoteGenerator :case-data="caseData" />
    </div>
  </CaseModuleLayout>
</template>

<script>
import { ref } from 'vue'
import CaseModuleLayout from '@/components/case/CaseModuleLayout.js'
import AIAnalysis from './analysis/AIAnalysis.js'
import AIAssistant from './analysis/AIAssistant.js'
import RelationshipGraph from './analysis/RelationshipGraph.js'
import EvidenceTimeline from './analysis/EvidenceTimeline.js'
import QuoteGenerator from './analysis/QuoteGenerator.vue'
import { useCaseData } from '@/features/case/composables/useCaseData.js'

export default {
  name: 'CaseAdvanced',

  components: {
    CaseModuleLayout,
    AIAnalysis,
    AIAssistant,
    RelationshipGraph,
    EvidenceTimeline,
    QuoteGenerator
  },

  setup() {
    const { caseId, caseData, onCaseLoaded } = useCaseData()

    const activeSubTab = ref('ai-analysis')
    const subTabs = [
      { id: 'ai-analysis', name: 'AI可行性报告' },
      { id: 'ai-assistant', name: 'AI对话助手' },
      { id: 'relationship-graph', name: '关系洞察' },
      { id: 'timeline', name: '证据时间轴' },
      { id: 'quote-generator', name: '生成报价书' }
    ]

    const switchSubTab = tabId => {
      activeSubTab.value = tabId
    }

    return {
      caseId,
      caseData,
      onCaseLoaded,
      activeSubTab,
      subTabs,
      switchSubTab
    }
  }
}
</script>
