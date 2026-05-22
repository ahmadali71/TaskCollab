import { motion } from 'framer-motion'
import { MoreVertical, Calendar, User } from 'lucide-react'
import { clsx } from 'clsx'

interface TaskCard3DProps {
  task: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    assignee?: string
    dueDate?: string
    labels: string[]
  }
  index: number
  onComplete?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isDragging?: boolean
}

export function TaskCard3D({ task, index, onComplete, onEdit, onDelete, isDragging }: TaskCard3DProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-orange-500 bg-orange-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-300 bg-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50 : 0
      }}
      exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
      whileHover={{ 
        scale: 1.02, 
        rotateY: 2,
        boxShadow: "0 20px 60px -12px rgba(0, 0, 0, 0.25)"
      }}
      className={clsx(
        "relative rounded-xl border-l-4 p-4 cursor-pointer transition-shadow",
        "transform-gpu preserve-3d perspective-1000",
        getPriorityColor(task.priority),
        isDragging && "shadow-2xl rotate-2"
      )}
      style={{ transformStyle: "preserve-3d" }}
      onClick={() => onEdit?.(task.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={clsx(
          "px-2 py-0.5 text-xs rounded-full font-medium",
          task.priority === 'critical' && "bg-red-200 text-red-800",
          task.priority === 'high' && "bg-orange-200 text-orange-800",
          task.priority === 'medium' && "bg-yellow-200 text-yellow-800",
          task.priority === 'low' && "bg-green-200 text-green-800",
        )}>
          {task.priority}
        </span>
        <button className="p-1 hover:bg-black/10 rounded" onClick={(e) => { e.stopPropagation(); }}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels.map((label) => (
          <span key={label} className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          {task.dueDate && (
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {task.dueDate}
            </span>
          )}
          {task.assignee && (
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {task.assignee}
            </span>
          )}
        </div>
        {onComplete && (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Complete
          </button>
        )}
      </div>
    </motion.div>
  )
}