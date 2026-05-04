<template>
  <div class="glass-card flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <div class="flex items-center gap-2 min-w-0">
        <svg class="w-4 h-4 text-mc-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <h3 class="text-sm font-semibold text-white truncate">
          {{ fileName || 'Pilih file untuk edit' }}
        </h3>
        <span v-if="hasChanges" class="w-2 h-2 rounded-full bg-mc-accent-amber flex-shrink-0" title="Unsaved changes"></span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="fileName"
          @click="saveFile"
          :disabled="saving || !hasChanges"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-mc-accent-green/15 text-mc-accent-green border border-mc-accent-green/20 hover:bg-mc-accent-green/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg v-if="saving" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ saving ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="flex-1 overflow-hidden relative">
      <div v-if="!fileName" class="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
        <svg class="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">Pilih file dari panel kiri untuk mengedit</p>
      </div>

      <div v-else-if="loadingFile" class="absolute inset-0 flex items-center justify-center">
        <div class="w-6 h-6 border-2 border-mc-accent-blue/30 border-t-mc-accent-blue rounded-full animate-spin"></div>
      </div>

      <div v-else class="h-full flex">
        <!-- Line Numbers -->
        <div class="py-4 px-2 text-right text-xs font-mono text-gray-700 select-none bg-mc-dark-900/30 border-r border-white/5 overflow-hidden flex-shrink-0">
          <div v-for="n in lineCount" :key="n" class="leading-6 h-6">{{ n }}</div>
        </div>

        <!-- Text Area -->
        <textarea
          ref="editorTextarea"
          v-model="editContent"
          id="file-editor-textarea"
          class="flex-1 p-4 bg-transparent text-gray-200 font-mono text-[13px] leading-6 outline-none resize-none"
          spellcheck="false"
          @keydown.ctrl.s.prevent="saveFile"
          @scroll="syncScroll"
        ></textarea>
      </div>
    </div>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast.show"
          :class="[
            'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-slide-up',
            toast.type === 'success' ? 'bg-mc-accent-green/20 text-mc-accent-green border border-mc-accent-green/30' : 'bg-mc-accent-red/20 text-mc-accent-red border border-mc-accent-red/30'
          ]"
        >
          <svg v-if="toast.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  filePath?: string
  fileName?: string
}>()

const { apiFetch } = useApi()
const editorTextarea = ref<HTMLTextAreaElement>()
const editContent = ref('')
const originalContent = ref('')
const loadingFile = ref(false)
const saving = ref(false)
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const hasChanges = computed(() => editContent.value !== originalContent.value)
const lineCount = computed(() => editContent.value.split('\n').length)

// Load file ketika filePath berubah
watch(
  () => props.filePath,
  async (newPath) => {
    if (!newPath) return
    loadingFile.value = true
    try {
      const data = await apiFetch(`/api/files/read?path=${encodeURIComponent(newPath)}`)
      editContent.value = data.content
      originalContent.value = data.content
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      loadingFile.value = false
    }
  }
)

async function saveFile() {
  if (!props.filePath || saving.value || !hasChanges.value) return
  saving.value = true
  try {
    await apiFetch('/api/files/write', {
      method: 'POST',
      body: {
        path: props.filePath,
        content: editContent.value,
      },
    })
    originalContent.value = editContent.value
    showToast('File berhasil disimpan!', 'success')
  } catch (err: any) {
    showToast(`Gagal menyimpan: ${err.message}`, 'error')
  } finally {
    saving.value = false
  }
}

function showToast(message: string, type: 'success' | 'error') {
  toast.show = true
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.show = false }, 3000)
}

function syncScroll() {
  // Scroll sync between line numbers and textarea handled by CSS
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
