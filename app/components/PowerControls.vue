<template>
  <div class="flex items-center gap-2">
    <button id="btn-start" :disabled="!serverStore.isOffline" @click="startServer"
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-mc-accent-green/20 text-mc-accent-green border border-mc-accent-green/30 hover:bg-mc-accent-green/30 hover:shadow-lg hover:shadow-mc-accent-green/20 disabled:opacity-25 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      <span>Start</span>
    </button>

    <button id="btn-stop" :disabled="!serverStore.isOnline" @click="confirmStop"
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-mc-accent-red/20 text-mc-accent-red border border-mc-accent-red/30 hover:bg-mc-accent-red/30 hover:shadow-lg hover:shadow-mc-accent-red/20 disabled:opacity-25 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      <span>Stop</span>
    </button>

    <button id="btn-restart" :disabled="!serverStore.isOnline" @click="restartServer"
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-mc-accent-amber/20 text-mc-accent-amber border border-mc-accent-amber/30 hover:bg-mc-accent-amber/30 hover:shadow-lg hover:shadow-mc-accent-amber/20 disabled:opacity-25 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <span>Restart</span>
    </button>

    <Teleport to="body">
      <div v-if="showStopModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showStopModal = false"></div>
        <div class="relative glass-card p-6 max-w-sm w-full animate-slide-up">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-mc-accent-red/15 flex items-center justify-center">
              <svg class="w-5 h-5 text-mc-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">Stop Server?</h3>
              <p class="text-xs text-gray-400">Graceful shutdown</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-6">Server akan di-shutdown menggunakan command <code class="text-mc-accent-amber bg-mc-dark-400/50 px-1.5 py-0.5 rounded text-xs font-mono">stop</code>. Semua player akan di-kick.</p>
          <div class="flex gap-3 justify-end">
            <button @click="showStopModal = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors">Batal</button>
            <button @click="stopServer" class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-mc-accent-red/20 text-mc-accent-red border border-mc-accent-red/30 hover:bg-mc-accent-red/30 transition-all">Ya, Stop Server</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const serverStore = useServerStore()
const { apiFetch } = useApi()
const showStopModal = ref(false)

async function apiCall(endpoint: string) {
  try {
    const data = await apiFetch(`/api/server/${endpoint}`, { method: 'POST' })
    return data
  } catch (err: any) {
    console.error(`[PowerControls] ${endpoint} failed:`, err.message)
  }
}

function startServer() { apiCall('start') }
function confirmStop() { showStopModal.value = true }
function stopServer() { showStopModal.value = false; apiCall('stop') }
function restartServer() { apiCall('restart') }
</script>
