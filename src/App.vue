<template>
  <div class="min-h-screen p-4 md:p-6 w-full bg-slate-50/50">

    <HeaderStats
      :filteredCount="filteredParticipants.length"
      :totalRows="rawRows.length"
    />

    <ControlBar
      v-model:searchQuery="searchQuery"
      v-model:selectedGender="selectedGender"
      v-model:sortBy="sortBy"
      v-model:includePrototype="includePrototype"
      :uniqueGenders="uniqueGenders"
      @reset="resetFilters"
      @copy="copyToClipboard"
      @import="importData"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <!-- Right Column: Stats & Analytics -->
      <div class="space-y-6 lg:col-start-4">
        <TotalDecisionsWidget
          :total="totalDecisions"
          :participantCount="filteredParticipants.length"
        />
        <ScenarioTimeWidget
          :stats="scenarioTimeStats"
        />
      </div>

      <!-- Left Column: Charts & Feed -->
      <div class="lg:col-span-3 space-y-6 lg:row-start-1">
        <ScenarioCharts :chartData="pieChartData" />
        <LiveFeed :participants="filteredParticipants" :loading="loading" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { useStudyData } from './composables/useStudyData'

// Components
import HeaderStats from './components/HeaderStats.vue'
import ControlBar from './components/ControlBar.vue'
import TotalDecisionsWidget from './components/TotalDecisionsWidget.vue'
import ScenarioTimeWidget from './components/ScenarioTimeWidget.vue'
import ScenarioCharts from './components/ScenarioCharts.vue'
import LiveFeed from './components/LiveFeed.vue'

// Init Logic
const { 
  rawRows, loading,
  searchQuery, selectedGender, sortBy, includePrototype,
  uniqueGenders, filteredParticipants,
  totalDecisions, pieChartData, scenarioTimeStats,
  resetFilters, importData
} = useStudyData()

// --- Copy to Clipboard Function (CSV Format) ---
const copyToClipboard = () => {
  const headers = ['ParticipantID', 'Name', 'Surname', 'Gender', 'Age', 'CompletedAt', 'ScenarioID', 'Choice', 'TimeToDecide(ms)']
  const rows = []

  filteredParticipants.value.forEach(p => {
    if (p.choices && Array.isArray(p.choices)) {
      p.choices.forEach(c => {
        const safe = (val) => `"${String(val || '').replace(/"/g, '""')}"`
        rows.push([
          safe(p.participantId),
          safe(p.participant?.name),
          safe(p.participant?.surname),
          safe(p.participant?.gender),
          safe(p.participant?.age),
          safe(p.completedAt),
          safe(c.scenarioId),
          safe(c.choice),
          safe(c.timeToDecide)
        ].join(','))
      })
    }
  })

  const csvContent = headers.join(',') + '\n' + rows.join('\n')
  navigator.clipboard.writeText(csvContent).then(() => {
    console.log('Data copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy: ', err)
  })
}
</script>