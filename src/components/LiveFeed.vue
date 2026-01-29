<template>
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

      <div v-else-if="participants.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-500">No participants found matching those filters.</p>
      </div>

      <div class="space-y-3">
        <ParticipantCard
          v-for="entry in participants"
          :key="entry.participantId"
          :entry="entry"
        />
      </div>
    </div>
  </template>

  <script setup>
  import ParticipantCard from './ParticipantCard.vue'

  defineProps({
    participants: Array,
    loading: Boolean
  })
  </script>