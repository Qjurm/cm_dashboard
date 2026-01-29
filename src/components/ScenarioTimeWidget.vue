<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        Avg. Time per Scenario
      </h2>
      <div class="space-y-4">
        <div v-for="stat in stats" :key="stat.id" class="relative group">
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
        <div v-if="stats.length === 0" class="text-sm text-slate-400 text-center py-4">
          No data available.
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { formatTime } from '../utils/formatters'

  defineProps({
    stats: Array
  })
  </script>