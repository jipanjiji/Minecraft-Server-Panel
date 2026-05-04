<template>
  <div class="glass-card flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-mc-accent-blue/15 flex items-center justify-center">
          <svg class="w-4 h-4 text-mc-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-white">Server Files</h3>
      </div>
      <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium bg-mc-dark-900/50 px-2 py-1 rounded-md">
        {{ items?.length || 0 }} items
      </span>
    </div>

    <!-- Breadcrumb -->
    <div class="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-mc-dark-900/40 text-xs overflow-x-auto">
      <button @click="navigateTo('')" class="flex items-center gap-1 text-mc-accent-blue hover:text-mc-accent-blue/80 transition-colors flex-shrink-0 font-medium">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>root</span>
      </button>
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <svg class="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <button @click="navigateTo(crumb.path)" :class="['hover:text-mc-accent-blue transition-colors flex-shrink-0 font-medium', i === breadcrumbs.length - 1 ? 'text-white' : 'text-gray-400']">
          {{ crumb.name }}
        </button>
      </template>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="w-6 h-6 border-2 border-mc-accent-blue/30 border-t-mc-accent-blue rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="p-4 text-sm text-mc-accent-red bg-mc-accent-red/5 m-3 rounded-xl border border-mc-accent-red/15">
        {{ error }}
      </div>

      <div v-else class="py-1">
        <!-- Go up button -->
        <button v-if="currentPath" @click="goUp"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all group">
          <div class="w-8 h-8 rounded-lg bg-mc-dark-400/40 flex items-center justify-center group-hover:bg-mc-accent-blue/10 transition-colors">
            <svg class="w-4 h-4 group-hover:text-mc-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
          <span class="font-medium">..</span>
        </button>

        <!-- Directories section -->
        <div v-if="directories.length > 0">
          <div class="px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">Folders</div>
          <button v-for="item in directories" :key="item.path" @click="handleClick(item)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-all group hover:bg-white/[0.04]">
            <div class="w-8 h-8 rounded-lg bg-mc-accent-amber/10 flex items-center justify-center group-hover:bg-mc-accent-amber/20 transition-colors">
              <svg class="w-4 h-4 text-mc-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span class="flex-1 truncate text-gray-200 font-medium group-hover:text-white">{{ item.name }}</span>
            <svg class="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Files section -->
        <div v-if="files.length > 0">
          <div class="px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold mt-1">Files</div>
          <button v-for="item in files" :key="item.path" @click="handleClick(item)"
            :class="['w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-all group',
              selectedPath === item.path ? 'bg-mc-accent-blue/10 border-l-2 border-mc-accent-blue' : 'hover:bg-white/[0.04] border-l-2 border-transparent']">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-colors', getFileIconBg(item)]">
              <svg :class="['w-4 h-4', getFileIconColor(item)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span :class="['block truncate font-medium', selectedPath === item.path ? 'text-white' : 'text-gray-300 group-hover:text-white']">{{ item.name }}</span>
              <span class="block text-[10px] text-gray-500 mt-0.5">{{ getFileTypeLabel(item) }}</span>
            </div>
            <span class="text-[11px] text-gray-500 font-mono tabular-nums flex-shrink-0">{{ formatSize(item.size) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number | null
  ext?: string
}

const props = defineProps<{ selectedPath?: string }>()
const emit = defineEmits<{ (e: 'select', item: FileItem): void }>()

const { apiFetch } = useApi()
const items = ref<FileItem[]>([])
const currentPath = ref('')
const loading = ref(false)
const error = ref('')

const directories = computed(() => items.value?.filter(i => i.type === 'directory') || [])
const files = computed(() => items.value?.filter(i => i.type === 'file') || [])

const breadcrumbs = computed(() => {
  if (!currentPath.value) return []
  const parts = currentPath.value.split('/')
  return parts.map((name, i) => ({ name, path: parts.slice(0, i + 1).join('/') }))
})

async function loadDirectory(dirPath: string) {
  loading.value = true
  error.value = ''
  try {
    const data = await apiFetch(`/api/files/list?path=${encodeURIComponent(dirPath)}`)
    items.value = data.items
    currentPath.value = dirPath
  } catch (err: any) { 
    error.value = err.message 
    items.value = []
  }
  finally { loading.value = false }
}

function handleClick(item: FileItem) {
  if (item.type === 'directory') loadDirectory(item.path)
  else emit('select', item)
}

function navigateTo(path: string) { loadDirectory(path) }
function goUp() {
  const parts = currentPath.value.split('/')
  parts.pop()
  loadDirectory(parts.join('/'))
}

function formatSize(size: number | null) {
  if (size === null) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIconBg(item: FileItem) {
  const ext = item.ext || ''
  if (['.yml', '.yaml'].includes(ext)) return 'bg-mc-accent-green/10 group-hover:bg-mc-accent-green/20'
  if (['.properties'].includes(ext)) return 'bg-mc-accent-blue/10 group-hover:bg-mc-accent-blue/20'
  if (['.json'].includes(ext)) return 'bg-mc-accent-amber/10 group-hover:bg-mc-accent-amber/20'
  if (['.txt'].includes(ext)) return 'bg-gray-500/10 group-hover:bg-gray-500/20'
  if (['.bat', '.sh'].includes(ext)) return 'bg-mc-accent-purple/10 group-hover:bg-mc-accent-purple/20'
  if (['.log'].includes(ext)) return 'bg-gray-600/10'
  return 'bg-mc-dark-400/40 group-hover:bg-mc-dark-400/60'
}

function getFileIconColor(item: FileItem) {
  const ext = item.ext || ''
  if (['.yml', '.yaml'].includes(ext)) return 'text-mc-accent-green'
  if (['.properties'].includes(ext)) return 'text-mc-accent-blue'
  if (['.json'].includes(ext)) return 'text-mc-accent-amber'
  if (['.bat', '.sh'].includes(ext)) return 'text-mc-accent-purple'
  return 'text-gray-400'
}

function getFileTypeLabel(item: FileItem) {
  const ext = item.ext || ''
  const map: Record<string, string> = {
    '.yml': 'YAML Config', '.yaml': 'YAML Config', '.properties': 'Properties',
    '.json': 'JSON', '.txt': 'Text', '.bat': 'Batch Script', '.sh': 'Shell Script', '.log': 'Log File',
  }
  return map[ext] || ext.replace('.', '').toUpperCase() || 'File'
}

onMounted(() => { loadDirectory('') })
</script>
