<template>
  <div class="min-h-screen flex items-center justify-center bg-mc-dark-900 px-4 relative overflow-hidden">
    <!-- Background decor -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-mc-accent-blue/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mc-accent-purple/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo Area -->
      <div class="flex flex-col items-center mb-8 animate-fade-in">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-mc-accent-green to-mc-accent-blue flex items-center justify-center shadow-2xl shadow-mc-accent-green/20 mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight uppercase">MC Panel</h1>
        <p class="text-gray-500 text-sm font-medium mt-1">Minecraft Server Control Console</p>
      </div>

      <!-- Login Card -->
      <div class="rounded-3xl border border-white/[0.08] bg-mc-dark-700/50 backdrop-blur-xl p-8 shadow-2xl animate-slide-up">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-white mb-1">Welcome back</h2>
          <p class="text-gray-400 text-sm">Masukkan password panel untuk melanjutkan.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Panel Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 group-focus-within:text-mc-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                required
                class="w-full bg-mc-dark-900 border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-mc-accent-blue/50 focus:ring-4 focus:ring-mc-accent-blue/10 transition-all placeholder:text-gray-700 font-mono"
              />
            </div>
            <p v-if="error" class="text-rose-400 text-xs mt-3 ml-1 flex items-center gap-1.5 animate-shake">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              {{ error }}
            </p>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-mc-accent-blue to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-mc-accent-blue/20 hover:shadow-mc-accent-blue/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Authenticating...' : 'Access Panel' }}</span>
          </button>
        </form>
      </div>

      <!-- Footer info -->
      <p class="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
        Minecraft Remote Control &bull; Secure Connection
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const password = ref('')
const loading = ref(false)
const error = ref('')
const serverStore = useServerStore()
const config = useRuntimeConfig()

async function handleLogin() {
  if (!password.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await fetch(`${config.public.backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-panel-password': password.value
      }
    })
    
    const data = await res.json()
    
    if (res.ok) {
      serverStore.setAuth(password.value)
      // Refresh page to trigger socket reconnect with new auth
      window.location.href = '/'
    } else {
      error.value = data.error || 'Password salah!'
    }
  } catch (err) {
    error.value = 'Tidak dapat terhubung ke backend laptop.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login - MC Panel',
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
