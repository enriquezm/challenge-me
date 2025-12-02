<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <div v-if="challenge" class="bg-white rounded-lg shadow p-8">
        <div class="flex items-center mb-6">
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 mr-4">← Back</NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">{{ challenge.title }}</h1>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold mb-2">Description</h3>
            <p class="text-gray-700">{{ challenge.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-900">Category</h4>
              <p class="text-gray-600">{{ challenge.category }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">Difficulty</h4>
              <span :class="difficultyColor(challenge.difficulty)" class="px-2 py-1 rounded text-sm">
                {{ challenge.difficulty }}
              </span>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 mb-2">Status</h4>
            <span :class="statusColor(challenge.status)" class="px-3 py-1 rounded">
              {{ challenge.status }}
            </span>
          </div>

          <div>
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-medium text-gray-900">Progress</h4>
              <span class="text-lg font-semibold">{{ challenge.progress }}%</span>
            </div>
            <div class="grid grid-cols-10 gap-1">
              <div 
                v-for="i in 100" 
                :key="i"
                class="w-3 h-3 rounded-sm"
                :class="i <= challenge.progress ? 'bg-green-500' : 'bg-gray-200'"
              ></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 class="font-medium text-gray-900">Created</h4>
              <p>{{ new Date(challenge.createdAt).toLocaleDateString() }}</p>
            </div>
            <div v-if="challenge.completedAt">
              <h4 class="font-medium text-gray-900">Completed</h4>
              <p>{{ new Date(challenge.completedAt).toLocaleDateString() }}</p>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button @click="updateProgress" class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Update Progress
            </button>
            <button @click="deleteAndReturn" class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              Delete Challenge
            </button>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-gray-500">Challenge not found</p>
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">← Back to challenges</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { challenges, updateChallenge, deleteChallenge } = useChallenges()

const challenge = computed(() => 
  challenges.value.find(c => c.id === route.params.id)
)

const statusColor = (status) => {
  const colors = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return colors[status]
}

const difficultyColor = (difficulty) => {
  const colors = {
    'easy': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'hard': 'bg-red-100 text-red-800'
  }
  return colors[difficulty]
}

const updateProgress = () => {
  const newProgress = prompt(`Update progress for "${challenge.value.title}" (0-100):`, challenge.value.progress)
  if (newProgress !== null) {
    const progress = Math.min(100, Math.max(0, parseInt(newProgress) || 0))
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
    updateChallenge(challenge.value.id, { 
      progress, 
      status,
      completedAt: progress === 100 ? new Date() : undefined
    })
  }
}

const deleteAndReturn = () => {
  if (confirm(`Delete "${challenge.value.title}"?`)) {
    deleteChallenge(challenge.value.id)
    router.push('/')
  }
}
</script>