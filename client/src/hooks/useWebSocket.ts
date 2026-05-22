import { useEffect, useRef } from 'react'

type MessageHandler = (data: any) => void

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const handlersRef = useRef<Map<string, MessageHandler[]>>(new Map())

  useEffect(() => {
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const handlers = handlersRef.current.get(data.type)
        if (handlers) {
          handlers.forEach((handler) => handler(data.payload))
        }
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          // Reconnect logic
        }
      }, 3000)
    }

    return () => {
      ws.close()
    }
  }, [url])

  const emit = (type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    }
  }

  const on = (type: string, handler: MessageHandler) => {
    const handlers = handlersRef.current.get(type) || []
    handlers.push(handler)
    handlersRef.current.set(type, handlers)

    return () => {
      const handlers = handlersRef.current.get(type) || []
      handlersRef.current.set(
        type,
        handlers.filter((h) => h !== handler)
      )
    }
  }

  return { emit, on }
}