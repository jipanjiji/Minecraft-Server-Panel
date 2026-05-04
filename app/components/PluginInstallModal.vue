<template>
  <div class="relative z-10 w-full max-w-xl" @click.stop>
    <div class="rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-[#1a1a3e] to-[#0f0f1a] shadow-2xl shadow-black/50">
      <!-- Header -->
      <div class="relative px-6 py-5 border-b border-white/[0.08]">
        <div class="absolute inset-0 bg-gradient-to-r from-mc-accent-blue/5 via-mc-accent-purple/5 to-transparent"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img :src="project.icon_url || ''" class="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" :alt="project.title" />
            <div>
              <h3 class="text-base font-bold text-white">{{ project.title }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">Pilih versi untuk install</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2.5 rounded-xl hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <select v-model="filterLoader" @change="fetchVersions"
          class="flex-1 bg-[#0d0d1a] text-gray-300 text-sm rounded-xl px-4 py-2 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/40 transition-colors appearance-none">
          <option value="">All Loaders</option>
          <option value="paper">Paper</option>
          <option value="spigot">Spigot</option>
          <option value="bukkit">Bukkit</option>
          <option value="purpur">Purpur</option>
          <option value="folia">Folia</option>
        </select>
        <select v-model="filterVersion" @change="fetchVersions"
          class="flex-1 bg-[#0d0d1a] text-gray-300 text-sm rounded-xl px-4 py-2 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/40 transition-colors appearance-none">
          <option value="">All MC Versions</option>
          <option v-for="v in mcVersions" :key="v" :value="v">{{ v }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-8 h-8 border-2 border-mc-accent-blue/20 border-t-mc-accent-blue rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500">Loading versions...</p>
      </div>

      <!-- Version List -->
      <div v-else class="max-h-96 overflow-y-auto">
        <div v-if="versions.length === 0" class="px-6 py-16 text-center">
          <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <p class="text-sm text-gray-500">Tidak ada versi yang cocok</p>
          <p class="text-xs text-gray-600 mt-1">Coba ubah filter loader atau MC version</p>
        </div>
        <div v-for="(version, i) in versions" :key="version.id"
          :class="['flex items-center gap-4 px-6 py-3.5 transition-all hover:bg-white/[0.03] group',
            i !== versions.length - 1 && 'border-b border-white/[0.04]']">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-white">{{ version.name }}</p>
              <span :class="['text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                version.version_type === 'release' ? 'bg-emerald-500/15 text-emerald-400' :
                version.version_type === 'beta' ? 'bg-amber-500/15 text-amber-400' :
                'bg-rose-500/15 text-rose-400']">
                {{ version.version_type }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span v-for="loader in version.loaders?.slice(0, 3)" :key="loader"
                class="text-[10px] px-1.5 py-0.5 rounded bg-mc-accent-blue/10 text-mc-accent-blue/70 font-medium">{{ loader }}</span>
              <span class="text-[10px] text-gray-600 mx-0.5">•</span>
              <span class="text-[10px] text-gray-500">MC {{ version.game_versions?.slice(0, 4).join(', ') }}
                <span v-if="version.game_versions?.length > 4" class="text-gray-600">+{{ version.game_versions.length - 4 }}</span>
              </span>
            </div>
          </div>
          <button @click="installVersion(version)"
            :disabled="installing === version.id"
            :class="['px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
              installing === version.id
                ? 'bg-mc-accent-blue/20 text-mc-accent-blue/60 cursor-wait'
                : 'bg-gradient-to-r from-mc-accent-blue to-blue-500 text-white shadow-lg shadow-mc-accent-blue/20 hover:shadow-mc-accent-blue/30 hover:scale-105 active:scale-95']">
            <div v-if="installing === version.id" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {{ installing === version.id ? 'Installing...' : 'Install' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ project: any }>()
const emit = defineEmits(['close', 'installed'])
const { apiFetch } = useApi()

const loading = ref(true)
const versions = ref<any[]>([])
const filterLoader = ref('paper')
const filterVersion = ref('')
const installing = ref<string | null>(null)
const mcVersions = ref<string[]>([])

async function fetchMCVersions() {
  try {
    const data = await apiFetch('/api/plugins/game-versions')
    mcVersions.value = (data.versions || []).filter((v: string) => /^1\.\d+/.test(v)).slice(0, 40)
  } catch (err) { console.error(err) }
}

async function fetchVersions() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filterLoader.value) params.set('loader', filterLoader.value)
    if (filterVersion.value) params.set('gameVersion', filterVersion.value)

    const data = await apiFetch(`/api/plugins/versions/${props.project.project_id}?${params}`)
    versions.value = data.slice(0, 25)
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

async function installVersion(version: any) {
  const file = version.files?.find((f: any) => f.primary) || version.files?.[0]
  if (!file) return

  installing.value = version.id
  try {
    await apiFetch('/api/plugins/install', {
      method: 'POST',
      body: { url: file.url, filename: file.filename },
    })
    emit('installed')
  } catch (err) { console.error(err) }
  finally { installing.value = null }
}

onMounted(() => {
  fetchMCVersions()
  fetchVersions()
})
</script>
