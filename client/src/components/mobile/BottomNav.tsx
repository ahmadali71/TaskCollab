import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Home, ListTodo, PlusCircle, Bell, User } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: ListTodo, label: 'Tasks', path: '/tasks' },
  { icon: PlusCircle, label: 'New', path: '/tasks/new', primary: true },
  { icon: Bell, label: 'Alerts', path: '/notifications', badge: 3 },
  { icon: User, label: 'Profile', path: '/profile' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center space-y-1 px-3 py-1 relative',
                item.primary
                  ? 'text-white'
                  : isActive
                  ? 'text-primary-500'
                  : 'text-gray-400'
              )}
            >
              {item.primary ? (
                <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full -mt-8 shadow-lg">
                  <item.icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <item.icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}