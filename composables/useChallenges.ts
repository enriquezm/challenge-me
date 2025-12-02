import type { Challenge } from '~/types/challenge'

export const useChallenges = () => {
  const challenges = ref<Challenge[]>([])

  const loadChallenges = () => {
    if (process.client) {
      const stored = localStorage.getItem('challenges')
      const loadedChallenges = stored ? JSON.parse(stored) : []
      // Migrate existing challenges to include totalDays and completedDays
      challenges.value = loadedChallenges.map(challenge => ({
        ...challenge,
        totalDays: challenge.totalDays || 100,
        completedDays: challenge.completedDays || challenge.progress || 0
      }))
    }
  }

  const saveChallenges = () => {
    if (process.client) {
      localStorage.setItem('challenges', JSON.stringify(challenges.value))
    }
  }

  const addChallenge = (challenge: Omit<Challenge, 'id' | 'createdAt' | 'progress' | 'completedDays'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: Date.now().toString(),
      createdAt: new Date(),
      progress: 0,
      status: 'not-started',
      completedDays: 0
    }
    challenges.value.push(newChallenge)
    saveChallenges()
  }

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    const index = challenges.value.findIndex(c => c.id === id)
    if (index !== -1) {
      challenges.value[index] = { ...challenges.value[index], ...updates }
      saveChallenges()
    }
  }

  const deleteChallenge = (id: string) => {
    challenges.value = challenges.value.filter(c => c.id !== id)
    saveChallenges()
  }

  onMounted(() => {
    loadChallenges()
  })

  return {
    challenges: readonly(challenges),
    addChallenge,
    updateChallenge,
    deleteChallenge
  }
}