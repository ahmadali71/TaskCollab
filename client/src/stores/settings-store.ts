import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  weekStartsOn: 0 | 1 | 6
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    sound: boolean
    dueDateReminder: number
  }
  accessibility: {
    highContrast: boolean
    reducedMotion: boolean
    fontSize: 'small' | 'medium' | 'large'
    screenReader: boolean
  }
  display: {
    compactMode: boolean
    showCompletedTasks: boolean
    defaultView: 'grid' | 'list' | 'kanban'
    tasksPerPage: number
  }
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  weekStartsOn: 0,
  notifications: {
    email: true,
    push: true,
    desktop: true,
    sound: true,
    dueDateReminder: 24,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
  },
  display: {
    compactMode: false,
    showCompletedTasks: true,
    defaultView: 'grid',
    tasksPerPage: 20,
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings: Partial<Settings>) =>
        set((state) => ({
          ...state,
          ...settings,
          notifications: settings.notifications
            ? { ...state.notifications, ...settings.notifications }
            : state.notifications,
          accessibility: settings.accessibility
            ? { ...state.accessibility, ...settings.accessibility }
            : state.accessibility,
          display: settings.display
            ? { ...state.display, ...settings.display }
            : state.display,
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)