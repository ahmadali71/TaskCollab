import { useState } from 'react'
import { X, Plus, Calendar } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (task: any) => void
  onCancel: () => void
  initialData?: any
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'todo',
    dueDate: initialData?.dueDate || '',
    assignee: initialData?.assignee || '',
    labels: initialData?.labels || [],
  })
  const [newLabel, setNewLabel] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id || Date.now().toString(),
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData({ ...formData, labels: [...formData.labels, newLabel.trim()] })
      setNewLabel('')
    }
  }

  const removeLabel = (label: string) => {
    setFormData({ ...formData, labels: formData.labels.filter((l: string) => l !== label) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{initialData ? 'Edit Task' : 'New Task'}</h2>
        <button type="button" onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.labels.map((label: string) => (
            <span key={label} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
              <span>{label}</span>
              <button type="button" onClick={() => removeLabel(label)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm"
            placeholder="Add label"
          />
          <button type="button" onClick={addLabel} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}