import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={clsx('flex items-center h-16 px-4 border-b border-gray-200', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskCollab
              </span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* New Task Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            className={clsx(
              'w-full flex items-center space-x-3 px-3 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl',
              isCollapsed && 'justify-center'
            )}
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span>New Task</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar