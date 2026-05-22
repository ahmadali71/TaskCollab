export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  assignees?: string[]
  labels: string[]
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  parentId?: string
  order?: number
  version: number
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface TaskFilter {
  status?: TaskStatus | null
  priority?: TaskPriority | null
  assignee?: string | null
  label?: string | null
  search?: string
  dueDate?: string | null
  boardId?: string
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
  cancelled: 'Cancelled',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}