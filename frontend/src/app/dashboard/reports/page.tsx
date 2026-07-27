'use client'
import { useState } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { activeWorkspaceId, activeWorkspaceDetails } = useWorkspaceStore();
  const { exportReport } = useAnalyticsStore();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const handleExport = async (type: string, id?: string) => {
    if (!activeWorkspaceId) return;
    setIsExporting(true);
    try {
      await exportReport(activeWorkspaceId, type, id);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('No tasks found to export.');
      } else {
        toast.error('Failed to export report');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">Generate and download data extracts for your workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Workspace Task Report
            </CardTitle>
            <CardDescription>A complete CSV export of all tasks across all projects in the current workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleExport('WORKSPACE')} disabled={isExporting} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Project Specific Report
            </CardTitle>
            <CardDescription>Export all tasks for a specific project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <select 
               className="w-full h-9 bg-input border border-border rounded-md text-sm px-3 focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
               value={selectedProject}
               onChange={(e) => setSelectedProject(e.target.value)}
             >
               <option value="" disabled>Select a Project</option>
               {activeWorkspaceDetails?.projects.map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
               ))}
             </select>
             <Button 
               onClick={() => handleExport('PROJECT', selectedProject)} 
               disabled={isExporting || !selectedProject} 
               className="w-full sm:w-auto"
               variant="outline"
             >
               <Download className="mr-2 h-4 w-4" />
               Download Project CSV
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
