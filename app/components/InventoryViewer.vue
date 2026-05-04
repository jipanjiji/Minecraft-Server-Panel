<template>
  <div class="relative z-10 w-full max-w-2xl glass-card overflow-hidden" @click.stop>
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
      <div class="flex items-center gap-3">
        <img :src="`https://crafatar.com/avatars/${player.uuid}?size=40&overlay`"
          class="w-10 h-10 rounded-lg" :alt="player.name" />
        <div>
          <h3 class="text-sm font-bold text-white">{{ player.name }}</h3>
          <div class="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
            <span>❤ {{ playerData?.health || 0 }}/20</span>
            <span>🍖 {{ playerData?.foodLevel || 0 }}/20</span>
            <span>⭐ Level {{ playerData?.xpLevel || 0 }}</span>
          </div>
        </div>
      </div>
      <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-white/[0.06]">
      <button v-for="tab in ['Inventory', 'Enderchest']" :key="tab"
        @click="activeTab = tab"
        :class="['flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
          activeTab === tab ? 'text-mc-accent-blue border-b-2 border-mc-accent-blue' : 'text-gray-500 hover:text-gray-300']">
        {{ tab }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="w-6 h-6 border-2 border-mc-accent-blue/30 border-t-mc-accent-blue rounded-full animate-spin"></div>
    </div>

    <!-- Inventory Grid -->
    <div v-else class="p-5 space-y-4">
      <template v-if="activeTab === 'Inventory'">
        <!-- Armor Slots -->
        <div>
          <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Armor</p>
          <div class="flex gap-1.5">
            <div v-for="slot in [103,102,101,100]" :key="slot"
              :class="slotClass(getItem(armorItems, slot))"
              :title="getItem(armorItems, slot)?.id || 'Empty'">
              <span class="text-[10px] leading-none">{{ getItemEmoji(getItem(armorItems, slot)) }}</span>
              <span v-if="getItem(armorItems, slot)" class="absolute bottom-0 right-0.5 text-[8px] text-white/80">{{ getItem(armorItems, slot)?.count > 1 ? getItem(armorItems, slot)?.count : '' }}</span>
            </div>
            <div class="mx-1 w-px bg-white/10"></div>
            <div :class="slotClass(offhandItem)" :title="offhandItem?.id || 'Offhand'">
              <span class="text-[10px] leading-none">{{ getItemEmoji(offhandItem) }}</span>
            </div>
          </div>
        </div>

        <!-- Hotbar -->
        <div>
          <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Hotbar</p>
          <div class="flex gap-1.5">
            <div v-for="slot in 9" :key="slot - 1"
              :class="[slotClass(getItem(inventoryItems, slot - 1)), selectedSlot === slot - 1 ? 'ring-1 ring-mc-accent-green' : '']"
              :title="getItem(inventoryItems, slot - 1)?.id || 'Empty'">
              <span class="text-[10px] leading-none">{{ getItemEmoji(getItem(inventoryItems, slot - 1)) }}</span>
              <span v-if="getItem(inventoryItems, slot - 1)?.count > 1" class="absolute bottom-0 right-0.5 text-[8px] text-white/80">{{ getItem(inventoryItems, slot - 1)?.count }}</span>
            </div>
          </div>
        </div>

        <!-- Main Inventory -->
        <div>
          <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Inventory</p>
          <div class="grid grid-cols-9 gap-1.5">
            <div v-for="slot in 27" :key="slot + 8"
              :class="slotClass(getItem(inventoryItems, slot + 8))"
              :title="getItem(inventoryItems, slot + 8)?.id || 'Empty'">
              <span class="text-[10px] leading-none">{{ getItemEmoji(getItem(inventoryItems, slot + 8)) }}</span>
              <span v-if="getItem(inventoryItems, slot + 8)?.count > 1" class="absolute bottom-0 right-0.5 text-[8px] text-white/80">{{ getItem(inventoryItems, slot + 8)?.count }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Enderchest Grid -->
      <template v-if="activeTab === 'Enderchest'">
        <div>
          <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">Ender Chest (27 Slots)</p>
          <div class="grid grid-cols-9 gap-1.5">
            <div v-for="slot in 27" :key="slot - 1"
              :class="slotClass(getItem(enderchestItems, slot - 1))"
              :title="getItem(enderchestItems, slot - 1)?.id || 'Empty'">
              <span class="text-[10px] leading-none">{{ getItemEmoji(getItem(enderchestItems, slot - 1)) }}</span>
              <span v-if="getItem(enderchestItems, slot - 1)?.count > 1" class="absolute bottom-0 right-0.5 text-[8px] text-white/80">{{ getItem(enderchestItems, slot - 1)?.count }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Item Info -->
    <div v-if="!loading" class="px-5 pb-4">
      <p class="text-[10px] text-gray-600 text-center">
        ⓘ Data diambil dari file .dat terakhir. Player harus logout agar data terupdate.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ player: { uuid: string; name: string } }>()
defineEmits(['close'])
const { apiFetch } = useApi()

const loading = ref(true)
const activeTab = ref('Inventory')
const inventoryItems = ref<any[]>([])
const armorItems = ref<any[]>([])
const offhandItem = ref<any>(null)
const enderchestItems = ref<any[]>([])
const selectedSlot = ref(0)
const playerData = ref<any>(null)

function getItem(items: any[], slot: number) {
  return items.find(i => i.slot === slot) || null
}

function slotClass(item: any) {
  return [
    'relative w-10 h-10 rounded-lg flex items-center justify-center border transition-colors cursor-default',
    item ? 'bg-mc-dark-700/80 border-white/10 hover:border-mc-accent-blue/30' : 'bg-mc-dark-900/50 border-white/[0.04]'
  ]
}

function getItemEmoji(item: any) {
  if (!item) return ''
  const id = item.id?.replace('minecraft:', '') || ''
  // Map common items to emojis for visual representation
  const emojiMap: Record<string, string> = {
    diamond_sword: '⚔️', iron_sword: '🗡️', stone_sword: '🗡️', wooden_sword: '🗡️', netherite_sword: '⚔️',
    diamond_pickaxe: '⛏️', iron_pickaxe: '⛏️', stone_pickaxe: '⛏️', wooden_pickaxe: '⛏️', netherite_pickaxe: '⛏️',
    diamond_axe: '🪓', iron_axe: '🪓', bow: '🏹', crossbow: '🏹', trident: '🔱',
    diamond_helmet: '⛑️', iron_helmet: '⛑️', netherite_helmet: '⛑️', leather_helmet: '⛑️',
    diamond_chestplate: '🛡️', iron_chestplate: '🛡️', netherite_chestplate: '🛡️',
    diamond_leggings: '👖', iron_leggings: '👖', netherite_leggings: '👖',
    diamond_boots: '👢', iron_boots: '👢', netherite_boots: '👢',
    shield: '🛡️', totem_of_undying: '🗿',
    diamond: '💎', emerald: '💚', gold_ingot: '🥇', iron_ingot: '🔩', netherite_ingot: '⬛',
    apple: '🍎', golden_apple: '🍏', enchanted_golden_apple: '✨', bread: '🍞', cooked_beef: '🥩', cooked_porkchop: '🥩',
    coal: '⬛', torch: '🔥', ender_pearl: '🟣', blaze_rod: '🟠',
    oak_log: '🪵', stone: '🪨', dirt: '🟫', cobblestone: '⬜', sand: '🟨',
    bucket: '🪣', water_bucket: '💧', lava_bucket: '🟥',
    fishing_rod: '🎣', compass: '🧭', clock: '⏰', map: '🗺️', book: '📖', enchanted_book: '📕',
    experience_bottle: '🧪', potion: '🧪', arrow: '➡️', bone: '🦴', string: '🧵',
    redstone: '🔴', glowstone_dust: '🌟', gunpowder: '💣', tnt: '🧨',
  }
  return emojiMap[id] || '📦'
}

async function fetchInventory() {
  if (!props.player.uuid) return
  loading.value = true
  try {
    const [invData, ecData] = await Promise.all([
      apiFetch(`/api/players/${props.player.uuid}/inventory`),
      apiFetch(`/api/players/${props.player.uuid}/enderchest`),
    ])

    inventoryItems.value = invData.inventory || []
    armorItems.value = invData.armor || []
    offhandItem.value = invData.offhand?.[0] || null
    selectedSlot.value = invData.selectedSlot || 0
    playerData.value = invData
    enderchestItems.value = ecData.enderchest || []
  } catch (err) {
    console.error('Failed to fetch inventory:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchInventory())
</script>
