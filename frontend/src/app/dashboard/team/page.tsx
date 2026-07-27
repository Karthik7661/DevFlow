export default function TeamPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Team Members</h2>
      <p className="max-w-md text-center text-sm">Team directory is coming soon. View your colleagues, their roles, and current sprint assignments.</p>
    </div>
  );
}
