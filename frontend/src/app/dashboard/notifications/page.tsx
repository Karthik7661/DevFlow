'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Check, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading && notifications.length === 0) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading notifications...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-background/50 backdrop-blur-md p-6 rounded-xl border border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground mt-1 text-sm">Stay updated with project changes and team mentions.</p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <Button variant="outline" onClick={markAllAsRead} className="shadow-sm">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground p-12 glass rounded-xl border border-border">
          <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">All caught up!</h2>
          <p className="max-w-md text-center text-sm">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`overflow-hidden transition-all duration-300 border ${
                notification.read 
                  ? 'bg-background/40 border-border/50 opacity-70' 
                  : 'glass border-primary/20 shadow-sm'
              }`}
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-base font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs font-semibold px-3 hover:bg-primary/10 hover:text-primary"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Mark as read
                      </Button>
                    )}
                    
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs font-semibold px-3"
                          onClick={() => {
                            if (!notification.read) markAsRead(notification.id);
                          }}
                        >
                          View Details
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                {!notification.read && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)] mt-2"></div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
