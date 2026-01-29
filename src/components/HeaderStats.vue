<template>
  <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">CM Game Dashboard</h1>
      <p class="text-slate-500 mt-1">Realtime analytics & historical trends</p>
    </div>
    <div class="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 flex gap-8">
      <div class="text-center">
        <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Filter</span>
        <span class="text-2xl font-bold text-indigo-600">{{ filteredCount }}</span>
      </div>
      <div class="text-center">
        <span class="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total DB Rows</span>
        <span class="text-2xl font-bold text-slate-400">{{ totalRows }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  filteredCount: Number,
  totalRows: Number
})
</script>