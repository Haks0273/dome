import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  
  const isLoggedIn = ref(true)

  return { isLoggedIn }
})
