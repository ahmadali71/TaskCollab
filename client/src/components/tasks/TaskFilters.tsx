import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { clsx } from 'clsx'

interface TaskFiltersProps {
  onFilterChange: (filters: any) => void
  availableLabels?: string[]
  availableAssignees?: string[]
}

export function TaskFilters({ onFilterChange, availableLabels = [], availableAssignees = [] }: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    label: '',
    search: '',
    dueDate: '',
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      priority: '',
      assignee: '',
      label: '',
      search: '',
      dueDate: '',
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors",
            isOpen || activeFilterCount > 0
              ? "bg-primary-50 border-primary-300 text-primary-700"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Assignee</label>
            <select
              value={filters.assignee}
              onChange={(e) => handleFilterChange('assignee', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All</option>
              {availableAssignees.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
            <select
              value={filters.label}
              onChange={(e) => handleFilterChange('label', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">All</option>
              {availableLabels.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}