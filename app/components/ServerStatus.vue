<template>
  <div :class="['status-badge', statusClass]">
    <span :class="['w-2 h-2 rounded-full', dotClass, { 'animate-pulse': isTransitioning }]"></span>
    <span>{{ statusText }}</span>
    <span v-if="serverStore.isOnline" class="text-[10px] opacity-60 ml-1">
      {{ serverStore.formattedUptime }}
    </span>
  </div>
</template>

<script setup lang="ts">
const serverStore = useServerStore()

const statusClass = computed(() => `status-${serverStore.status}`)

const dotClass = computed(() => {
  const map: Record<string, string> = {
    online: 'bg-mc-accent-green',
    offline: 'bg-mc-accent-red',
    starting: 'bg-mc-accent-amber',
    stopping: 'bg-mc-accent-amber',
  }
  return map[serverStore.status] || 'bg-gray-500'
})

const statusText = computed(() => {
  const map: Record<string, string> = {
    online: 'Online',
    offline: 'Offline',
    starting: 'Starting...',
    stopping: 'Stopping...',
  }
  return map[serverStore.status] || 'Unknown'
})

const isTransitioning = computed(() => serverStore.isTransitioning)
</script>
