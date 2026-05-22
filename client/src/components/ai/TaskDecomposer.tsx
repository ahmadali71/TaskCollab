import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Loader2, CheckCircle, Plus, ChevronRight } from 'lucide-react'

interface Subtask {
  id: string
  title: string
  estimatedHours: number
  completed: boolean
}

interface TaskDecomposerProps {
  taskTitle: string
  onSubtasksCreated: (subtasks: Subtask[]) => void
}

export function TaskDecomposer({ taskTitle, onSubtasksCreated }: TaskDecomposerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDecompose = async () => {
    setIsProcessing(true)
    
    // Simulate AI decomposition
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockSubtasks: Subtask[] = [
      { id: '1', title: 'Research and gather requirements', estimatedHours: 2, completed: false },
      { id: '2', title: 'Create initial design/wireframe', estimatedHours: 3, completed: false },
      { id: '3', title: 'Develop core functionality', estimatedHours: 8, completed: false },
      { id: '4', title: 'Write unit tests', estimatedHours: 3, completed: false },
      { id: '5', title: 'Code review and refactor', estimatedHours: 2, completed: false },
    ]
    
    setSubtasks(mockSubtasks)
    setIsProcessing(false)
    setIsExpanded(true)
  }

  const handleAccept = () => {
    onSubtasksCreated(subtasks)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900">AI Task Decomposer</h3>
        </div>
        {!isExpanded && (
          <button
            onClick={handleDecompose}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Analyzing...' : 'Break Down Task'}</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600 mb-3">
              AI suggests breaking down "{taskTitle}" into these subtasks:
            </p>
            
            {subtasks.map((subtask, index) => (
              <motion.div
                key={subtask.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <CheckCircle className="w-4 h-4 text-gray-300" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{subtask.title}</p>
                  <p className="text-xs text-gray-500">{subtask.estimatedHours}h estimated</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}

            <div className="flex space-x-2 pt-3">
              <button
                onClick={handleAccept}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
                <span>Accept All Subtasks</span>
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Customize
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}