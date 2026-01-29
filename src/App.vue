<template>
  <div class="min-h-screen p-4 md:p-6 w-full bg-slate-50/50">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">CM Game Dashboard</h1>
        <p class="text-slate-500 mt-1">Realtime analytics & historical trends</p>
      </div>
      <div class="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 flex gap-8">
        <div class="text-center">
          <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Filter</span>
          <span class="text-2xl font-bold text-indigo-600">{{ filteredParticipants.length }}</span>
        </div>
        <div class="text-center">
          <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total DB Rows</span>
          <span class="text-2xl font-bold text-slate-400">{{ rawRows.length }}</span>
        </div>
      </div>
    </header>

    <section class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-4 z-20">

      <div class="flex flex-col md:flex-row gap-4 items-end mb-4">
        <div class="flex-1 w-full">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Search Participant</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Name or Surname..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
        </div>

        <div class="w-full md:w-48">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
          <select
            v-model="selectedGender"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">All Genders</option>
            <option v-for="g in uniqueGenders" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <div class="w-full md:w-48">
          <label class="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="fastest">Fastest Reaction</option>
            <option value="slowest">Slowest Reaction</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-4">

        <div class="flex items-center">
          <button
            @click="includePrototype = !includePrototype"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
            :class="includePrototype
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'"
          >
            <span class="w-2 h-2 rounded-full" :class="includePrototype ? 'bg-amber-500' : 'bg-slate-400'"></span>
            {{ includePrototype ? 'Including Old Prototype Data (30)' : 'Hiding Old Prototype Data' }}
          </button>
        </div>

        <button
          v-if="searchQuery || selectedGender || sortBy !== 'newest' || includePrototype"
          @click="resetFilters"
          class="text-xs text-red-600 font-bold hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
        >
          Reset All Filters
        </button>
      </div>

    </section>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <div class="space-y-6 lg:col-start-4">

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Decisions Made
          </h2>
          <div class="text-5xl font-black text-slate-800">
            {{ totalDecisions }}
          </div>
          <p class="text-xs text-slate-400 mt-2">
            Across {{ filteredParticipants.length }} participants
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
            Avg. Time per Scenario
          </h2>
          <div class="space-y-4">
            <div v-for="stat in scenarioTimeStats" :key="stat.id" class="relative group">
              <div class="flex justify-between items-end mb-1 text-sm">
                <span class="font-medium text-slate-600">Scenario {{ stat.id }}</span>
                <span class="font-mono font-bold text-slate-900">{{ formatTime(stat.avg) }}</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full bg-amber-400"
                  :style="{ width: `${Math.min((stat.avg / 15000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            <div v-if="scenarioTimeStats.length === 0" class="text-sm text-slate-400 text-center py-4">
              No data available.
            </div>
          </div>
        </div>

      </div>

      <div class="lg:col-span-3 space-y-6 lg:row-start-1">

        <div v-if="filteredParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="scenario in pieChartData"
            :key="scenario.id"
            class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center"
          >
            <h3 class="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">Scenario {{ scenario.id }}</h3>

            <div class="w-40 h-40 relative">
              <Pie :data="scenario.chartData" :options="chartOptions" />
            </div>

            <div class="mt-4 w-full px-4 space-y-1">
               <div v-for="(count, label) in scenario.rawCounts" :key="label" class="flex justify-between items-center text-xs text-slate-600 border-b border-slate-50 last:border-0 py-1">
                 <div class="flex items-center gap-2">
                   <span class="w-2.5 h-2.5 rounded-full" :style="{backgroundColor: getColorForLabel(label)}"></span>
                   <span class="capitalize font-medium">{{ label }}</span>
                 </div>
                 <span class="font-mono">{{ count }}</span>
               </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
             <h2 class="text-xl font-semibold flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Feed
            </h2>
            <span class="text-xs text-slate-400">Showing top results</span>
          </div>

          <div v-if="loading" class="text-center py-10 text-slate-400">Loading data...</div>

          <div v-else-if="filteredParticipants.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p class="text-slate-500">No participants found matching those filters.</p>
          </div>

          <div class="space-y-3">
            <div
              v-for="entry in filteredParticipants"
              :key="entry.participantId"
              class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div class="p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">

                <div class="flex items-center gap-3 min-w-[200px]">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0"
                    :style="{ backgroundColor: entry.avatar?.color || '#94a3b8' }"
                  >
                    {{ entry.participant?.name?.[0]?.toUpperCase() || '?' }}
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm leading-tight">
                      {{ entry.participant?.name }} {{ entry.participant?.surname }}
                    </h3>
                    <p class="text-[11px] text-slate-500 capitalize">
                      {{ entry.participant?.gender }} • Age {{ entry.participant?.age }}
                    </p>
                  </div>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex-1">
                  <div
                    v-for="choice in entry.choices"
                    :key="choice.scenarioId"
                    class="flex flex-col items-center justify-center border rounded-md px-3 py-2 min-w-[90px]"
                    :style="{
                      backgroundColor: getColorForLabel(choice.choice) + '15', // 15 = low opacity hex
                      borderColor: getColorForLabel(choice.choice) + '40',     // 40 = medium opacity hex
                      color: getColorForLabel(choice.choice)
                    }"
                    :title="`Scenario ${choice.scenarioId}`"
                  >
                    <div class="text-xs font-bold capitalize truncate max-w-[80px]">
                      {{ choice.choice }}
                    </div>
                    <div class="text-[11px] font-mono opacity-80 mt-0.5">
                      {{ formatTime(choice.timeToDecide) }}
                    </div>
                  </div>
                </div>

                <div class="text-right min-w-[80px] hidden sm:block">
                  <div class="text-[10px] text-slate-400">Completed</div>
                  <div class="text-xs font-mono text-slate-600">
                    {{ formatTimestamp(entry.completedAt) }}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from './supabase'
