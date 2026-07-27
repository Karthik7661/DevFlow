'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Task } from '@/store/projectStore';
import { MessageSquare, Paperclip, Clock } from 'lucide-react';

export function KanbanTask({ task, isOverlay, onClick }: { task: Task, isOverlay?: boolean, onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors: Record<string, string> = {
    LOW: 'text-blue-500 bg-blue-500/10',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10',
    HIGH: 'text-orange-500 bg-orange-500/10',
    CRITICAL: 'text-red-500 bg-red-500/10',
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`group relative cursor-grab active:cursor-grabbing transition-all duration-300 overflow-hidden ${isOverlay ? 'shadow-2xl scale-105 border-primary z-50 bg-background/90 backdrop-blur-xl' : 'bg-background/40 backdrop-blur-sm border-border/50 shadow-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'}`}
      {...attributes} 
      {...listeners}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <CardContent className="p-4 space-y-3 relative z-10">
        <div>
          <p className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-1">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-current/20 ${priorityColors[task.priority]}`}>
             {task.priority}
           </span>
           <div className="flex items-center gap-2.5 text-muted-foreground">
             {/* Dummy metrics for premium look */}
             <div className="flex items-center gap-1 hover:text-primary transition-colors">
               <MessageSquare className="h-3 w-3" />
               <span className="text-[10px] font-medium">3</span>
             </div>
             <div className="flex items-center gap-1 hover:text-primary transition-colors">
               <Paperclip className="h-3 w-3" />
               <span className="text-[10px] font-medium">1</span>
             </div>
             
             {task.dueDate && (
               <div className="flex items-center gap-1 bg-accent/50 px-1.5 py-0.5 rounded-sm border border-border">
                 <Clock className="h-3 w-3" />
                 <span className="text-[10px] font-medium">
                   {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                 </span>
               </div>
             )}
             
             <div className="ml-1">
               {task.assignee ? (
                 <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] uppercase font-bold shadow-sm ring-1 ring-primary/20" title={task.assignee.fullName || task.assignee.email}>
                   {task.assignee.email[0]}
                 </div>
               ) : (
                 <div className="h-6 w-6 rounded-full bg-accent text-muted-foreground flex items-center justify-center text-[10px] font-bold border border-border border-dashed" title="Unassigned">
                   ?
                 </div>
               )}
             </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
