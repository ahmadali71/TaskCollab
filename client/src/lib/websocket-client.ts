type MessageHandler = (data: any) => void

export class WebSocketClient {
  private socket: WebSocket | null = null
  private url: string
  private listeners: Map<string, Set<MessageHandler>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const handlers = this.listeners.get(data.type)
          if (handlers) {
            handlers.forEach((handler) => handler(data.payload))
          }
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }

  emit(type: string, payload: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket not connected, message queued')
      // Could implement message queuing here
    }
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(handler)

    return () => {
      this.listeners.get(type)?.delete(handler)
    }
  }

  off(type: string, handler?: MessageHandler): void {
    if (handler) {
      this.listeners.get(type)?.delete(handler)
    } else {
      this.listeners.delete(type)
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.listeners.clear()
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}