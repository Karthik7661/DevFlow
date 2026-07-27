export default function DocumentsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Documents</h2>
      <p className="max-w-md text-center text-sm">Document management is coming soon. Upload, share, and organize files for your projects.</p>
    </div>
  );
}
