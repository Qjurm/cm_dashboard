<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
      <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
        Total Decisions Made
      </h2>
      <div class="text-5xl font-black text-slate-800">
        {{ total }}
      </div>
      <p class="text-xs text-slate-400 mt-2">
        Across {{ participantCount }} participants
      </p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    total: Number,
    participantCount: Number
  })
  </script>