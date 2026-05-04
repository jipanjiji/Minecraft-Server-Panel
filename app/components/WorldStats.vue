<template>
  <div class="glass-card">
    <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-mc-accent-purple/15 flex items-center justify-center">
          <svg class="w-4 h-4 text-mc-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white">World Statistics</h3>
          <p class="text-xs text-gray-500">Info tentang world server</p>
        </div>
      </div>
      <button @click="loadData" class="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
        Refresh
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="w-6 h-6 border-2 border-mc-accent-blue/30 border-t-mc-accent-blue rounded-full animate-spin"></div>
    </div>

    <div v-else class="p-5 space-y-5">
      <!-- Level Info -->
      <div v-if="levelDat" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">World Name</p>
          <p class="text-sm font-semibold text-white mt-1">{{ levelDat.levelName }}</p>
        </div>
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">Version</p>
          <p class="text-sm font-semibold text-white mt-1">{{ levelDat.version }}</p>
        </div>
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">Difficulty</p>
          <p class="text-sm font-semibold text-white mt-1">{{ levelDat.difficulty }}</p>
        </div>
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">Game Time</p>
          <p class="text-sm font-semibold text-white mt-1">{{ formatTicks(levelDat.gameTime) }}</p>
        </div>
      </div>

      <!-- Seed & Spawn -->
      <div v-if="levelDat" class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">Seed</p>
          <p class="text-sm font-mono text-mc-accent-blue mt-1 truncate">{{ levelDat.seed }}</p>
        </div>
        <div class="p-3 rounded-xl bg-mc-dark-900/40 border border-white/[0.06]">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider">Spawn Point</p>
          <p class="text-sm font-mono text-mc-accent-green mt-1">X:{{ levelDat.spawnX }} Y:{{ levelDat.spawnY }} Z:{{ levelDat.spawnZ }}</p>
        </div>
      </div>

      <!-- Weather -->
      <div v-if="levelDat" class="flex gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mc-dark-900/40 border border-white/[0.06]">
          <span class="text-sm">{{ levelDat.raining ? '🌧️' : '☀️' }}</span>
          <span class="text-xs text-gray-400">{{ levelDat.raining ? 'Raining' : 'Clear' }}</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mc-dark-900/40 border border-white/[0.06]">
          <span class="text-sm">{{ levelDat.thundering ? '⛈️' : '🌤️' }}</span>
          <span class="text-xs text-gray-400">{{ levelDat.thundering ? 'Thunder' : 'No Thunder' }}</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mc-dark-900/40 border border-white/[0.06]">
          <span class="text-sm">{{ levelDat.hardcore ? '💀' : '❤️' }}</span>
          <span class="text-xs text-gray-400">{{ levelDat.hardcore ? 'Hardcore' : 'Normal' }}</span>
        </div>
      </div>

      <!-- World Sizes -->
      <div v-if="worldStats">
        <h4 class="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">World Dimensions</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div v-for="world in worldStats.worlds" :key="world.name"
            class="p-3 rounded-xl border border-white/[0.06]"
            :class="world.exists ? 'bg-mc-dark-900/40' : 'bg-mc-dark-900/20 opacity-50'">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm">{{ worldEmoji(world.name) }}</span>
              <p class="text-sm font-semibold text-white">{{ worldLabel(world.name) }}</p>
            </div>
            <template v-if="world.exists">
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">Size</span>
                  <span class="text-white font-medium">{{ world.sizeFormatted }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">Region Files</span>
                  <span class="text-white font-medium">{{ world.regionFiles }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">Est. Chunks</span>
                  <span class="text-white font-medium">{{ world.estimatedChunks.toLocaleString() }}</span>
                </div>
              </div>
            </template>
            <p v-else class="text-xs text-gray-600">Not generated</p>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-mc-accent-blue/5 border border-mc-accent-blue/10">
          <span class="text-sm text-gray-400">Total World Size</span>
          <span class="text-sm font-bold text-mc-accent-blue">{{ worldStats.totalSizeFormatted }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi()
const loading = ref(true)
const worldStats = ref<any>(null)
const levelDat = ref<any>(null)

function worldEmoji(name: string) {
  if (name === 'world') return '🌍'
  if (name === 'world_nether') return '🔥'
  if (name === 'world_the_end') return '🌌'
  return '🌐'
}

function worldLabel(name: string) {
  if (name === 'world') return 'Overworld'
  if (name === 'world_nether') return 'Nether'
  if (name === 'world_the_end') return 'The End'
  return name
}

function formatTicks(ticks: number) {
  const totalSeconds = Math.floor(ticks / 20)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h ${minutes}m`
}

async function loadData() {
  loading.value = true
  try {
    const [stats, level] = await Promise.all([
      apiFetch('/api/world/stats'),
      apiFetch('/api/world/leveldat'),
    ])
    worldStats.value = stats
    levelDat.value = level
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

onMounted(() => loadData())
</script>
