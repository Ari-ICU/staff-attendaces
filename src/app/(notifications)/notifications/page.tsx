'use client';

import { useState } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: 'New staff member joined HR department.', type: 'info', date: '2025-08-29', read: false },
    { id: 2, message: 'Your leave request was approved.', type: 'success', date: '2025-08-28', read: true },
    { id: 3, message: 'System error detected in payroll module.', type: 'error', date: '2025-08-27', read: false },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-500" />
          Notifications
        </h1>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 rounded-lg shadow flex items-start justify-between ${
                n.read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
              }`}
            >
              <div className="flex items-start space-x-3">
                {n.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {n.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                {n.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                <div>
                  <p className="font-medium">{n.message}</p>
                  <p className="text-sm text-gray-500">{n.date}</p>
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="ml-4 text-xs px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
