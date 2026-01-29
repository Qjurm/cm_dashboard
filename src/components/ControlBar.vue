<template>
  <section class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-4 z-20">
    <div class="flex flex-col md:flex-row gap-4 items-end mb-4">
      <!-- Search -->
      <div class="flex-1 w-full">
        <label class="block text-xs font-semibold text-slate-500 mb-1">Search Participant</label>
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Name or Surname..."
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
      </div>

      <!-- Gender Filter -->
      <div class="w-full md:w-48">
        <label class="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
        <select
          :value="selectedGender"
          @change="$emit('update:selectedGender', $event.target.value)"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">All Genders</option>
          <option v-for="g in uniqueGenders" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <!-- Sort -->
      <div class="w-full md:w-48">
        <label class="block text-xs font-semibold text-slate-500 mb-1">Sort By</label>
        <select
          :value="sortBy"
          @change="$emit('update:sortBy', $event.target.value)"
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="fastest">Fastest Reaction</option>
          <option value="slowest">Slowest Reaction</option>
        </select>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-4">
      <div class="flex items-center">
        <button
          @click="$emit('update:includePrototype', !includePrototype)"
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
        @click="$emit('reset')"
        class="text-xs text-red-600 font-bold hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  searchQuery: String,
  selectedGender: String,
  sortBy: String,
  includePrototype: Boolean,
  uniqueGenders: Array
})

defineEmits(['update:searchQuery', 'update:selectedGender', 'update:sortBy', 'update:includePrototype', 'reset'])
</script>