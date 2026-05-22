import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { TaskCard3D } from './TaskCard3D'
import { clsx } from 'clsx'

interface Column {
  id: string
  title: string
  tasks: any[]
  color: string
}

interface KanbanBoard3DProps {
  columns: Column[]
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void
  onTaskComplete?: (taskId: string) => void
  onTaskEdit?: (taskId: string) => void
  onTaskDelete?: (taskId: string) => void
  onAddTask?: (columnId: string) => void
}

export function KanbanBoard3D({ 
  columns, 
  onTaskMove, 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete,
  onAddTask 
}: KanbanBoard3DProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (columnId: string) => {
    setDragOverColumn(columnId)
  }

  const handleDrop = (toColumn: string) => {
    if (draggedTask && dragOverColumn) {
      const fromColumn = columns.find(col => 
        col.tasks.some(t => t.id === draggedTask)
      )?.id
      if (fromColumn && fromColumn !== toColumn) {
        onTaskMove?.(draggedTask, fromColumn, toColumn)
      }
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 p-6 min-h-[calc(100vh-200px)]" style={{ perspective: '2000px' }}>
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className={clsx(
              "flex-shrink-0 w-80 rounded-2xl p-4",
              "bg-gradient-to-b from-white to-gray-50",
              "border border-gray-200 shadow-lg",
              dragOverColumn === column.id && "ring-2 ring-primary-500"
            )}
            style={{ transformStyle: "preserve-3d" }}
            onDragOver={(e) => { e.preventDefault(); handleDragOver(column.id); }}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={clsx("w-3 h-3 rounded-full", column.color)} />
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="text-sm text-gray-500">{column.tasks.length}</span>
              </div>
              <button
                onClick={() => onAddTask?.(column.id)}
                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 min-h-[200px]">
              <AnimatePresence>
                {column.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <TaskCard3D
                      task={task}
                      index={index}
                      onComplete={onTaskComplete}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      isDragging={draggedTask === task.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {column.tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <p className="text-sm">No tasks</p>
                  <button
                    onClick={() => onAddTask?.(column.id)}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600"
                  >
                    + Add task
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}