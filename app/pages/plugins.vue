<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="flex gap-2">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2',
          activeTab === tab.id
            ? 'bg-gradient-to-r from-mc-accent-blue to-blue-500 text-white shadow-lg shadow-mc-accent-blue/25'
            : 'text-gray-400 hover:text-white glass-card hover:border-white/10']">
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ============ INSTALLED PLUGINS ============ -->
    <div v-if="activeTab === 'installed'">
      <div class="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center ring-1 ring-emerald-500/20">
              <svg class="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Installed Plugins</h3>
              <p class="text-xs text-gray-500">{{ installedPlugins.length }} plugin{{ installedPlugins.length !== 1 ? 's' : '' }} terinstall</p>
            </div>
          </div>
          <button @click="fetchInstalled" class="text-xs px-3.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10">
            ↻ Refresh
          </button>
        </div>

        <div v-if="installedPlugins.length === 0" class="px-6 py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
          </div>
          <p class="text-sm text-gray-400 font-medium">Belum ada plugin</p>
          <p class="text-xs text-gray-600 mt-1">Cari plugin di tab Marketplace untuk memulai</p>
        </div>

        <div v-else class="divide-y divide-white/[0.04]">
          <div v-for="plugin in installedPlugins" :key="plugin.filename"
            class="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-all group">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-base ring-1',
              plugin.enabled
                ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 ring-emerald-500/15'
                : 'bg-white/[0.03] ring-white/[0.06]']">
              🧩
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-white truncate">{{ plugin.name }}</p>
                <span :class="['w-1.5 h-1.5 rounded-full', plugin.enabled ? 'bg-emerald-400' : 'bg-gray-600']"></span>
              </div>
              <p class="text-[11px] text-gray-500 mt-0.5">{{ formatBytes(plugin.size) }} · {{ plugin.filename }}</p>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button @click="togglePlugin(plugin)"
                :class="['px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  plugin.enabled
                    ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/15'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 ring-1 ring-emerald-500/15']">
                {{ plugin.enabled ? 'Disable' : 'Enable' }}
              </button>
              <button @click="deletePlugin(plugin)"
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 ring-1 ring-rose-500/15 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-3 border-t border-white/[0.04] bg-amber-500/[0.03]">
          <p class="text-[11px] text-amber-400/70 text-center flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            Restart server setelah mengubah plugin agar perubahan berlaku
          </p>
        </div>
      </div>
    </div>

    <!-- ============ MARKETPLACE ============ -->
    <div v-if="activeTab === 'marketplace'" class="space-y-5">
      <!-- Search Bar -->
      <div class="rounded-2xl border border-white/[0.06] bg-gradient-to-r from-[#16162e]/80 to-[#1a1a2e]/80 backdrop-blur-md p-5">
        <div class="flex gap-3">
          <div class="flex-1 flex items-center gap-3 bg-[#0d0d1a] rounded-xl px-4 py-3 border border-white/[0.08] focus-within:border-mc-accent-blue/30 focus-within:ring-1 focus-within:ring-mc-accent-blue/10 transition-all">
            <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input v-model="searchQuery" @keydown.enter="searchModrinth" type="text" placeholder="Cari plugin di Modrinth..."
              class="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
          </div>
          <select v-model="selectedLoader" class="bg-[#0d0d1a] text-gray-300 text-sm rounded-xl px-4 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/30 transition-colors appearance-none">
            <option value="">All Loaders</option>
            <option value="paper">Paper</option>
            <option value="spigot">Spigot</option>
            <option value="bukkit">Bukkit</option>
            <option value="purpur">Purpur</option>
            <option value="folia">Folia</option>
          </select>
          <select v-model="selectedVersion" class="bg-[#0d0d1a] text-gray-300 text-sm rounded-xl px-4 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/30 transition-colors appearance-none">
            <option value="">All Versions</option>
            <option v-for="v in gameVersions" :key="v" :value="v">{{ v }}</option>
          </select>
          <button @click="searchModrinth"
            class="px-6 py-3 bg-gradient-to-r from-mc-accent-blue to-blue-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-mc-accent-blue/25 transition-all active:scale-95">
            Search
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="searching" class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-8 h-8 border-2 border-mc-accent-blue/20 border-t-mc-accent-blue rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500">Searching Modrinth...</p>
      </div>

      <!-- Results Grid -->
      <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="result in searchResults" :key="result.project_id"
          class="group rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#16162e]/60 to-[#0f0f1a]/60 p-5 hover:border-mc-accent-blue/20 hover:shadow-lg hover:shadow-mc-accent-blue/5 transition-all duration-300 cursor-pointer"
          @click="openInstallModal(result)">
          <div class="flex gap-4">
            <img :src="result.icon_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%231a1a2e%22 width=%2240%22 height=%2240%22 rx=%2210%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22%234a4a6a%22 font-size=%2218%22>🧩</text></svg>'"
              class="w-14 h-14 rounded-xl flex-shrink-0 object-cover ring-1 ring-white/[0.06] group-hover:ring-mc-accent-blue/20 transition-all" :alt="result.title" loading="lazy" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-white truncate group-hover:text-mc-accent-blue transition-colors">{{ result.title }}</p>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{{ result.description }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-[11px] text-gray-400 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  {{ formatDownloads(result.downloads) }}
                </span>
                <span class="text-[11px] text-gray-400 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  {{ result.follows }}
                </span>
                <div class="flex gap-1 flex-wrap">
                  <span v-for="cat in result.display_categories?.slice(0, 3) || result.categories?.slice(0, 3)" :key="cat"
                    class="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-400 font-medium">{{ cat }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="hasSearched" class="rounded-2xl border border-white/[0.06] bg-[#12122a]/60 px-6 py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <p class="text-sm text-gray-400 font-medium">Tidak ada hasil untuk "{{ searchQuery }}"</p>
        <p class="text-xs text-gray-600 mt-1">Coba kata kunci lain atau ubah filter</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalHits > 20" class="flex items-center justify-center gap-3">
        <button @click="searchPage(-1)" :disabled="searchOffset === 0"
          class="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-white/10">
          ← Previous
        </button>
        <span class="text-xs text-gray-500 px-3 py-1.5 rounded-lg bg-white/[0.03]">{{ searchOffset + 1 }}-{{ Math.min(searchOffset + 20, totalHits) }} of {{ totalHits }}</span>
        <button @click="searchPage(1)" :disabled="searchOffset + 20 >= totalHits"
          class="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-transparent hover:border-white/10">
          Next →
        </button>
      </div>
    </div>

    <!-- Install Modal -->
    <Teleport to="body">
      <div v-if="showInstallModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showInstallModal = false"></div>
        <PluginInstallModal :project="selectedProject!" @close="showInstallModal = false" @installed="onInstalled" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi()

const tabs = [
  { id: 'installed', label: 'Installed', icon: defineComponent({
    render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' })]) }
  })},
  { id: 'marketplace', label: 'Marketplace', icon: defineComponent({
    render() { return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })]) }
  })},
]

