<template>
  <div class="space-y-6">
    <!-- Server Properties -->
    <div class="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md">
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-mc-accent-blue/20 to-blue-600/10 flex items-center justify-center ring-1 ring-mc-accent-blue/20">
            <svg class="w-4.5 h-4.5 text-mc-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Server Properties</h3>
            <p class="text-xs text-gray-500">Edit pengaturan server.properties</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="resetForm" :disabled="!hasChanges"
            class="text-xs px-3.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 transition-all border border-transparent hover:border-white/10">
            Reset
          </button>
          <button @click="saveProperties" :disabled="!hasChanges || saving"
            :class="['text-xs px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2',
              hasChanges && !saving
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95'
                : 'bg-gray-700/30 text-gray-500 cursor-not-allowed']">
            <div v-if="saving" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <div class="w-7 h-7 border-2 border-mc-accent-blue/20 border-t-mc-accent-blue rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500">Loading properties...</p>
      </div>

      <div v-else class="divide-y divide-white/[0.04]">
        <template v-for="section in propertySections" :key="section.name">
          <div class="px-6 py-4">
            <h4 class="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
              <span>{{ section.icon }}</span>
              <span>{{ section.name }}</span>
            </h4>
            <div class="space-y-4">
              <div v-for="field in section.fields" :key="field.key"
                class="flex items-center justify-between gap-4 py-1">
                <div class="flex-1">
                  <label class="text-sm text-white font-semibold">{{ field.label }}</label>
                  <p class="text-[11px] text-gray-500 mt-0.5">{{ field.description }}</p>
                </div>

                <!-- Toggle -->
                <template v-if="field.type === 'boolean'">
                  <button @click="form[field.key] = form[field.key] === 'true' ? 'false' : 'true'"
                    :class="['relative w-12 h-6 rounded-full transition-all duration-200',
                      form[field.key] === 'true' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-inner shadow-emerald-600/30' : 'bg-gray-700/60']">
                    <div :class="['absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200',
                      form[field.key] === 'true' ? 'translate-x-[26px]' : 'translate-x-0.5']"></div>
                  </button>
                </template>

                <!-- Select -->
                <template v-else-if="field.type === 'select'">
                  <select v-model="form[field.key]"
                    class="bg-[#0d0d1a] text-gray-300 text-sm rounded-xl px-4 py-2 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/30 focus:ring-1 focus:ring-mc-accent-blue/10 min-w-[150px] transition-all appearance-none">
                    <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </template>

                <!-- Number -->
                <template v-else-if="field.type === 'number'">
                  <input v-model="form[field.key]" type="number" :min="field.min" :max="field.max"
                    class="w-28 bg-[#0d0d1a] text-white text-sm rounded-xl px-4 py-2 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/30 focus:ring-1 focus:ring-mc-accent-blue/10 text-center transition-all" />
                </template>

                <!-- Text -->
                <template v-else>
                  <input v-model="form[field.key]" type="text"
                    class="w-64 bg-[#0d0d1a] text-white text-sm rounded-xl px-4 py-2 border border-white/[0.08] outline-none hover:border-white/15 focus:border-mc-accent-blue/30 focus:ring-1 focus:ring-mc-accent-blue/10 transition-all" />
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Save reminder -->
      <div v-if="hasChanges" class="px-6 py-3.5 border-t border-amber-500/15 bg-amber-500/[0.04]">
        <p class="text-[11px] text-amber-400/80 text-center flex items-center justify-center gap-2">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          Kamu punya perubahan yang belum disimpan. Restart server setelah save agar berlaku.
        </p>
      </div>
    </div>

    <!-- World Stats -->
    <WorldStats />
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi()
const loading = ref(true)
const saving = ref(false)
const originalProps = ref<Record<string, string>>({})
const form = ref<Record<string, string>>({})

const hasChanges = computed(() => {
  return Object.keys(form.value).some(key => form.value[key] !== originalProps.value[key])
})

