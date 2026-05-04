import { defineStore } from 'pinia'

interface ConsoleLine {
  text: string
  timestamp: number
  type: 'info' | 'warn' | 'error' | 'panel' | 'command'
}

interface SystemStats {
  cpuUsage: number
  totalMem: number
  usedMem: number
  memPercent: number
  freeMem: number
}

interface ServerState {
  status: 'offline' | 'starting' | 'online' | 'stopping'
  consoleLogs: ConsoleLine[]
  cpuHistory: number[]
  ramHistory: number[]
  currentStats: SystemStats
  uptime: number
  pid: number | null
  socketConnected: boolean
  panelPassword: string | null
}

/**
 * Tentukan tipe log line berdasarkan konten
 */
function classifyLine(text: string): ConsoleLine['type'] {
  if (text.startsWith('[Panel]') || text.startsWith('[STDERR]')) return 'panel'
  if (text.startsWith('>')) return 'command'
  if (/\bWARN\b/i.test(text)) return 'warn'
  if (/\bERROR\b|Exception|FATAL/i.test(text)) return 'error'
  return 'info'
}

export const useServerStore = defineStore('server', {
  state: (): ServerState => ({
    status: 'offline',
    consoleLogs: [],
    cpuHistory: [],
    ramHistory: [],
    currentStats: {
      cpuUsage: 0,
      totalMem: 0,
      usedMem: 0,
      memPercent: 0,
      freeMem: 0,
    },
    uptime: 0,
    pid: null,
    socketConnected: false,
    panelPassword: null,
  }),

  getters: {
    isOnline: (state) => state.status === 'online',
    isOffline: (state) => state.status === 'offline',
    isTransitioning: (state) => state.status === 'starting' || state.status === 'stopping',

    formattedUptime: (state) => {
      if (!state.uptime) return '00:00:00'
      const totalSeconds = Math.floor(state.uptime / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return [hours, minutes, seconds].map(n => n.toString().padStart(2, '0')).join(':')
    },

    ramUsedGB: (state) => {
      return (state.currentStats.usedMem / (1024 ** 3)).toFixed(1)
    },

    ramTotalGB: (state) => {
      return (state.currentStats.totalMem / (1024 ** 3)).toFixed(1)
    },
  },

  actions: {
    updateStatus(data: { status: string; uptime?: number; pid?: number | null }) {
      this.status = data.status as ServerState['status']
      if (data.uptime !== undefined) this.uptime = data.uptime
      if (data.pid !== undefined) this.pid = data.pid
    },

    appendLog(line: string) {
      const entry: ConsoleLine = {
        text: line,
        timestamp: Date.now(),
        type: classifyLine(line),
      }
      this.consoleLogs.push(entry)

      // Limit buffer
      if (this.consoleLogs.length > 1000) {
        this.consoleLogs = this.consoleLogs.slice(-800)
      }
    },

    loadHistory(lines: string[]) {
      this.consoleLogs = lines.map(text => ({
        text,
        timestamp: Date.now(),
        type: classifyLine(text),
      }))
    },

    updateStats(stats: SystemStats & { timestamp: number }) {
      this.currentStats = {
        cpuUsage: stats.cpuUsage,
        totalMem: stats.totalMem,
        usedMem: stats.usedMem,
        memPercent: stats.memPercent,
        freeMem: stats.freeMem,
      }

      // Simpan history (max 30 data points = 1 menit)
      this.cpuHistory.push(stats.cpuUsage)
      this.ramHistory.push(stats.memPercent)

      if (this.cpuHistory.length > 30) this.cpuHistory.shift()
      if (this.ramHistory.length > 30) this.ramHistory.shift()
    },

    clearLogs() {
      this.consoleLogs = []
    },

    setSocketConnected(connected: boolean) {
      this.socketConnected = connected
    },

    setAuth(password: string) {
      this.panelPassword = password
      if (process.client) {
        localStorage.setItem('panel_password', password)
      }
    },

    logout() {
      this.panelPassword = null
      if (process.client) {
        localStorage.removeItem('panel_password')
      }
      navigateTo('/login')
    },

    initAuth() {
      if (process.client) {
        const saved = localStorage.getItem('panel_password')
        if (saved) this.panelPassword = saved
      }
    },
  },
})
