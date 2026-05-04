import type { Socket } from 'socket.io-client'

/**
 * Composable untuk mengakses Socket.io instance
 * Hanya bisa digunakan di client-side
 */
export function useSocket() {
  const nuxtApp = useNuxtApp()
  const socket = nuxtApp.$socket as Socket

  /**
   * Register event listener yang otomatis di-cleanup saat component unmount
   */
  function on(event: string, callback: (...args: any[]) => void) {
    socket.on(event, callback)

    // Auto cleanup on unmount
    if (getCurrentInstance()) {
      onUnmounted(() => {
        socket.off(event, callback)
      })
    }
  }

  /**
   * Emit event ke server
   */
  function emit(event: string, data?: any) {
    socket.emit(event, data)
  }

  return {
    socket,
    on,
    emit,
    connected: computed(() => socket.connected),
  }
}
