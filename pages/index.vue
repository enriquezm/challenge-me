<template>
  <div class="app">
    <div class="container">
      <div class="header" :class="{ 'dimmed': expandedChallenge }">
        <h1 class="title">My Challenges</h1>
        <div class="controls">
          <select v-model="selectedCategory" class="category-filter">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <button @click="exportData" class="btn btn-secondary">
            Export
          </button>
          <button @click="toggleTheme" class="theme-toggle">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
          <button @click="showCreateForm = !showCreateForm" class="btn btn-primary">
            {{ showCreateForm ? 'Cancel' : 'New Challenge' }}
          </button>
        </div>
      </div>

      <div class="challenges-grid" :class="{ 'dimmed': expandedChallenge }">
        <div 
          v-for="challenge in filteredChallenges" 
          :key="challenge.id" 
          class="challenge-card"
          @click="expandChallenge(challenge)"
        >
          <div class="card-header">
            <h3 class="challenge-title">{{ challenge.title }}</h3>
            <span :class="'status-' + challenge.status" class="status-badge">
              {{ challenge.status }}
            </span>
          </div>
          
          <p class="challenge-description">{{ challenge.description }}</p>
          
          <div class="challenge-meta">
            <span class="category">{{ challenge.category }}</span>
            <span :class="'difficulty-' + challenge.difficulty" class="difficulty-badge">
              {{ challenge.difficulty }}
            </span>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span>Progress</span>
              <span>{{ challenge.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="`width: ${challenge.progress}%`"></div>
            </div>
          </div>

          <div class="card-actions" @click.stop>
            <button @click="confirmDelete(challenge)" class="btn btn-danger btn-sm">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredChallenges.length === 0" class="empty-state" :class="{ 'dimmed': expandedChallenge }">
        <p class="empty-message">No challenges yet. Create your first challenge!</p>
        <button @click="showCreateForm = true" class="btn btn-primary btn-lg">
          Create Challenge
        </button>
      </div>

      <!-- Inline Create Form -->
      <div v-if="showCreateForm" class="create-form">
        <h2 class="form-title">Create New Challenge</h2>
        <form @submit.prevent="createChallenge" class="form">
          <div class="form-grid">
            <div class="field">
              <label class="label">Title</label>
              <input v-model="form.title" type="text" required class="input" placeholder="Enter challenge title">
            </div>
            <div class="field">
              <label class="label">Category</label>
              <input v-model="form.category" type="text" required class="input" placeholder="e.g., Fitness, Learning">
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <textarea v-model="form.description" required rows="3" class="input" placeholder="Describe your challenge"></textarea>
          </div>
          <div class="form-grid">
            <div class="field">
              <label class="label">Difficulty</label>
              <select v-model="form.difficulty" required class="input">
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div class="field">
              <label class="label">Total Days</label>
              <input v-model.number="form.totalDays" type="number" min="1" max="365" required class="input" placeholder="Days">
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Create Challenge</button>
        </form>
      </div>
    </div>

    <!-- Expanded Challenge Modal -->
    <div v-if="expandedChallenge" class="modal-overlay" @click="closeExpanded">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h1 class="modal-title">{{ isEditing ? 'Edit Challenge' : expandedChallenge.title }}</h1>
          <div class="header-actions">
            <button @click="toggleEdit" class="btn btn-secondary btn-sm">
              {{ isEditing ? 'Cancel' : 'Edit' }}
            </button>
            <button @click="closeExpanded" class="close-btn">&times;</button>
          </div>
        </div>

        <div class="modal-content">
          <div v-if="!isEditing">
            <div class="section">
              <h3 class="section-title">Description</h3>
              <p class="section-text">{{ expandedChallenge.description }}</p>
            </div>

            <div class="info-grid">
              <div>
                <h4 class="info-label">Category</h4>
                <p class="info-value">{{ expandedChallenge.category }}</p>
              </div>
              <div>
                <h4 class="info-label">Difficulty</h4>
                <span :class="'difficulty-' + expandedChallenge.difficulty" class="difficulty-badge">
                  {{ expandedChallenge.difficulty }}
                </span>
              </div>
            </div>
          </div>

          <form v-else @submit.prevent="saveEdit" class="edit-form">
            <div class="field">
              <label class="label">Title</label>
              <input v-model="editForm.title" type="text" required class="input">
            </div>
            <div class="field">
              <label class="label">Description</label>
              <textarea v-model="editForm.description" required rows="3" class="input"></textarea>
            </div>
            <div class="form-grid">
              <div class="field">
                <label class="label">Category</label>
                <input v-model="editForm.category" type="text" required class="input">
              </div>
              <div class="field">
                <label class="label">Difficulty</label>
                <select v-model="editForm.difficulty" required class="input">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>

          <div class="section">
            <h4 class="info-label">Status</h4>
            <span :class="'status-' + expandedChallenge.status" class="status-badge">
              {{ expandedChallenge.status }}
            </span>
          </div>

          <div class="section">
            <div class="progress-header">
              <h4 class="info-label">Progress</h4>
              <span class="progress-text">{{ expandedChallenge.completedDays }}/{{ expandedChallenge.totalDays }} days ({{ expandedChallenge.progress }}%)</span>
            </div>
            <div class="day-grid">
              <div 
                v-for="i in expandedChallenge.totalDays" 
                :key="i"
                class="day-box"
                :class="{ 'completed': i <= expandedChallenge.completedDays }"
              ></div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <h4 class="info-label">Created</h4>
              <p class="info-value">{{ new Date(expandedChallenge.createdAt).toLocaleDateString() }}</p>
            </div>
            <div v-if="expandedChallenge.completedAt">
              <h4 class="info-label">Completed</h4>
              <p class="info-value">{{ new Date(expandedChallenge.completedAt).toLocaleDateString() }}</p>
            </div>
          </div>

          <div class="modal-actions">
            <div class="progress-controls">
              <button @click="decrementProgress" :disabled="expandedChallenge.completedDays <= 0" class="btn btn-secondary">
                -
              </button>
              <span class="progress-counter">{{ expandedChallenge.completedDays }}/{{ expandedChallenge.totalDays }}</span>
              <button @click="incrementProgress" :disabled="expandedChallenge.completedDays >= expandedChallenge.totalDays" class="btn btn-secondary">
                +
              </button>
            </div>
            <button @click="deleteExpandedChallenge" class="btn btn-danger">
              Delete Challenge
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirm.show" class="modal-overlay" @click="cancelDelete">
      <div class="confirm-modal" @click.stop>
        <h3 class="confirm-title">Delete Challenge</h3>
        <p class="confirm-message">Are you sure you want to delete "{{ deleteConfirm.challenge?.title }}"?</p>
        <div class="confirm-actions">
          <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDeleteAction" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { challenges, updateChallenge, deleteChallenge, addChallenge } = useChallenges()
const { isDark, toggleTheme } = useTheme()
const expandedChallengeId = ref(null)
const selectedCategory = ref('')
const deleteConfirm = ref({ show: false, challenge: null, fromModal: false })
const showCreateForm = ref(false)
const isEditing = ref(false)
const form = ref({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  totalDays: 30
})
const editForm = ref({
  title: '',
  description: '',
  category: '',
  difficulty: ''
})

const expandedChallenge = computed(() => 
  expandedChallengeId.value ? challenges.value.find(c => c.id === expandedChallengeId.value) : null
)

const uniqueCategories = computed(() => 
  [...new Set(challenges.value.map(c => c.category))].sort()
)

const filteredChallenges = computed(() => 
  selectedCategory.value ? challenges.value.filter(c => c.category === selectedCategory.value) : challenges.value
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

const expandChallenge = (challenge) => {
  expandedChallengeId.value = challenge.id
}

const closeExpanded = () => {
  expandedChallengeId.value = null
  isEditing.value = false
}

const toggleEdit = () => {
  if (!isEditing.value) {
    editForm.value = {
      title: expandedChallenge.value.title,
      description: expandedChallenge.value.description,
      category: expandedChallenge.value.category,
      difficulty: expandedChallenge.value.difficulty
    }
  }
  isEditing.value = !isEditing.value
}

const saveEdit = () => {
  updateChallenge(expandedChallenge.value.id, editForm.value)
  isEditing.value = false
}

const incrementProgress = () => {
  const completedDays = Math.min(expandedChallenge.value.totalDays, expandedChallenge.value.completedDays + 1)
  const progress = Math.round((completedDays / expandedChallenge.value.totalDays) * 100)
  const status = completedDays === expandedChallenge.value.totalDays ? 'completed' : completedDays > 0 ? 'in-progress' : 'not-started'
  updateChallenge(expandedChallenge.value.id, { 
    completedDays,
    progress, 
    status,
    completedAt: completedDays === expandedChallenge.value.totalDays ? new Date() : undefined
  })
}

const decrementProgress = () => {
  const completedDays = Math.max(0, expandedChallenge.value.completedDays - 1)
  const progress = Math.round((completedDays / expandedChallenge.value.totalDays) * 100)
  const status = completedDays === expandedChallenge.value.totalDays ? 'completed' : completedDays > 0 ? 'in-progress' : 'not-started'
  updateChallenge(expandedChallenge.value.id, { 
    completedDays,
    progress, 
    status,
    completedAt: completedDays === expandedChallenge.value.totalDays ? new Date() : undefined
  })
}

const deleteExpandedChallenge = () => {
  deleteConfirm.value = { show: true, challenge: expandedChallenge.value, fromModal: true }
}

const confirmDelete = (challenge) => {
  deleteConfirm.value = { show: true, challenge, fromModal: false }
}

const cancelDelete = () => {
  deleteConfirm.value = { show: false, challenge: null, fromModal: false }
}

const confirmDeleteAction = () => {
  deleteChallenge(deleteConfirm.value.challenge.id)
  if (deleteConfirm.value.fromModal) {
    closeExpanded()
  }
  cancelDelete()
}

const createChallenge = () => {
  addChallenge(form.value)
  form.value = { title: '', description: '', category: '', difficulty: '', totalDays: 30 }
  showCreateForm.value = false
}

const exportData = () => {
  if (process.client) {
    const data = localStorage.getItem('challenges')
    const blob = new Blob([data || '[]'], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'challenges.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background: white;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s;

  :global(.dark) & {
    background: #111;
  }
}

.container {
  max-width: 64rem;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  transition: opacity 0.3s;

  &.dimmed {
    opacity: 0.5;
  }
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-filter {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  color: #111;

  :global(.dark) & {
    background: #374151;
    border-color: #4b5563;
    color: white;
  }
}

.theme-toggle {
  padding: 0.5rem;
  background: #e5e7eb;

  &:hover {
    background: #d1d5db;
  }

  :global(.dark) & {
    background: #374151;

    &:hover {
      background: #4b5563;
    }
  }
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;

  &.btn-primary {
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
    }
  }

  &.btn-secondary {
    background: #4b5563;
    color: white;

    &:hover {
      background: #374151;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.btn-danger {
    background: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
    }
  }

  &.btn-sm {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }

  &.btn-lg {
    padding: 0.75rem 1.5rem;
  }
}

.challenges-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  transition: opacity 0.3s;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  &.dimmed {
    opacity: 0.5;
  }
}

.challenge-card {
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) & {
    background: #222;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.challenge-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: #111;

  :global(.dark) & {
    color: #60a5fa;
  }
}

.challenge-description {
  color: #111;
  margin-bottom: 0.75rem;

  :global(.dark) & {
    color: white;
  }
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category {
  font-size: 0.875rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.status-badge, .difficulty-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.status-not-started {
  background: #f3f4f6;
  color: #1f2937;
}

.status-in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-easy {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-hard {
  background: #fee2e2;
  color: #991b1b;
}

.progress-section {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.progress-bar {
  width: 100%;
  background: #e5e7eb;
  height: 0.5rem;
}

.progress-fill {
  background: #2563eb;
  height: 0.5rem;
  transition: width 0.3s;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  transition: opacity 0.3s;

  &.dimmed {
    opacity: 0.5;
  }
}

.empty-message {
  color: #111;
  margin-bottom: 1rem;

  :global(.dark) & {
    color: white;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal {
  background: #f9fafb;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(1);
  transition: all 0.3s;

  :global(.dark) & {
    background: #222;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #4b5563;
  color: white;

  &:hover {
    background: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-danger {
    background: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
    }
  }

  &.btn-sm {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }

  &.btn-lg {
    padding: 0.75rem 1.5rem;
  }
}

.challenges-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  transition: opacity 0.3s;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  &.dimmed {
    opacity: 0.5;
  }
}

.challenge-card {
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) & {
    background: #222;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.challenge-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: #111;

  :global(.dark) & {
    color: #60a5fa;
  }
}

.challenge-description {
  color: #111;
  margin-bottom: 0.75rem;

  :global(.dark) & {
    color: white;
  }
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.category {
  font-size: 0.875rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.status-badge, .difficulty-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.status-not-started {
  background: #f3f4f6;
  color: #1f2937;
}

.status-in-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-easy {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-hard {
  background: #fee2e2;
  color: #991b1b;
}

.progress-section {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.progress-bar {
  width: 100%;
  background: #e5e7eb;
  height: 0.5rem;
}

.progress-fill {
  background: #2563eb;
  height: 0.5rem;
  transition: width 0.3s;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  transition: opacity 0.3s;

  &.dimmed {
    opacity: 0.5;
  }
}

.empty-message {
  color: #111;
  margin-bottom: 1rem;

  :global(.dark) & {
    color: white;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal {
  background: #f9fafb;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(1);
  transition: all 0.3s;

  :global(.dark) & {
    background: #222;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #374151;
  }

  :global(.dark) & {
    color: #9ca3af;

    &:hover {
      color: #d1d5db;
    }
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-text {
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  font-size: 0.875rem;
}

.info-label {
  font-weight: 500;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.info-value {
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.progress-text {
  font-size: 1.125rem;
  font-weight: 600;
}

.day-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.25rem;
}

.day-box {
  width: 100%;
  height: 25px;
  background: #e5e7eb;

  &.completed {
    background: #10b981;
  }

  :global(.dark) & {
    background: #4b5563;

    &.completed {
      background: #10b981;
    }
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding-top: 1rem;
}

.progress-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-counter {
  font-weight: 500;
  min-width: 3rem;
  text-align: center;
}

.confirm-modal {
  background: white;
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  :global(.dark) & {
    background: #222;
  }
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.confirm-message {
  margin-bottom: 1.5rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.create-form {
  background: #f9fafb;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  :global(.dark) & {
    background: #222;
  }
}

.form-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #111;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  :global(.dark) & {
    background: #374151;
    border-color: #4b5563;
    color: white;
  }
}
</style>