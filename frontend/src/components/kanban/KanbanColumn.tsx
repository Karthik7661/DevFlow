'use client'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTask } from './KanbanTask';

export function KanbanColumn({ column, onTaskClick }: { column: any, onTaskClick: any }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-[320px] shrink-0 glass rounded-2xl h-full border border-border/50 overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 font-semibold text-sm border-b border-border/50 flex justify-between items-center bg-background/60 backdrop-blur-xl">
        <span className="uppercase tracking-widest text-xs text-muted-foreground font-bold">{column.title}</span>
        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-mono border border-primary/20">
          {column.tasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3.5 flex flex-col gap-3.5 overflow-y-auto min-h-[150px] bg-background/30 transition-colors">
        <SortableContext items={column.tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task: any) => (
            <KanbanTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
