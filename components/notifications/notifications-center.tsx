'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, X, Check, AlertCircle, DollarSign, TrendingUp, Shield, CreditCard, Users, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'investment' | 'bill' | 'goal' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
  data?: any;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Payment Received',
    message: 'You received $150.00 from QR code payment',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    priority: 'medium'
  },
  {
    id: '2',
    type: 'security',
    title: 'New Device Login',
    message: 'Your account was accessed from a new device in New York',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high',
    actionRequired: true
  },
  {
    id: '3',
    type: 'investment',
    title: 'Portfolio Alert',
    message: 'AAPL is up 5.2% today. Your portfolio gained $125.50',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    priority: 'low'
  },
  {
    id: '4',
    type: 'bill',
    title: 'Bill Split Reminder',
    message: 'Sarah owes you $25.00 for dinner last night',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'goal',
    title: 'Goal Progress',
    message: 'You\'re 75% towards your Emergency Fund goal!',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'low'
  },
  {
    id: '6',
    type: 'transaction',
    title: 'Large Transaction Alert',
    message: 'Transaction of $500.00 detected at Best Buy',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    priority: 'medium'
  }
];

interface NotificationSettings {
  transactions: boolean;
  security: boolean;
  investments: boolean;
  bills: boolean;
  goals: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  transactions: true,
  security: true,
  investments: true,
  bills: true,
  goals: true,
  pushNotifications: true,
  emailNotifications: false,
  smsNotifications: false
};

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <DollarSign className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'bill': return <CreditCard className="h-4 w-4" />;
      case 'goal': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string, read: boolean) => {
    const opacity = read ? 'opacity-60' : '';
    switch (priority) {
      case 'high': return `text-red-600 ${opacity}`;
      case 'medium': return `text-yellow-600 ${opacity}`;
      case 'low': return `text-green-600 ${opacity}`;
      default: return `text-gray-600 ${opacity}`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.read;
      case 'high': return notification.priority === 'high';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['transaction', 'security', 'investment'][Math.floor(Math.random() * 3)] as any,
          title: 'New Notification',
          message: 'This is a real-time notification demo',
          timestamp: new Date().toISOString(),
          read: false,
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with your account activity and important alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          {highPriorityCount > 0 && (
            <Badge variant="destructive">{highPriorityCount} urgent</Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'high' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('high')}
        >
          High Priority ({notifications.filter(n => n.priority === 'high').length})
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* High Priority Alerts */}
      {highPriorityCount > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 dark:text-red-200">
            {highPriorityCount} urgent notification{highPriorityCount > 1 ? 's' : ''} require{highPriorityCount === 1 ? 's' : ''} attention
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Please review your high-priority notifications to ensure account security.
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "You're all caught up! No new notifications at the moment."
                  : `No ${filter} notifications found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : ''
              } ${
                notification.priority === 'high' && !notification.read 
                  ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' 
                  : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${getPriorityColor(notification.priority, notification.read)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority, notification.read)}`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.message}
                    </p>
                    {notification.actionRequired && !notification.read && (
                      <div className="mt-2 flex space-x-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Notification Types</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="transactions" className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Transaction Alerts</span>
                </Label>
                <Switch
                  id="transactions"
                  checked={settings.transactions}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, transactions: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="security" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security Alerts</span>
                </Label>
                <Switch
                  id="security"
                  checked={settings.security}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, security: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="investments" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Investment Updates</span>
                </Label>
                <Switch
                  id="investments"
                  checked={settings.investments}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, investments: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="bills" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Bill Reminders</span>
                </Label>
                <Switch
                  id="bills"
                  checked={settings.bills}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, bills: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="goals" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Goal Progress</span>
                </Label>
                <Switch
                  id="goals"
                  checked={settings.goals}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, goals: checked }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Delivery Methods</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push">Push Notifications</Label>
                <Switch
                  id="push"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email Notifications</Label>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sms">SMS Notifications</Label>
                <Switch
                  id="sms"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, smsNotifications: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
