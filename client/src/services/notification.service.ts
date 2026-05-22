import { api } from '../lib/api';
import { authService } from '@services/auth.service';

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'task_completed' | 'comment_added' | 'mention' | 'due_date';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      return await api.get('/api/notifications', { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getNotifications failed:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`, undefined, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('markAsRead failed:', error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/api/notifications/read-all', undefined, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('markAllAsRead failed:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/api/notifications/${notificationId}`, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('deleteNotification failed:', error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      return await api.get('/api/notifications/unread-count', { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('getUnreadCount failed:', error);
      throw error;
    }
  },

  async updatePreferences(preferences: any): Promise<void> {
    try {
      await api.put('/api/notifications/preferences', preferences, { token: authService.getToken() ?? '' })
    } catch (error) {
      console.warn('updatePreferences failed:', error);
      throw error;
    }
  },
}
