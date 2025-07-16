import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/NotificationService';
import { Notification } from '../../types/enhanced';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Initial load
    const userNotifications = notificationService.getNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(notificationService.getUnreadCount(user.id));

    // Subscribe to updates
    const unsubscribe = notificationService.subscribe((allNotifications) => {
      const userNotifications = allNotifications.filter(n => n.userId === user.id);
      setNotifications(userNotifications);
      setUnreadCount(notificationService.getUnreadCount(user.id));
    });

    return unsubscribe;
  }, [user]);

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id);
    }
  };

  const handleDelete = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: Notification['type']) => {
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
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'event_reminder':
        return 'border-l-amber-500 bg-amber-50';
      case 'registration_confirmed':
        return 'border-l-green-500 bg-green-50';
      case 'event_cancelled':
        return 'border-l-red-500 bg-red-50';
      case 'event_updated':
        return 'border-l-blue-500 bg-blue-50';
      case 'system':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-amber-100 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No notifications yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    We'll notify you about important updates
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-colors ${
                        !notification.read ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-slate-900' : 'text-slate-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-amber-600 hover:text-amber-700 p-1"
                                  title="Mark as read"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              onClick={() => setIsOpen(false)}
                              className="inline-block mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium"
                            >
                              View Details →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;