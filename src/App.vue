<template>
  <div class="min-h-screen p-6 max-w-7xl mx-auto">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">CM Game Dashboard</h1>
        <p class="text-slate-500 mt-1">Realtime analysis & historical data</p>
      </div>
      <div class="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 flex gap-8">
        <div>
          <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Players</span>
          <span class="text-2xl font-bold text-indigo-600">{{ participants.length }}</span>
        </div>
        <div>
          <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Decisions</span>
          <span class="text-2xl font-bold text-emerald-600">{{ totalDecisions }}</span>
        </div>
      </div>
    </header>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        Scenario Outcomes
      </h2>

      <div v-if="loading && chartData.length === 0" class="text-center py-12 text-slate-400">
        Loading charts...
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="scenario in chartData"
          :key="scenario.id"
          class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center"
        >
          <h3 class="font-bold text-slate-700 mb-4">Scenario {{ scenario.id }}</h3>

          <div class="w-48 h-48 relative">
            <Pie :data="scenario.chartData" :options="chartOptions" />
          </div>

          <div class="mt-4 w-full space-y-2">
            <div
              v-for="(count, label) in scenario.rawCounts"
              :key="label"
              class="flex justify-between items-center text-sm"
            >
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getColorForLabel(label) }"></span>
                <span class="capitalize text-slate-600">{{ label }}</span>
              </div>
              <span class="font-bold font-mono text-slate-800">{{ count }}</span>
            </div>
            <div class="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-400">
              <span>Total</span>
              <span>{{ scenario.total }} votes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-200 my-8"></div>

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live Participant Feed
        </h2>
        <span class="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
          Latest {{ participants.length }} entries
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="entry in sortedParticipants"
          :key="entry.participantId"
          class="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                :style="{ backgroundColor: entry.avatar?.color || '#94a3b8' }"
              >
                {{ entry.participant?.name?.[0]?.toUpperCase() || '?' }}
              </div>
              <div>
                <div class="font-bold text-slate-800 text-sm">
                  {{ entry.participant?.name }} {{ entry.participant?.surname }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ formatTimestamp(entry.completedAt) }}
                </div>
              </div>
            </div>

            <div class="flex gap-1 flex-wrap">
              <div
                v-for="choice in entry.choices"
                :key="choice.scenarioId"
                class="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide"
                :class="getChoiceBadgeClass(choice.choice)"
                :title="`Scenario ${choice.scenarioId}: ${choice.timeToDecide}ms`"
              >
                S{{ choice.scenarioId }}: {{ choice.choice }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from './supabase'
import { formatDistanceToNow } from 'date-fns'

// --- Chart.js Imports ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

// --- Configuration ---
const TABLE_NAME = 'study_results'

// --- State ---
const rawRows = ref([])
const loading = ref(true)

// --- Chart Options ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false } // We built a custom legend for better control
  }
}

// --- Data Parsing ---
const participants = computed(() => {
  return rawRows.value.map(row => {
    try {
      return typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    } catch (e) {
      return null
    }
  }).filter(p => p !== null)
})

const sortedParticipants = computed(() => {
  return [...participants.value].sort((a, b) => {
    // Sort by completion time (newest first)
    // Fallback to current date if missing to prevent sorting errors
    const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0)
    const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0)
    return dateB - dateA
  })
})

const totalDecisions = computed(() => {
  return participants.value.reduce((acc, p) => acc + (p.choices?.length || 0), 0)
})

// --- Aggregation Logic for Pie Charts ---
const chartData = computed(() => {
  const scenarios = {} // { 1: { green: 5, red: 2 }, 2: { ... } }

  participants.value.forEach(p => {
    if (!p.choices) return
    p.choices.forEach(c => {
      const sId = c.scenarioId
      const choice = c.choice ? c.choice.toLowerCase() : 'unknown'

      if (!scenarios[sId]) scenarios[sId] = {}
      scenarios[sId][choice] = (scenarios[sId][choice] || 0) + 1
    })
  })

  // Convert to array format for v-for
  // Key sorting ensures Scenario 1, 2, 3 appear in order
  return Object.keys(scenarios)
    .sort((a, b) => Number(a) - Number(b))
    .map(sId => {
      const counts = scenarios[sId]
      const labels = Object.keys(counts)
      const dataValues = Object.values(counts)
      const total = dataValues.reduce((a, b) => a + b, 0)

      return {
        id: sId,
        rawCounts: counts,
        total: total,
        chartData: {
          labels: labels,
          datasets: [
            {
              backgroundColor: labels.map(l => getColorForLabel(l)),
              data: dataValues,
              borderWidth: 0
            }
          ]
        }
      }
    })
})

// --- Helpers ---

// Returns a Hex color for the Chart
const getColorForLabel = (label) => {
  const l = label.toLowerCase()
  if (l === 'green') return '#10b981' // emerald-500
  if (l === 'blue') return '#3b82f6'  // blue-500
  if (l === 'red') return '#ef4444'   // red-500
  if (l === 'left') return '#f59e0b'  // amber-500
  if (l === 'right') return '#8b5cf6' // violet-500
  if (l === 'ferris-wheel') return '#ec4899' // pink-500
  if (l === 'carousel') return '#06b6d4' // cyan-500
  if (l === 'lights') return '#eab308' // yellow-500
  if (l === 'no-lights') return '#64748b' // slate-500
  if (l === 'wide') return '#6366f1' // indigo-500
  if (l === 'narrow') return '#d946ef' // fuchsia-500
  return '#cbd5e1' // slate-300 default
}

// Returns CSS classes for the Participant List badges
const getChoiceBadgeClass = (label) => {
  const l = (label || '').toLowerCase()
  if (l === 'green') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (l === 'blue') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (l === 'red') return 'bg-red-50 text-red-700 border-red-200'
  if (l === 'left') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (l === 'right') return 'bg-violet-50 text-violet-700 border-violet-200'
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

const formatTimestamp = (isoString) => {
  if (!isoString) return ''
  try {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true })
  } catch (e) {
    return 'Just now'
  }
}

// --- Data Fetching ---
const fetchData = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')

    .order('filename', { ascending: true }) // Fixed sorting by filename
    .range(30, 1018)


  if (error) console.error('Error fetching data:', error)
  else rawRows.value = data
  loading.value = false
}

onMounted(() => {
  fetchData()

  // Realtime Subscription
  supabase
    .channel('realtime-study')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLE_NAME },
      (payload) => {
        rawRows.value.unshift(payload.new)
      }
    )
    .subscribe()
})
</script>