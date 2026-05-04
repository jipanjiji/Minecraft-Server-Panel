<template>
  <div class="space-y-6">
    <!-- Online Players -->
    <div class="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md">
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center ring-1 ring-emerald-500/20">
              <svg class="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-if="onlinePlayers.length > 0" class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#16162e] animate-pulse"></div>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">Online Players</h3>
            <p class="text-xs text-gray-500">{{ onlinePlayers.length }} player{{ onlinePlayers.length !== 1 ? 's' : '' }} online</p>
          </div>
        </div>
        <button @click="fetchAllPlayers" class="text-xs px-3.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10">
          ↻ Refresh
        </button>
      </div>

      <div v-if="onlinePlayers.length === 0" class="px-6 py-12 text-center">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/[0.03] flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <p class="text-sm text-gray-400 font-medium">Tidak ada player online</p>
        <p class="text-xs text-gray-600 mt-1">Player akan muncul secara real-time saat join server</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
        <div v-for="player in onlinePlayers" :key="player.uuid || player.name"
          class="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d0d1a]/60 border border-white/[0.06] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
          <div class="relative">
            <img :src="`https://crafatar.com/avatars/${player.uuid || '00000000-0000-0000-0000-000000000000'}?size=40&overlay`"
              class="w-11 h-11 rounded-xl ring-2 ring-emerald-500/20" :alt="player.name" loading="lazy" />
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#0d0d1a]"></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white truncate">{{ player.name }}</p>
            <p class="text-[10px] text-emerald-400/70 font-medium">● Online</p>
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button @click="doAction(player, 'heal')" title="Heal"
              class="p-2 rounded-lg hover:bg-emerald-500/15 text-gray-500 hover:text-emerald-400 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            <button @click="doAction(player, 'kill')" title="Kill"
              class="p-2 rounded-lg hover:bg-rose-500/15 text-gray-500 hover:text-rose-400 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </button>
            <button @click="doAction(player, 'kick')" title="Kick"
              class="p-2 rounded-lg hover:bg-amber-500/15 text-gray-500 hover:text-amber-400 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
            <button @click="openInventory(player)" title="View Inventory"
              class="p-2 rounded-lg hover:bg-mc-accent-blue/15 text-gray-500 hover:text-mc-accent-blue transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Players -->
    <div class="rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-[#16162e]/80 to-[#0f0f1a]/80 backdrop-blur-md">
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center ring-1 ring-violet-500/20">
            <svg class="w-4.5 h-4.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">All Players</h3>
            <p class="text-xs text-gray-500">{{ allPlayers.length }} player yang pernah join</p>
          </div>
        </div>
      </div>

      <div v-if="loadingAll" class="flex flex-col items-center justify-center py-12 gap-3">
        <div class="w-7 h-7 border-2 border-mc-accent-blue/20 border-t-mc-accent-blue rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500">Loading players...</p>
      </div>

      <div v-else class="divide-y divide-white/[0.04]">
        <div v-for="player in allPlayers" :key="player.uuid"
          class="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-all group">
          <div class="relative">
            <img :src="`https://crafatar.com/avatars/${player.uuid}?size=36&overlay`"
              class="w-9 h-9 rounded-lg ring-1 ring-white/[0.08]" :alt="player.name || player.uuid" loading="lazy" />
            <div v-if="player.isOnline" class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#16162e]"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-white truncate">{{ player.name || 'Loading...' }}</p>
              <span v-if="player.isOnline" class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase tracking-wider">Online</span>
            </div>
            <p class="text-[10px] text-gray-600 font-mono mt-0.5">{{ player.uuid }}</p>
          </div>
          <button @click="openInventory(player)" title="View Inventory"
            class="p-2 rounded-lg hover:bg-mc-accent-blue/15 text-gray-500 hover:text-mc-accent-blue transition-all opacity-0 group-hover:opacity-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Inventory Modal -->
    <Teleport to="body">
      <div v-if="showInventory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showInventory = false"></div>
        <InventoryViewer :player="selectedPlayer!" @close="showInventory = false" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { apiFetch } = useApi()
const onlinePlayers = ref<any[]>([])
const allPlayers = ref<any[]>([])
const loadingAll = ref(false)
const showInventory = ref(false)
const selectedPlayer = ref<any>(null)

async function fetchAllPlayers() {
  loadingAll.value = true
  try {
    const data = await apiFetch('/api/players/all')
    allPlayers.value = data.players || []
  } catch (err) { console.error(err) }
  finally { loadingAll.value = false }
}

async function doAction(player: any, action: string) {
  if (!player.uuid) return
  try {
    await apiFetch(`/api/players/${player.uuid}/action`, {
      method: 'POST',
      body: { action },
    })
  } catch (err) { console.error(err) }
}

function openInventory(player: any) {
  selectedPlayer.value = player
  showInventory.value = true
}

// Listen for real-time player updates via socket
if (import.meta.client) {
  const { on } = useSocket()
  on('players:update', (data: any) => {
    onlinePlayers.value = data.players || []
    // Also refresh allPlayers to update online status
    fetchAllPlayers()
  })
}

onMounted(() => { fetchAllPlayers() })
</script>
