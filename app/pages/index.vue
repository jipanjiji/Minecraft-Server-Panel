<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Stats Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Status Card -->
      <div class="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Server Status</p>
            <p class="text-2xl font-bold text-white mt-1.5 capitalize">{{ serverStore.status }}</p>
          </div>
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center ring-1 transition-all',
            serverStore.isOnline
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-emerald-500/20'
              : serverStore.isTransitioning
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-amber-500/20'
                : 'bg-gradient-to-br from-rose-500/20 to-rose-600/10 ring-rose-500/20'
          ]">
            <div :class="[
              'w-4 h-4 rounded-full transition-all',
              serverStore.isOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-500/40' : serverStore.isTransitioning ? 'bg-amber-400 animate-pulse shadow-lg shadow-amber-500/40' : 'bg-rose-400 shadow-lg shadow-rose-500/40'
            ]"></div>
          </div>
        </div>
      </div>

      <!-- Uptime Card -->
      <div class="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Uptime</p>
            <p class="text-2xl font-bold text-white mt-1.5 font-mono">{{ serverStore.formattedUptime }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-mc-accent-blue/20 to-blue-600/10 flex items-center justify-center ring-1 ring-mc-accent-blue/20">
            <svg class="w-5.5 h-5.5 text-mc-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- CPU Quick Stat -->
      <div class="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">CPU Usage</p>
            <p class="text-2xl font-bold text-white mt-1.5">{{ serverStore.currentStats.cpuUsage.toFixed(1) }}%</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center ring-1 ring-cyan-500/20">
            <svg class="w-5.5 h-5.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- RAM Quick Stat -->
      <div class="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">RAM Usage</p>
            <p class="text-2xl font-bold text-white mt-1.5">{{ serverStore.ramUsedGB }} <span class="text-sm text-gray-500 font-normal">/ {{ serverStore.ramTotalGB }} GB</span></p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center ring-1 ring-violet-500/20">
            <svg class="w-5.5 h-5.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ClientOnly>
        <ResourceChart
          type="cpu"
          title="CPU Usage"
          :current-value="serverStore.currentStats.cpuUsage.toFixed(1)"
          unit="%"
          subtitle="System CPU utilization over the last 60 seconds"
          :history="serverStore.cpuHistory"
          color="#4cc9f0"
          color-rgb="76, 201, 240"
        />
      </ClientOnly>

      <ClientOnly>
        <ResourceChart
          type="ram"
          title="RAM Usage"
          :current-value="serverStore.currentStats.memPercent.toFixed(1)"
          unit="%"
          :subtitle="`${serverStore.ramUsedGB} GB used of ${serverStore.ramTotalGB} GB total`"
          :history="serverStore.ramHistory"
          color="#7c3aed"
          color-rgb="124, 58, 237"
        />
      </ClientOnly>
    </div>

    <!-- Console -->
    <div class="h-[400px]">
      <ConsoleTerminal />
    </div>
  </div>
</template>

<script setup lang="ts">
const serverStore = useServerStore()

// Update uptime setiap detik
let uptimeInterval: ReturnType<typeof setInterval>
onMounted(() => {
  uptimeInterval = setInterval(() => {
    if (serverStore.isOnline && serverStore.uptime) {
      serverStore.uptime += 1000
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(uptimeInterval)
})

useHead({
  title: 'Dashboard - MC Panel',
})
</script>
