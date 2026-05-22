import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid3X3, List, MoreVertical, Calendar, User } from 'lucide-react'
import { clsx } from 'clsx'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  labels: string[]
}

interface TaskListProps {
  tasks: Task[]
  onTaskClick?: (taskId: string) => void
  onTaskComplete?: (taskId: string) => void
  onTaskDelete?: (taskId: string) => void
}

export function TaskList({ tasks, onTaskClick, onTaskComplete, onTaskDelete }: TaskListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx("p-2", viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white')}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx("p-2", viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer"
                onClick={() => onTaskClick?.(task.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={clsx("px-2 py-1 text-xs rounded-full font-medium", getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {task.labels.map((label) => (
                    <span key={label} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {label}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    {task.dueDate && (
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{task.dueDate}</span>
                    )}
                    {task.assignee && (
                      <span className="flex items-center"><User className="w-3 h-3 mr-1" />{task.assignee}</span>
                    )}
                  </div>
                  {onTaskComplete && task.status !== 'done' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onTaskComplete(task.id); }}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border divide-y">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onTaskClick?.(task.id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={clsx("px-2 py-1 text-xs rounded-full", getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500">{task.dueDate}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}