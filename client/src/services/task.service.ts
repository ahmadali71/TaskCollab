import { api } from '../lib/api';
import { authService } from '@services/auth.service';

export const taskService = {
  async getTasks(params?: Record<string, string>) {
    try {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
      return await api.get(`/api/tasks${queryString}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getTasks failed:', error);
      throw error;
    }
  },

  async getTaskById(id: string) {
    try {
      return await api.get(`/api/tasks/${id}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getTaskById failed:', error);
      throw error;
    }
  },

  async createTask(data: any) {
    try {
      return await api.post('/api/tasks', data, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('createTask failed:', error);
      throw error;
    }
  },

  async updateTask({ id, ...data }: any) {
    try {
      return await api.put(`/api/tasks/${id}`, data, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('updateTask failed:', error);
      throw error;
    }
  },

  async deleteTask(id: string) {
    try {
      return await api.delete(`/api/tasks/${id}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('deleteTask failed:', error);
      throw error;
    }
  },

  async completeTask(id: string) {
    try {
      return await api.patch(`/api/tasks/${id}/complete`, undefined, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('completeTask failed:', error);
      throw error;
    }
  },

  async reorderTasks(taskIds: string[]) {
    try {
      return await api.put('/api/tasks/reorder', { taskIds }, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('reorderTasks failed:', error);
      throw error;
    }
  },

  async addComment(taskId: string, content: string) {
    try {
      return await api.post(`/api/tasks/${taskId}/comments`, { content }, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('addComment failed:', error);
      throw error;
    }
  },

  async getComments(taskId: string) {
    try {
      return await api.get(`/api/tasks/${taskId}/comments`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getComments failed:', error);
      throw error;
    }
  },

  async uploadAttachment(taskId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post(`/api/tasks/${taskId}/attachments`, formData, {
        token: authService.getToken() ?? '',
        headers: { 'Content-Type': 'multipart/form-data' },
      } as any)
    } catch (error) {
      console.warn('uploadAttachment failed:', error);
      throw error;
    }
  },
}
