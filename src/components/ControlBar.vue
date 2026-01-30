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
      <div class="flex items-center gap-4">
        <!-- Prototype Toggle -->
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

        <!-- NIEUW: Copy Button -->
        <button
          @click="handleCopy"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        >
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ copied ? 'Copied CSV!' : 'Copy Filtered Data' }}
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
import { ref } from 'vue'

const props = defineProps({
  searchQuery: String,
  selectedGender: String,
  sortBy: String,
  includePrototype: Boolean,
  uniqueGenders: Array
})

const emit = defineEmits(['update:searchQuery', 'update:selectedGender', 'update:sortBy', 'update:includePrototype', 'reset', 'copy'])

const copied = ref(false)

const handleCopy = () => {
  emit('copy')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>