import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: string
  labels: string[]
}

interface TaskStore {
  tasks: Task[]
  filters: {
    status: string
    priority: string
    search: string
  }
  sort: {
    field: string
    direction: 'asc' | 'desc'
  }
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setFilter: (filter: Partial<TaskStore['filters']>) => void
  setSort: (sort: TaskStore['sort']) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      filters: {
        status: 'all',
        priority: 'all',
        search: '',
      },
      sort: {
        field: 'dueDate',
        direction: 'asc',
      },
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      setFilter: (filter) =>
        set((state) => ({
          filters: { ...state.filters, ...filter },
        })),
      setSort: (sort) =>
        set(() => ({
          sort,
        })),
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)