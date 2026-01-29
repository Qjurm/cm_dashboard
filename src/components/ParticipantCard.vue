<template>
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
      <div class="p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">

        <!-- Person -->
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

        <!-- Timeline / Choices (COLORED BOXES) -->
        <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar flex-1">
          <div
            v-for="choice in entry.choices"
            :key="choice.scenarioId"
            class="flex flex-col items-center justify-center border rounded-md px-3 py-2 min-w-[90px]"
            :style="{
              backgroundColor: getColorForLabel(choice.choice) + '15',
              borderColor: getColorForLabel(choice.choice) + '40',
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

        <!-- Time -->
        <div class="text-right min-w-[80px] hidden sm:block">
          <div class="text-[10px] text-slate-400">Completed</div>
          <div class="text-xs font-mono text-slate-600">
            {{ formatTimestamp(entry.completedAt) }}
          </div>
        </div>

      </div>
    </div>
  </template>

  <script setup>
  import { formatTime, formatTimestamp } from '../utils/formatters'
  import { getColorForLabel } from '../utils/colors'

  defineProps({
    entry: Object
  })
  </script>

  <style scoped>
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>