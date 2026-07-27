export default function NotificationsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Notifications</h2>
      <p className="max-w-md text-center text-sm">Notification center is coming soon. Stay updated with project changes and team mentions.</p>
    </div>
  );
}
