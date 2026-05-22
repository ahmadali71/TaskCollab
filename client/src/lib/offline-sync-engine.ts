import { Task } from '../types/task'

interface SyncOperation {
  type: 'create' | 'update' | 'delete'
  task?: Task
  taskId?: string
  updates?: Partial<Task>
  operationId: string
  timestamp: number
  retryCount: number
}

export class OfflineSyncEngine {
  private dbName = 'TaskCollabOffline'
  private storeName = 'tasks'
  private syncQueueName = 'syncQueue'
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(this.syncQueueName)) {
          db.createObjectStore(this.syncQueueName, { keyPath: 'operationId' })
        }
      }
    })
  }

  async createTask(task: Task): Promise<Task> {
    const taskWithMeta = {
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }

    if (!navigator.onLine) {
      await this.addToSyncQueue({
        type: 'create',
        task: taskWithMeta,
        operationId: crypto.randomUUID(),
        timestamp: Date.now(),
        retryCount: 0,
      })
    }

    await this.saveToLocal(taskWithMeta)
    return taskWithMeta
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const existingTask = await this.getFromLocal(taskId)
    if (!existingTask) throw new Error('Task not found')

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existingTask.version + 1,
    }

    if (!navigator.onLine) {
      await this.addToSyncQueue({
        type: 'update',
        taskId,
        updates,
        operationId: crypto.randomUUID(),
        timestamp: Date.now(),
        retryCount: 0,
      })
    }

    await this.saveToLocal(updatedTask)
    return updatedTask
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!navigator.onLine) {
      await this.addToSyncQueue({
        type: 'delete',
        taskId,
        operationId: crypto.randomUUID(),
        timestamp: Date.now(),
        retryCount: 0,
      })
    }

    await this.deleteFromLocal(taskId)
  }

  async getAllTasks(): Promise<Task[]> {
    return this.getAllFromLocal()
  }

  async processSyncQueue(): Promise<void> {
    const queue = await this.getSyncQueue()
    
    for (const operation of queue) {
      try {
        console.log('Syncing operation:', operation)
        await this.removeFromSyncQueue(operation.operationId)
      } catch (error) {
        console.error('Sync failed for operation:', operation.operationId)
      }
    }
  }

  private async saveToLocal(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(task)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async getFromLocal(id: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  private async getAllFromLocal(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  private async deleteFromLocal(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async addToSyncQueue(operation: SyncOperation): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.syncQueueName], 'readwrite')
      const store = transaction.objectStore(this.syncQueueName)
      const request = store.put(operation)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async getSyncQueue(): Promise<SyncOperation[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.syncQueueName], 'readonly')
      const store = transaction.objectStore(this.syncQueueName)
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  private async removeFromSyncQueue(operationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { reject('Database not initialized'); return }
      
      const transaction = this.db.transaction([this.syncQueueName], 'readwrite')
      const store = transaction.objectStore(this.syncQueueName)
      const request = store.delete(operationId)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}