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
  resetFilters
} = useStudyData()
</script>