const activeTab = ref('installed')
const installedPlugins = ref<any[]>([])
const searchQuery = ref('')
const selectedLoader = ref('paper')
const selectedVersion = ref('')
const gameVersions = ref<string[]>([])
const searchResults = ref<any[]>([])
const searching = ref(false)
const hasSearched = ref(false)
const searchOffset = ref(0)
const totalHits = ref(0)
const showInstallModal = ref(false)
const selectedProject = ref<any>(null)

async function fetchInstalled() {
  try {
    const data = await apiFetch('/api/plugins/installed')
    installedPlugins.value = data.plugins || []
  } catch (err) { console.error(err) }
}

async function togglePlugin(plugin: any) {
  try {
    await apiFetch('/api/plugins/toggle', {
      method: 'POST',
      body: { filename: plugin.filename },
    })
    fetchInstalled()
  } catch (err) { console.error(err) }
}

async function deletePlugin(plugin: any) {
  if (!confirm(`Hapus plugin ${plugin.name}?`)) return
  try {
    await apiFetch(`/api/plugins/${encodeURIComponent(plugin.filename)}`, {
      method: 'DELETE',
    })
    fetchInstalled()
  } catch (err) { console.error(err) }
}

async function searchModrinth() {
  searching.value = true
  hasSearched.value = true
  try {
    const params = new URLSearchParams({
      q: searchQuery.value,
      offset: searchOffset.value.toString(),
    })
    if (selectedLoader.value) params.set('loader', selectedLoader.value)
    if (selectedVersion.value) params.set('version', selectedVersion.value)

    const data = await apiFetch(`/api/plugins/search?${params}`)
    searchResults.value = data.hits || []
    totalHits.value = data.total_hits || 0
  } catch (err) { console.error(err) }
  finally { searching.value = false }
}

function searchPage(dir: number) {
  searchOffset.value = Math.max(0, searchOffset.value + dir * 20)
  searchModrinth()
}

async function fetchGameVersions() {
  try {
    const data = await apiFetch('/api/plugins/game-versions')
    gameVersions.value = (data.versions || []).filter((v: string) => /^1\.\d+/.test(v)).slice(0, 50)
  } catch (err) { console.error(err) }
}

function openInstallModal(project: any) {
  selectedProject.value = project
  showInstallModal.value = true
}

function onInstalled() {
  showInstallModal.value = false
  fetchInstalled()
  activeTab.value = 'installed'
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDownloads(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

onMounted(() => {
  fetchInstalled()
  fetchGameVersions()
})
</script>
