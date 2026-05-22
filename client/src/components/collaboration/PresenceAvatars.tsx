import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface User {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'idle' | 'offline'
  currentTask?: string
}

interface PresenceAvatarsProps {
  users: User[]
  maxVisible?: number
}

export function PresenceAvatars({ users, maxVisible = 5 }: PresenceAvatarsProps) {
  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = users.length - maxVisible

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        <AnimatePresence>
          {visibleUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
              style={{ zIndex: visibleUsers.length - index }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              
              <span className={clsx(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                getStatusColor(user.status)
              )} />

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                <p className="font-medium">{user.name}</p>
                {user.currentTask && (
                  <p className="text-gray-300 text-xs">Viewing: {user.currentTask}</p>
                )}
                <p className="text-gray-400 text-xs capitalize">{user.status}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {remainingCount > 0 && (
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
      
      <span className="ml-3 text-sm text-gray-500">
        {users.filter(u => u.status === 'online').length} online
      </span>
    </div>
  )
}