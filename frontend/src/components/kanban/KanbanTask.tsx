'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Task } from '@/store/projectStore';

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
      className={`cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${isOverlay ? 'shadow-xl scale-105 border-primary z-50 bg-background' : 'bg-background/40 backdrop-blur-sm border-border/50 shadow-sm'}`}
      {...attributes} 
      {...listeners}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-2">{task.title}</p>
        <div className="flex items-center justify-between mt-2">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${priorityColors[task.priority]}`}>
             {task.priority}
           </span>
           {task.assignee && (
             <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] uppercase font-bold" title={task.assignee.fullName || task.assignee.email}>
               {task.assignee.email[0]}
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