import { formatDistanceToNow } from 'date-fns'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

// --- Config ---
const TABLE_NAME = 'study_results'

// --- State ---
const rawRows = ref([])
const loading = ref(true)

// Filters
const searchQuery = ref('')
const selectedGender = ref('')
const sortBy = ref('newest')
const includePrototype = ref(false) // Default to hiding prototype

// --- Chart Config ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}

// --- DATA PROCESSING ---
const participants = computed(() => {
  return rawRows.value.map(row => {
    try {
      const p = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
      p.totalTime = p.choices?.reduce((sum, c) => sum + (Number(c.timeToDecide) || 0), 0) || 0

      const g = (p.participant?.gender || 'unknown').trim().toLowerCase()
      p.normalizedGender = g.charAt(0).toUpperCase() + g.slice(1)

      p.completedDate = p.completedAt ? new Date(p.completedAt) : new Date(0)

      return p
    } catch (e) { return null }
  }).filter(p => p !== null)
})

// Calculate the IDs of the 30 oldest participants (The Prototype Data)
const oldest30Ids = computed(() => {
  const sorted = [...participants.value].sort((a, b) => a.completedDate - b.completedDate)
  return sorted.slice(0, 30).map(p => p.participantId)
})

const uniqueGenders = computed(() => {
  const s = new Set(participants.value.map(p => p.normalizedGender))
  return Array.from(s).sort()
})

const filteredParticipants = computed(() => {
  let result = [...participants.value]

  // 1. Prototype Filter
  if (!includePrototype.value) {
    const idsToHide = new Set(oldest30Ids.value)
    result = result.filter(p => !idsToHide.has(p.participantId))
  }

  // 2. Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      (p.participant?.name || '').toLowerCase().includes(q) ||
      (p.participant?.surname || '').toLowerCase().includes(q)
    )
  }

  // 3. Gender
  if (selectedGender.value) {
    result = result.filter(p => p.normalizedGender === selectedGender.value)
  }

  // 4. Sort
  result.sort((a, b) => {
    if (sortBy.value === 'newest') return b.completedDate - a.completedDate
    if (sortBy.value === 'oldest') return a.completedDate - b.completedDate
    if (sortBy.value === 'fastest') return a.totalTime - b.totalTime
    if (sortBy.value === 'slowest') return b.totalTime - a.totalTime
    return 0
  })

  return result
})

// --- STATS ---
const totalDecisions = computed(() => {
  return filteredParticipants.value.reduce((total, p) => total + (p.choices?.length || 0), 0)
})

const pieChartData = computed(() => {
  const scenarios = {}
  filteredParticipants.value.forEach(p => {
    p.choices?.forEach(c => {
      const sId = c.scenarioId
      const choice = (c.choice || 'unknown').toLowerCase()
      if (!scenarios[sId]) scenarios[sId] = {}
      scenarios[sId][choice] = (scenarios[sId][choice] || 0) + 1
    })
  })

  return Object.keys(scenarios)
    .sort((a,b) => Number(a)-Number(b))
    .map(sId => {
      const counts = scenarios[sId]
      const labels = Object.keys(counts)
      return {
        id: sId,
        rawCounts: counts,
        chartData: {
          labels,
          datasets: [{
            backgroundColor: labels.map(l => getColorForLabel(l)),
            data: Object.values(counts),
            borderWidth: 0
          }]
        }
      }
    })
})

const scenarioTimeStats = computed(() => {
  const stats = {}
  filteredParticipants.value.forEach(p => {
    p.choices?.forEach(c => {
      const sId = c.scenarioId
      if (!stats[sId]) stats[sId] = { sum: 0, count: 0 }
      stats[sId].sum += (Number(c.timeToDecide) || 0)
      stats[sId].count++
    })
  })
  return Object.keys(stats)
    .sort((a,b) => Number(a)-Number(b))
    .map(sId => ({
      id: sId,
      avg: stats[sId].sum / stats[sId].count
    }))
})

// --- HELPERS ---
const resetFilters = () => {
  searchQuery.value = ''
  selectedGender.value = ''
  sortBy.value = 'newest'
  includePrototype.value = false
}

const formatTime = (ms) => (!ms ? '-' : (ms / 1000).toFixed(2) + 's')
const formatTimestamp = (iso) => {
  try { return formatDistanceToNow(new Date(iso), { addSuffix: true }) } catch { return '' }
}

const getColorForLabel = (label) => {
  const l = (label || '').toLowerCase()
  const colors = {
    green: '#10b981',
    blue:  '#3b82f6',
    red:   '#ef4444',
    left:  '#f59e0b',
    right: '#8b5cf6',
    'ferris-wheel': '#ec4899',
    'carousel':     '#06b6d4',
    'lights':       '#eab308',
    'no-lights':    '#64748b',
    'wide':         '#6366f1',
    'narrow':       '#d946ef',
    'unknown':      '#cbd5e1'
  }
  return colors[l] || '#94a3b8'
}

// --- FETCH ---
const fetchData = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('filename', { ascending: false })
    .limit(2000)

  if (!error) rawRows.value = data
  loading.value = false
}

onMounted(() => {
  fetchData()
  supabase.channel('realtime-study')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE_NAME },
    (payload) => { rawRows.value.unshift(payload.new) })
    .subscribe()
})
</script>

<style>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>