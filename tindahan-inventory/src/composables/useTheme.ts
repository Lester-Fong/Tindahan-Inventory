import { ref, computed, watch } from 'vue'

const isDark = ref(false)

export const useTheme = () => {
  const theme = computed(() => isDark.value ? 'dark' : 'light')

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setTheme = (newTheme: 'dark' | 'light') => {
    isDark.value = newTheme === 'dark'
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme.value)
  }

  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = prefersDark
    }
    
    updateTheme()
  }

  // Watch for system theme changes
  watch(() => window.matchMedia('(prefers-color-scheme: dark)').matches, (prefersDark) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = prefersDark
      updateTheme()
    }
  })

  return {
    isDark,
    theme,
    toggleTheme,
    setTheme,
    initTheme
  }
}
