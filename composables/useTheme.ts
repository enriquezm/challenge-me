export const useTheme = () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  onMounted(() => {
    if (process.client) {
      const saved = localStorage.getItem('theme')
      isDark.value = saved === 'dark'
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  })

  return {
    isDark: readonly(isDark),
    toggleTheme
  }
}