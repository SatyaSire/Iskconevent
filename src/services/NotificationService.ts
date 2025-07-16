import { Notification } from '../types/enhanced';
import toast from 'react-hot-toast';

class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];

  // Mock notifications for demo
  private mockNotifications: Notification[] = [
    {
      id: '1',
      userId: 'user1',
      type: 'event_reminder',
      title: 'Event Reminder',
      message: 'Janmashtami Celebration starts in 2 hours',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      eventId: '1',
      actionUrl: '/events/1'
    },
    {
      id: '2',
      userId: 'user1',
      type: 'registration_confirmed',
      title: 'Registration Confirmed',
      message: 'Your registration for Bhagavad Gita Study Circle has been confirmed',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      eventId: '2',
      actionUrl: '/events/2'
    },
    {
      id: '3',
      userId: 'user1',
      type: 'system',
      title: 'Welcome to ISKCON Events',
      message: 'Thank you for joining our spiritual community. Explore upcoming events and connect with fellow devotees.',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      actionUrl: '/'
    }
  ];

  constructor() {
    this.notifications = [...this.mockNotifications];
  }

  // Get all notifications for a user
  getNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get unread count
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
    }
  }

  // Mark all notifications as read
  markAllAsRead(userId: string): void {
    this.notifications
      .filter(n => n.userId === userId && !n.read)
      .forEach(n => n.read = true);
    this.notifySubscribers();
  }

  // Create new notification
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers();

    // Show toast notification
    this.showToastNotification(newNotification);
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifySubscribers();
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Show toast notification
  private showToastNotification(notification: Notification): void {
    const icon = this.getNotificationIcon(notification.type);
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-right'
    });
  }

  // Get notification icon
  private getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'event_reminder':
        return '⏰';
      case 'registration_confirmed':
        return '✅';
      case 'event_cancelled':
        return '❌';
      case 'event_updated':
        return '📝';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  }

  // Send event reminder notifications
  sendEventReminders(): void {
    // This would typically be called by a background job
    // For demo purposes, we'll simulate sending reminders
    console.log('Sending event reminder notifications...');
  }

  // Send registration confirmation
  sendRegistrationConfirmation(userId: string, eventTitle: string, eventId: string): void {
    this.createNotification({
      userId,
      type: 'registration_confirmed',
      title: 'Registration Confirmed',
      message: `Your registration for "${eventTitle}" has been confirmed`,
      read: false,
      eventId,
      actionUrl: `/events/${eventId}`
    });
  }

  // Send event cancellation notification
  sendEventCancellation(userId: string, eventTitle: string, eventId: string): void {
    this.createNotification({
      userId,
      type: 'event_cancelled',
      title: 'Event Cancelled',
      message: `"${eventTitle}" has been cancelled. We apologize for any inconvenience.`,
      read: false,
      eventId,
      actionUrl: `/events/${eventId}`
    });
  }

  // Send event update notification
  sendEventUpdate(userId: string, eventTitle: string, eventId: string): void {
    this.createNotification({
      userId,
      type: 'event_updated',
      title: 'Event Updated',
      message: `"${eventTitle}" has been updated. Please check the latest details.`,
      read: false,
      eventId,
      actionUrl: `/events/${eventId}`
    });
  }
}

export const notificationService = new NotificationService();