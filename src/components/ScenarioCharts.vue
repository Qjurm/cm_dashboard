<template>
    <div v-if="chartData.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="scenario in chartData"
        :key="scenario.id"
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center"
      >
        <h3 class="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">Scenario {{ scenario.id }}</h3>

        <div class="w-40 h-40 relative">
          <Pie :data="scenario.chartData" :options="chartOptions" />
        </div>

        <!-- Legend -->
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
  </template>

  <script setup>
  import { getColorForLabel } from '../utils/colors'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Pie } from 'vue-chartjs'

  ChartJS.register(ArcElement, Tooltip, Legend)

  defineProps({
    chartData: Array
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  }
  </script>