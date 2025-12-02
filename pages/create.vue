<template>
  <div class="app">
    <div class="container">
      <div class="form-card">
        <div class="header">
          <NuxtLink to="/" class="back-link">← Back</NuxtLink>
          <h1 class="title">Create New Challenge</h1>
        </div>

        <form @submit.prevent="createChallenge" class="form">
          <div class="field">
            <label class="label">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              required
              class="input"
              placeholder="Enter challenge title"
            >
          </div>

          <div class="field">
            <label class="label">Description</label>
            <textarea 
              v-model="form.description" 
              required
              rows="4"
              class="input textarea"
              placeholder="Describe your challenge"
            ></textarea>
          </div>

          <div class="field">
            <label class="label">Category</label>
            <input 
              v-model="form.category" 
              type="text" 
              required
              class="input"
              placeholder="e.g., Fitness, Learning, Health"
            >
          </div>

          <div class="field">
            <label class="label">Difficulty</label>
            <select 
              v-model="form.difficulty" 
              required
              class="input"
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="field">
            <label class="label">Total Days</label>
            <input 
              v-model.number="form.totalDays" 
              type="number" 
              min="1"
              max="365"
              required
              class="input"
              placeholder="Number of days for this challenge"
            >
          </div>

          <div class="actions">
            <button type="submit" class="btn btn-primary">
              Create Challenge
            </button>
            <NuxtLink to="/" class="btn btn-secondary">
              Cancel
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { addChallenge } = useChallenges()
const router = useRouter()

const form = ref({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  totalDays: 30
})

const createChallenge = () => {
  addChallenge(form.value)
  router.push('/')
}
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background: white;
  padding: 1.5rem;
  transition: all 0.3s;

  :global(.dark) & {
    background: #111;
  }
}

.container {
  max-width: 42rem;
  margin: 0 auto;
}

.form-card {
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;

  :global(.dark) & {
    background: #222;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-link {
  color: #2563eb;
  text-decoration: none;
  margin-right: 1rem;

  &:hover {
    color: #1d4ed8;
  }

  :global(.dark) & {
    color: #60a5fa;

    &:hover {
      color: #93c5fd;
    }
  }
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;

  :global(.dark) & {
    color: white;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111;
  margin-bottom: 0.5rem;

  :global(.dark) & {
    color: white;
  }
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
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

  &.textarea {
    resize: vertical;
  }
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;

  &.btn-primary {
    background: #2563eb;
    color: white;

    &:hover {
      background: #1d4ed8;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
  }

  &.btn-secondary {
    background: #e5e7eb;
    color: #111;

    &:hover {
      background: #d1d5db;
    }

    :global(.dark) & {
      background: #4b5563;
      color: white;

      &:hover {
        background: #374151;
      }
    }
  }
}
</style>