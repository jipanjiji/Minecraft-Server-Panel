<template>
  <div class="animate-fade-in h-[calc(100vh-8rem)]">
    <div class="grid grid-cols-12 gap-4 h-full">
      <!-- File Tree (Left Panel) -->
      <div class="col-span-12 md:col-span-4 lg:col-span-3 h-full">
        <FileTree
          :selected-path="selectedFile?.path"
          @select="onFileSelect"
        />
      </div>

      <!-- File Editor (Right Panel) -->
      <div class="col-span-12 md:col-span-8 lg:col-span-9 h-full">
        <FileEditor
          :file-path="selectedFile?.path"
          :file-name="selectedFile?.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileItem {
  name: string
  path: string
  type: string
  size: number | null
  ext?: string
}

const selectedFile = ref<FileItem | null>(null)

function onFileSelect(item: FileItem) {
  selectedFile.value = item
}

useHead({
  title: 'File Manager - MC Panel',
})
</script>
