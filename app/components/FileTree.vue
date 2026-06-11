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
      <div class="flex items-center gap-2">
        <button @click="openCreateModal('file')" title="New File" class="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-mc-accent-blue/15 text-gray-400 hover:text-mc-accent-blue flex items-center justify-center transition-all border border-white/[0.05]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button @click="openCreateModal('directory')" title="New Folder" class="w-7 h-7 rounded-md bg-white/[0.04] hover:bg-mc-accent-amber/15 text-gray-400 hover:text-mc-accent-amber flex items-center justify-center transition-all border border-white/[0.05]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </button>
        <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium bg-mc-dark-900/50 px-2 py-1 rounded-md">
          {{ items?.length || 0 }}
        </span>
      </div>
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
          <div v-for="item in directories" :key="item.path"
            class="w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-all group hover:bg-white/[0.04]">
            <button @click="handleClick(item)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
              <div class="w-8 h-8 rounded-lg bg-mc-accent-amber/10 flex items-center justify-center group-hover:bg-mc-accent-amber/20 transition-colors">
                <svg class="w-4 h-4 text-mc-accent-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <span class="flex-1 truncate text-gray-200 font-medium group-hover:text-white">{{ item.name }}</span>
            </button>
            
            <!-- Folder Actions (Hover) -->
            <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
              <button @click.stop="openRenameModal(item)" title="Rename" class="w-6 h-6 rounded bg-white/[0.05] hover:bg-white/[0.12] text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button @click.stop="openDeleteModal(item)" title="Delete" class="w-6 h-6 rounded bg-mc-accent-red/10 hover:bg-mc-accent-red/20 text-mc-accent-red/70 hover:text-mc-accent-red flex items-center justify-center transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Files section -->
        <div v-if="files.length > 0">
          <div class="px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold mt-1">Files</div>
          <div v-for="item in files" :key="item.path"
            :class="['w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-all group border-l-2',
              selectedPath === item.path ? 'bg-mc-accent-blue/10 border-mc-accent-blue' : 'hover:bg-white/[0.04] border-transparent']">
            <button @click="handleClick(item)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0', getFileIconBg(item)]">
                <svg :class="['w-4 h-4', getFileIconColor(item)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span :class="['block truncate font-medium', selectedPath === item.path ? 'text-white' : 'text-gray-300 group-hover:text-white']">{{ item.name }}</span>
                <span class="block text-[10px] text-gray-500 mt-0.5">{{ getFileTypeLabel(item) }}</span>
              </div>
            </button>

            <!-- Size or Actions (Hover) -->
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-gray-500 font-mono tabular-nums flex-shrink-0 group-hover:hidden">{{ formatSize(item.size) }}</span>
              
              <div class="hidden group-hover:flex items-center gap-1.5 pl-2 flex-shrink-0">
                <button @click.stop="openRenameModal(item)" title="Rename" class="w-6 h-6 rounded bg-white/[0.05] hover:bg-white/[0.12] text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click.stop="openDeleteModal(item)" title="Delete" class="w-6 h-6 rounded bg-mc-accent-red/10 hover:bg-mc-accent-red/20 text-mc-accent-red/70 hover:text-mc-accent-red flex items-center justify-center transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Create Modal (File/Folder) -->
    <div v-if="createModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="glass-card w-full max-w-md p-5 border border-white/[0.08] shadow-2xl relative">
        <h4 class="text-base font-semibold text-white mb-1">
          Create New {{ createModal.type === 'directory' ? 'Folder' : 'File' }}
        </h4>
        <p class="text-xs text-gray-400 mb-4">Create in /{{ currentPath }}</p>
        
        <input v-model="createModal.name" @keyup.enter="handleCreateSubmit" ref="createInputRef"
          type="text" placeholder="Enter name..." 
          class="w-full bg-mc-dark-900/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-mc-accent-blue/50 transition-colors mb-4" />

        <div v-if="createModal.error" class="text-xs text-mc-accent-red bg-mc-accent-red/10 p-2.5 rounded-lg border border-mc-accent-red/10 mb-4">
          {{ createModal.error }}
        </div>

        <div class="flex justify-end gap-2 text-xs font-semibold">
          <button @click="createModal.show = false" class="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button @click="handleCreateSubmit" :disabled="createModal.loading" class="px-4 py-2 rounded-lg bg-mc-accent-blue hover:bg-mc-accent-blue/80 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <span v-if="createModal.loading" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Rename Modal -->
    <div v-if="renameModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="glass-card w-full max-w-md p-5 border border-white/[0.08] shadow-2xl">
        <h4 class="text-base font-semibold text-white mb-1">Rename File / Folder</h4>
        <p class="text-xs text-gray-400 mb-4 truncate">From: {{ renameModal.item?.name }}</p>
        
        <input v-model="renameModal.newName" @keyup.enter="handleRenameSubmit" ref="renameInputRef"
          type="text" placeholder="New name..." 
          class="w-full bg-mc-dark-900/60 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-mc-accent-blue/50 transition-colors mb-4" />

        <div v-if="renameModal.error" class="text-xs text-mc-accent-red bg-mc-accent-red/10 p-2.5 rounded-lg border border-mc-accent-red/10 mb-4">
          {{ renameModal.error }}
        </div>

        <div class="flex justify-end gap-2 text-xs font-semibold">
          <button @click="renameModal.show = false" class="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button @click="handleRenameSubmit" :disabled="renameModal.loading" class="px-4 py-2 rounded-lg bg-mc-accent-blue hover:bg-mc-accent-blue/80 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <span v-if="renameModal.loading" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
            Rename
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="glass-card w-full max-w-md p-5 border border-mc-accent-red/10 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-[3px] bg-mc-accent-red"></div>
        <h4 class="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-mc-accent-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Delete Confirmation
        </h4>
        <p class="text-sm text-gray-300 mb-4">
          Are you sure you want to delete <span class="font-mono text-white bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.06] text-xs font-semibold">{{ deleteModal.item?.name }}</span>? 
          This action cannot be undone.
        </p>

        <div v-if="deleteModal.error" class="text-xs text-mc-accent-red bg-mc-accent-red/10 p-2.5 rounded-lg border border-mc-accent-red/10 mb-4">
          {{ deleteModal.error }}
        </div>

        <div class="flex justify-end gap-2 text-xs font-semibold">
          <button @click="deleteModal.show = false" class="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button @click="handleDeleteSubmit" :disabled="deleteModal.loading" class="px-4 py-2 rounded-lg bg-mc-accent-red hover:bg-mc-accent-red/80 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5">
            <span v-if="deleteModal.loading" class="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
            Delete Permanently
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

