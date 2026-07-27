export default function SprintBoardPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Sprint Board</h2>
      <p className="max-w-md text-center text-sm">This page is currently being built in Phase 3. It will feature a beautiful, drag-and-drop Kanban board for managing your active sprints.</p>
    </div>
  );
}
