<template>
  <div class="glass-card p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">{{ title }}</h3>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-3xl font-bold text-white">{{ currentValue }}</span>
          <span class="text-sm text-gray-500">{{ unit }}</span>
        </div>
      </div>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', iconBgClass]">
        <svg v-if="type === 'cpu'" class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        <svg v-else class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-32">
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <!-- Extra info -->
    <div v-if="subtitle" class="mt-3 text-xs text-gray-500">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  type: 'cpu' | 'ram'
  title: string
  currentValue: string
  unit: string
  subtitle?: string
  history: number[]
  color: string
  colorRgb: string
}>()

const iconBgClass = computed(() =>
  props.type === 'cpu' ? 'bg-mc-accent-blue/10' : 'bg-mc-accent-purple/10'
)

const iconColorClass = computed(() =>
  props.type === 'cpu' ? 'text-mc-accent-blue' : 'text-mc-accent-purple'
)

const chartData = computed(() => {
  const labels = Array.from({ length: 30 }, (_, i) => `${(30 - i) * 2}s`)
  const data = [...props.history]

  // Pad data ke 30 points
  while (data.length < 30) {
    data.unshift(0)
  }

  return {
    labels,
    datasets: [
      {
        data,
        borderColor: props.color,
        backgroundColor: `rgba(${props.colorRgb}, 0.08)`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: props.color,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    tooltip: {
      backgroundColor: '#1a1a2e',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 10,
      callbacks: {
        label: (ctx: any) => `${ctx.parsed.y.toFixed(1)}%`,
      },
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      min: 0,
      max: 100,
    },
  },
}
</script>