const propertySections = [
  {
    icon: '🎮', name: 'General',
    fields: [
      { key: 'motd', label: 'Server MOTD', description: 'Pesan yang tampil di server list', type: 'text' },
      { key: 'max-players', label: 'Max Players', description: 'Jumlah maksimal player', type: 'number', min: 1, max: 1000 },
      { key: 'difficulty', label: 'Difficulty', description: 'Tingkat kesulitan server', type: 'select', options: [
        { value: 'peaceful', label: 'Peaceful' }, { value: 'easy', label: 'Easy' },
        { value: 'normal', label: 'Normal' }, { value: 'hard', label: 'Hard' },
      ]},
      { key: 'gamemode', label: 'Default Gamemode', description: 'Gamemode default untuk player baru', type: 'select', options: [
        { value: 'survival', label: 'Survival' }, { value: 'creative', label: 'Creative' },
        { value: 'adventure', label: 'Adventure' }, { value: 'spectator', label: 'Spectator' },
      ]},
      { key: 'hardcore', label: 'Hardcore', description: 'Mode permainan hardcore (1 life)', type: 'boolean' },
      { key: 'force-gamemode', label: 'Force Gamemode', description: 'Paksa gamemode saat player join', type: 'boolean' },
      { key: 'allow-flight', label: 'Allow Flight', description: 'Izinkan player terbang tanpa elytra', type: 'boolean' },
    ],
  },
  {
    icon: '🌍', name: 'World',
    fields: [
      { key: 'level-name', label: 'World Name', description: 'Nama folder world', type: 'text' },
      { key: 'level-seed', label: 'World Seed', description: 'Seed untuk world generation', type: 'text' },
      { key: 'spawn-protection', label: 'Spawn Protection', description: 'Radius spawn protection (blocks)', type: 'number', min: 0, max: 256 },
      { key: 'view-distance', label: 'View Distance', description: 'Jarak render view (chunks)', type: 'number', min: 2, max: 32 },
      { key: 'simulation-distance', label: 'Simulation Distance', description: 'Jarak simulasi entity (chunks)', type: 'number', min: 2, max: 32 },
      { key: 'generate-structures', label: 'Generate Structures', description: 'Generate village, dungeon, dll', type: 'boolean' },
    ],
  },
  {
    icon: '🌐', name: 'Network',
    fields: [
      { key: 'server-port', label: 'Server Port', description: 'Port untuk koneksi Minecraft', type: 'number', min: 1, max: 65535 },
      { key: 'online-mode', label: 'Online Mode', description: 'Verifikasi akun Mojang (matikan untuk crack)', type: 'boolean' },
      { key: 'enable-rcon', label: 'Enable RCON', description: 'Remote console untuk admin jarak jauh', type: 'boolean' },
      { key: 'enable-query', label: 'Enable Query', description: 'Izinkan server query protocol', type: 'boolean' },
      { key: 'prevent-proxy-connections', label: 'Prevent Proxy', description: 'Block koneksi via proxy/VPN', type: 'boolean' },
    ],
  },
  {
    icon: '🔒', name: 'Security',
    fields: [
      { key: 'white-list', label: 'Whitelist', description: 'Hanya player di whitelist yang bisa join', type: 'boolean' },
      { key: 'enforce-whitelist', label: 'Enforce Whitelist', description: 'Kick player yang tidak ada di whitelist saat diaktifkan', type: 'boolean' },
      { key: 'enforce-secure-profile', label: 'Enforce Secure Profile', description: 'Wajibkan Mojang secure profile', type: 'boolean' },
      { key: 'player-idle-timeout', label: 'Idle Timeout', description: 'Kick player AFK setelah X menit (0 = off)', type: 'number', min: 0, max: 1440 },
    ],
  },
]

async function loadProperties() {
  loading.value = true
  try {
    const data = await apiFetch('/api/files/properties')
    originalProps.value = { ...data.properties }
    form.value = { ...data.properties }
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

async function saveProperties() {
  saving.value = true
  try {
    await apiFetch('/api/files/properties', {
      method: 'PUT',
      body: { properties: form.value },
    })
    originalProps.value = { ...form.value }
  } catch (err) { console.error(err) }
  finally { saving.value = false }
}

function resetForm() {
  form.value = { ...originalProps.value }
}

onMounted(() => loadProperties())
</script>
