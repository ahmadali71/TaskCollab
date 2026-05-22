import { clsx } from 'clsx'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium',
        sizes[size],
        className
      )}
    >
      {initials || '?'}
    </div>
  )
}

export default Avatar