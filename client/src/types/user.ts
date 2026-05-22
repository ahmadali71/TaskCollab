export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  settings?: UserSettings
  createdAt: string
  updatedAt: string
}

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationSettings
  accessibility: AccessibilitySettings
  display: DisplaySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  sound: boolean
  dueDateReminder: number
}

export interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  screenReader: boolean
}

export interface DisplaySettings {
  compactMode: boolean
  showCompletedTasks: boolean
  defaultView: 'grid' | 'list' | 'kanban'
  tasksPerPage: number
}