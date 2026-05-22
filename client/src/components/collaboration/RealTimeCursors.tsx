import { motion } from 'framer-motion'

interface Cursor {
  id: string
  userId: string
  userName: string
  color: string
  x: number
  y: number
}

interface RealTimeCursorsProps {
  cursors: Cursor[]
}

export function RealTimeCursors({ cursors }: RealTimeCursorsProps) {
  return (
    <>
      {cursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: cursor.x - 5, y: cursor.y - 5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed pointer-events-none z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.65 12.3c-.93-.42-.51-1.82.49-1.73l11.84 1.12c1.15.11 1.34 1.68.23 2.06l-3.97 1.36c-.38.13-.67.42-.8.8l-1.36 3.97c-.38 1.11-1.95.92-2.06-.23L8.9 7.9c-.09-1 .8-1.42 1.73-.49l2.03 4.76c.17.4.53.69.93.81l4.23 1.3"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div
            className="ml-6 px-2 py-1 rounded-md text-xs text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </motion.div>
      ))}
    </>
  )
}