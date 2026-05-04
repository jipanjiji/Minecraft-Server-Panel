<template>
  <div class="min-h-screen bg-mc-dark-900">
    <!-- Background decorative gradient -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-mc-accent-blue/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-mc-accent-purple/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative flex h-screen">
      <!-- Sidebar -->
      <aside
        :class="[
          'flex flex-col bg-mc-dark-700 border-r border-white/[0.08] transition-all duration-300 z-30',
          sidebarOpen ? 'w-64' : 'w-[72px]',
        ]"
      >
        <!-- Logo / Brand -->
        <div class="flex items-center gap-3 px-5 h-16 border-b border-white/[0.08]">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-mc-accent-green to-mc-accent-blue flex items-center justify-center flex-shrink-0 shadow-lg shadow-mc-accent-green/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div v-if="sidebarOpen" class="animate-fade-in overflow-hidden">
            <h1 class="text-base font-bold text-white leading-tight">MC Panel</h1>
            <p class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Control Panel</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-3 space-y-1 mt-2">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              route.path === item.path
                ? 'bg-mc-accent-blue/15 text-white border border-mc-accent-blue/25 shadow-sm shadow-mc-accent-blue/5'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
            ]"
          >
            <component :is="item.icon" :class="['w-5 h-5 flex-shrink-0 transition-colors', route.path === item.path ? 'text-mc-accent-blue' : 'text-gray-400 group-hover:text-gray-200']" />
            <span v-if="sidebarOpen" class="animate-fade-in text-sm font-medium">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Sidebar Toggle & Connection Status -->
        <div class="p-3 border-t border-white/[0.08] space-y-2">
          <!-- Connection indicator -->
          <div v-if="sidebarOpen" class="flex items-center gap-2.5 px-4 py-2 animate-fade-in">
            <div :class="['w-2 h-2 rounded-full ring-2', serverStore.socketConnected ? 'bg-mc-accent-green ring-mc-accent-green/30' : 'bg-mc-accent-red ring-mc-accent-red/30 animate-pulse']"></div>
            <span class="text-xs text-gray-400 font-medium">{{ serverStore.socketConnected ? 'Connected' : 'Disconnected' }}</span>
          </div>

          <button
            @click="sidebarOpen = !sidebarOpen"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <svg
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-180': !sidebarOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <!-- Top Bar -->
        <header class="sticky top-0 z-20 bg-mc-dark-900/90 backdrop-blur-xl border-b border-white/[0.08]">
          <div class="flex items-center justify-between px-6 h-16">
            <div class="flex items-center gap-4">
              <h2 class="text-lg font-semibold text-white">
                {{ pageTitle }}
              </h2>
              <ServerStatus />
            </div>

            <div class="flex items-center gap-2">
              <PowerControls />
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const serverStore = useServerStore()
const sidebarOpen = ref(true)

// Inisialisasi status login dari localStorage
serverStore.initAuth()

// Pantau route: Jika tidak ada password dan bukan di halaman login, lempar ke login
onMounted(() => {
  if (!serverStore.panelPassword && route.path !== '/login') {
    navigateTo('/login')
  }
})

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/files': 'File Manager',
  '/players': 'Players',
  '/plugins': 'Plugins',
  '/settings': 'Settings',
}

const pageTitle = computed(() => pageTitles[route.path] || 'MC Panel')

// SVG icon components for nav
const IconDashboard = defineComponent({
  render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })]) }
})
const IconFiles = defineComponent({
  render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' })]) }
})
const IconPlayers = defineComponent({
  render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })]) }
})
const IconPlugins = defineComponent({
  render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' })]) }
})
const IconSettings = defineComponent({
  render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z' })]) }
})

const navItems = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/players', label: 'Players', icon: IconPlayers },
  { path: '/plugins', label: 'Plugins', icon: IconPlugins },
  { path: '/files', label: 'File Manager', icon: IconFiles },
  { path: '/settings', label: 'Settings', icon: IconSettings },
]

// Setup socket listeners di layout level
if (import.meta.client) {
  const { on, socket } = useSocket()

  // Track connection status
  socket.on('connect', () => serverStore.setSocketConnected(true))
  socket.on('disconnect', () => serverStore.setSocketConnected(false))

  on('server:status', (data: any) => serverStore.updateStatus(data))
  on('console:output', (data: any) => serverStore.appendLog(data.line))
  on('console:history', (data: any) => serverStore.loadHistory(data.lines))
  on('system:stats', (data: any) => serverStore.updateStats(data))

  onMounted(() => {
    serverStore.setSocketConnected(socket.connected)
  })
}
</script>
