import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  children,
  onClick,
  className,
  danger = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700',
        className
      )}
    >
      {children}
    </button>
  )
}

Dropdown.Item = DropdownItem
export default Dropdown