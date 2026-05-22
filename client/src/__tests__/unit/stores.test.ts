import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '@stores/task-store'

describe('Task Store', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      filters: { status: 'all', priority: 'all', search: '' },
      sort: { field: 'dueDate', direction: 'asc' },
    })
  })

  it('adds a task', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'high' as const,
      assignee: 'Alice',
      dueDate: '2026-05-25',
      labels: ['test'],
    }

    useTaskStore.getState().addTask(task)
    expect(useTaskStore.getState().tasks).toHaveLength(1)
    expect(useTaskStore.getState().tasks[0].title).toBe('Test Task')
  })

  it('updates a task', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'high' as const,
      assignee: 'Alice',
      dueDate: '2026-05-25',
      labels: ['test'],
    }

    useTaskStore.getState().addTask(task)
    useTaskStore.getState().updateTask('1', { status: 'done' })

    expect(useTaskStore.getState().tasks[0].status).toBe('done')
  })

  it('deletes a task', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'high' as const,
      assignee: 'Alice',
      dueDate: '2026-05-25',
      labels: ['test'],
    }

    useTaskStore.getState().addTask(task)
    useTaskStore.getState().deleteTask('1')

    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('filters tasks', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: '',
        status: 'todo' as const,
        priority: 'high' as const,
        assignee: 'Alice',
        dueDate: '2026-05-25',
        labels: [],
      },
      {
        id: '2',
        title: 'Task 2',
        description: '',
        status: 'done' as const,
        priority: 'low' as const,
        assignee: 'Bob',
        dueDate: '2026-05-26',
        labels: [],
      },
    ]

    tasks.forEach(t => useTaskStore.getState().addTask(t))
    useTaskStore.getState().setFilter({ status: 'done' })

    const filteredTasks = useTaskStore.getState().tasks.filter(
      t => t.status === 'done'
    )
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].title).toBe('Task 2')
  })
})