// Modal Reactive States
const createModal = reactive({
  show: false,
  type: 'file' as 'file' | 'directory',
  name: '',
  loading: false,
  error: '',
})
const createInputRef = ref<HTMLInputElement | null>(null)

const renameModal = reactive({
  show: false,
  item: null as FileItem | null,
  newName: '',
  loading: false,
  error: '',
})
const renameInputRef = ref<HTMLInputElement | null>(null)

const deleteModal = reactive({
  show: false,
  item: null as FileItem | null,
  loading: false,
  error: '',
})

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

// Modal actions
function openCreateModal(type: 'file' | 'directory') {
  createModal.type = type
  createModal.name = ''
  createModal.error = ''
  createModal.loading = false
  createModal.show = true
  nextTick(() => createInputRef.value?.focus())
}

async function handleCreateSubmit() {
  if (!createModal.name.trim()) {
    createModal.error = 'Name cannot be empty'
    return
  }
  createModal.loading = true
  createModal.error = ''
  try {
    await apiFetch('/api/files/create', {
      method: 'POST',
      body: {
        path: currentPath.value,
        name: createModal.name.trim(),
        type: createModal.type,
      },
    })
    createModal.show = false
    await loadDirectory(currentPath.value)
  } catch (err: any) {
    createModal.error = err.data?.error || err.message
  } finally {
    createModal.loading = false
  }
}

function openRenameModal(item: FileItem) {
  renameModal.item = item
  renameModal.newName = item.name
  renameModal.error = ''
  renameModal.loading = false
  renameModal.show = true
  nextTick(() => renameInputRef.value?.focus())
}

async function handleRenameSubmit() {
  if (!renameModal.newName.trim()) {
    renameModal.error = 'Name cannot be empty'
    return
  }
  if (renameModal.newName.trim() === renameModal.item?.name) {
    renameModal.show = false
    return
  }
  renameModal.loading = true
  renameModal.error = ''
  try {
    await apiFetch('/api/files/rename', {
      method: 'POST',
      body: {
        path: renameModal.item?.path,
        newName: renameModal.newName.trim(),
      },
    })
    renameModal.show = false
    await loadDirectory(currentPath.value)
  } catch (err: any) {
    renameModal.error = err.data?.error || err.message
  } finally {
    renameModal.loading = false
  }
}

function openDeleteModal(item: FileItem) {
  deleteModal.item = item
  deleteModal.error = ''
  deleteModal.loading = false
  deleteModal.show = true
}

async function handleDeleteSubmit() {
  if (!deleteModal.item) return
  deleteModal.loading = true
  deleteModal.error = ''
  try {
    await apiFetch('/api/files/delete', {
      method: 'POST',
      body: {
        path: deleteModal.item.path,
      },
    })
    deleteModal.show = false
    await loadDirectory(currentPath.value)
  } catch (err: any) {
    deleteModal.error = err.data?.error || err.message
  } finally {
    deleteModal.loading = false
  }
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
