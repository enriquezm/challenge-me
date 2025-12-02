export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'not-started' | 'in-progress' | 'completed'
  createdAt: Date
  completedAt?: Date
  progress: number
  totalDays: number
  completedDays: number
}