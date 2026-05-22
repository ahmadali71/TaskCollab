export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TaskCollab'
export const APP_DESCRIPTION = 'AI-Powered Collaborative Task Management'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002'

export const TASK_STATUSES = [
  { value: 'todo', label: 'To Do', color: 'gray' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'review', label: 'Review', color: 'purple' },
  { value: 'done', label: 'Done', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
] as const

export const THEMES = {
  light: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#111827',
  },
  dark: {
    primary: '#60a5fa',
    background: '#111827',
    text: '#f9fafb',
  },
} as const