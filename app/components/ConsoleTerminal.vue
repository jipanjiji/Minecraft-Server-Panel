<template>
  <div class="glass-card flex flex-col h-full">
    <!-- Console Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-mc-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-sm font-semibold text-white">Console</h3>
        <span class="text-xs text-gray-500">({{ serverStore.consoleLogs.length }} lines)</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="autoScroll = !autoScroll"
          :class="['text-xs px-2 py-1 rounded-md transition-colors', autoScroll ? 'bg-mc-accent-blue/20 text-mc-accent-blue' : 'text-gray-500 hover:text-gray-300']"
        >
          Auto-scroll {{ autoScroll ? 'ON' : 'OFF' }}
        </button>
        <button
          @click="serverStore.clearLogs()"
          class="text-xs text-gray-500 hover:text-mc-accent-red px-2 py-1 rounded-md transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Console Output -->
    <div
      ref="consoleOutput"
      class="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-6 bg-black/40 min-h-[200px]"
      @scroll="onScroll"
    >
      <div v-if="serverStore.consoleLogs.length === 0" class="text-gray-500 italic text-center py-8">
        Server console kosong. Start server untuk melihat output.
      </div>
      <div
        v-for="(line, i) in serverStore.consoleLogs"
        :key="i"
        class="px-1 leading-relaxed"
        :style="{ color: lineColor(line.type) }"
      >
        {{ line.text }}
      </div>
    </div>

    <!-- Command Input -->
    <div class="border-t border-white/[0.08] p-3">
      <div class="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-2.5 border border-white/[0.08] focus-within:border-mc-accent-blue/30 transition-colors">
        <span class="font-mono text-sm font-bold" style="color: #00d68f">&gt;</span>
        <input
          v-model="commandInput"
          @keydown.enter="sendCommand"
          type="text"
          id="console-input"
          placeholder="Ketik command... (contoh: /time set day)"
          class="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-gray-600"
          :disabled="!serverStore.isOnline"
        />
        <button
          @click="sendCommand"
          :disabled="!serverStore.isOnline || !commandInput.trim()"
          class="disabled:opacity-20 transition-colors"
          style="color: #4cc9f0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const serverStore = useServerStore()
const consoleOutput = ref<HTMLElement>()
const commandInput = ref('')
const autoScroll = ref(true)

// Kirim command ke server via Socket.io
function sendCommand() {
  if (!commandInput.value.trim() || !serverStore.isOnline) return

  if (import.meta.client) {
    const { emit } = useSocket()
    emit('console:input', { command: commandInput.value.trim() })
  }

  commandInput.value = ''
}

// Inline color berdasarkan tipe log - menggunakan hex langsung agar pasti terlihat
function lineColor(type: string): string {
  const map: Record<string, string> = {
    info: '#e2e8f0',     // light gray - terang
    warn: '#ffc107',     // amber/kuning
    error: '#ff6b6b',    // merah
    panel: '#4cc9f0',    // biru
    command: '#00d68f',  // hijau
  }
  return map[type] || '#e2e8f0'
}

// Auto-scroll ke bawah
function scrollToBottom() {
  if (autoScroll.value && consoleOutput.value) {
    nextTick(() => {
      consoleOutput.value!.scrollTop = consoleOutput.value!.scrollHeight
    })
  }
}

// Deteksi manual scroll
function onScroll() {
  if (!consoleOutput.value) return
  const el = consoleOutput.value
  const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
  if (!isAtBottom) autoScroll.value = false
}

// Watch logs dan scroll
watch(
  () => serverStore.consoleLogs.length,
  () => scrollToBottom()
)
</script>
