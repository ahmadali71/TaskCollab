export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignees: User[]
  labels: string[]
  dueDate?: Date
  completedAt?: Date
  estimatedHours?: number
  version: number
  createdAt: Date
  updatedAt: Date
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface Board {
  id: string
  name: string
  description?: string
  ownerId: string
  members: User[]
  createdAt: Date
  updatedAt: Date
}