export const useApi = () => {
  const config = useRuntimeConfig()
  const serverStore = useServerStore()

  /**
   * Wrapper untuk $fetch yang otomatis menambahkan header password
   */
  const apiFetch = async <T = any>(path: string, options: any = {}) => {
    // Pastikan auth terisi jika belum ada
    if (!serverStore.panelPassword && process.client) {
      serverStore.initAuth()
    }

    // Gabungkan header default dengan header kustom
    const headers = {
      'x-panel-password': serverStore.panelPassword || '',
      ...options.headers,
    }

    try {
      const baseUrl = config.public.backendUrl.endsWith('/') 
        ? config.public.backendUrl.slice(0, -1) 
        : config.public.backendUrl

      const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

      return await $fetch<T>(fullUrl, {
        ...options,
        headers,
      })
    } catch (err: any) {
      // Jika error 401 (Unauthorized), logout dan ke login page
      if (err.status === 401) {
        serverStore.logout()
      }
      throw err
    }
  }

  return {
    apiFetch,
  }
}
