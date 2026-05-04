import { io, type Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const serverStore = useServerStore()
  
  // Pastikan auth terisi dari localStorage sebelum konek
  if (process.client) {
    serverStore.initAuth()
  }

  const socket: Socket = io(config.public.backendUrl as string, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
      password: serverStore.panelPassword
    }
  })

  socket.on('connect', () => {
    console.log('[Socket] Connected to backend')
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message)
  })

  return {
    provide: {
      socket,
    },
  }
})
