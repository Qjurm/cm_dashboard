import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { getColorForLabel } from '../utils/colors'

export function useStudyData(tableName = 'study_results') {
  const rawRows = ref([])
  const loading = ref(true)

  // --- Filter State ---
  const searchQuery = ref('')
  const selectedGender = ref('')
  const sortBy = ref('newest')
  const includePrototype = ref(false)

  // --- Core Data Parsing ---
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

  // --- Computed Helpers ---
  const oldest30Ids = computed(() => {
    const sorted = [...participants.value].sort((a, b) => a.completedDate - b.completedDate)
    return sorted.slice(0, 30).map(p => p.participantId)
  })

  const uniqueGenders = computed(() => {
    const s = new Set(participants.value.map(p => p.normalizedGender))
    return Array.from(s).sort()
  })

  // --- Main Filtering Logic ---
  const filteredParticipants = computed(() => {
    let result = [...participants.value]

    if (!includePrototype.value) {
      const idsToHide = new Set(oldest30Ids.value)
      result = result.filter(p => !idsToHide.has(p.participantId))
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p =>
        (p.participant?.name || '').toLowerCase().includes(q) ||
        (p.participant?.surname || '').toLowerCase().includes(q)
      )
    }

    if (selectedGender.value) {
      result = result.filter(p => p.normalizedGender === selectedGender.value)
    }

    result.sort((a, b) => {
      if (sortBy.value === 'newest') return b.completedDate - a.completedDate
      if (sortBy.value === 'oldest') return a.completedDate - b.completedDate
      if (sortBy.value === 'fastest') return a.totalTime - b.totalTime
      if (sortBy.value === 'slowest') return b.totalTime - a.totalTime
      return 0
    })

    return result
  })

  // --- Stats Calculations ---
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

  // --- Actions ---
  const resetFilters = () => {
    searchQuery.value = ''
    selectedGender.value = ''
    sortBy.value = 'newest'
    includePrototype.value = false
  }

  const fetchData = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('filename', { ascending: false })
      .limit(2000)

    if (!error) rawRows.value = data
    loading.value = false
  }

  // --- Lifecycle ---
  onMounted(() => {
    fetchData()
    supabase.channel('realtime-study')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: tableName },
      (payload) => { rawRows.value.unshift(payload.new) })
      .subscribe()
  })

  return {
    rawRows,
    loading,
    searchQuery,
    selectedGender,
    sortBy,
    includePrototype,
    uniqueGenders,
    filteredParticipants,
    totalDecisions,
    pieChartData,
    scenarioTimeStats,
    resetFilters
  }
}