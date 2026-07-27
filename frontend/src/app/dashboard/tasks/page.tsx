export default function TasksPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">My Tasks</h2>
      <p className="max-w-md text-center text-sm">This page is under construction. It will display a list of all your assigned tasks across all projects.</p>
    </div>
  );
}
