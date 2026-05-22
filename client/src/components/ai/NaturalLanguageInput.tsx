import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Mic, Loader2, X } from 'lucide-react'

interface NaturalLanguageInputProps {
  onTaskCreate: (task: any) => void
  placeholder?: string
}

export function NaturalLanguageInput({ onTaskCreate, placeholder }: NaturalLanguageInputProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const examplePrompts = [
    'Create task: Call dentist tomorrow 2pm #personal',
    'Remind me to review PRs every Monday 9am',
    'Add high-priority: Fix login bug @team before Friday',
  ]

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return
    setIsProcessing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockTask = {
      id: Date.now().toString(),
      title: text.replace(/^(create|add|remind)\s+(task:?\s*)?/i, ''),
      description: '',
      status: 'todo',
      priority: text.toLowerCase().includes('urgent') || text.toLowerCase().includes('high-priority') ? 'high' : 'medium',
      labels: [],
      dueDate: text.includes('tomorrow') ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : undefined,
    }

    onTaskCreate(mockTask)
    setInput('')
    setIsProcessing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "relative rounded-2xl border-2 transition-all duration-300",
          isProcessing ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white",
          "shadow-lg hover:shadow-xl"
        )}
      >
        <div className="flex items-center p-4 space-x-3">
          <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Try: "Create high-priority task: Review Q4 budget by Friday"'}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
          />

          <button
            onClick={() => setIsListening(!isListening)}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isProcessing}
            className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSubmit(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
          >
            {prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function clsx(...args: any[]) {
  return args.filter(Boolean).join(' ')
}