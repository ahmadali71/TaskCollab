import { useState } from 'react'
import { Menu, X, Home, Search, PlusCircle, Bell, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

interface MobileShellProps {
  children: React.ReactNode
  title?: string
}

export function MobileShell({ children, title = 'TaskCollab' }: MobileShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/tasks' },
    { icon: PlusCircle, label: 'Add', path: '/tasks/new' },
    { icon: Bell, label: 'Alerts', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Side Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center space-y-1 px-3 py-1',
                  isActive ? 'text-primary-500' : 'text-gray-400'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}