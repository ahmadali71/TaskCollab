import { useState, useEffect } from 'react'

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [pendingChanges, setPendingChanges] = useState(0)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      syncChanges()
    }
    
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const queueChange = (change: any) => {
    const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    queue.push({
      ...change,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    })
    localStorage.setItem('offline-queue', JSON.stringify(queue))
    setPendingChanges(queue.length)
  }

  const syncChanges = async () => {
    const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    if (!isOffline && queue.length > 0) {
      try {
        // Process each queued change
        for (const change of queue) {
          console.log('Syncing:', change)
          // API call would go here
        }
        localStorage.setItem('offline-queue', '[]')
        setPendingChanges(0)
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }
  }

  const getPendingChanges = () => {
    const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]')
    return queue
  }

  return {
    isOffline,
    pendingChanges,
    queueChange,
    syncChanges,
    getPendingChanges,
  }
}