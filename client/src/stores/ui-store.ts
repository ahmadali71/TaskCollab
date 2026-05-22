import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type SidebarState = 'expanded' | 'collapsed'

interface UIState {
  theme: Theme
  sidebarState: SidebarState
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  toasts: Toast[]
  
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (isOpen: boolean) => void
  setSearchOpen: (isOpen: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarState: 'expanded',
      isMobileMenuOpen: false,
      isSearchOpen: false,
      toasts: [],

      setTheme: (theme: Theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleSidebar: () =>
        set((state) => ({
          sidebarState: state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),

      setMobileMenuOpen: (isOpen: boolean) =>
        set({ isMobileMenuOpen: isOpen }),

      setSearchOpen: (isOpen: boolean) =>
        set({ isSearchOpen: isOpen }),

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = Date.now().toString()
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }))

        if (toast.duration !== 0) {
          setTimeout(() => {
            set((state) => ({
              toasts: state.toasts.filter((t) => t.id !== id),
            }))
          }, toast.duration || 5000)
        }
      },

      removeToast: (id: string) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
      }),
    }
  )
)