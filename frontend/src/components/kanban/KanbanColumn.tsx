'use client'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTask } from './KanbanTask';

export function KanbanColumn({ column, onTaskClick }: { column: any, onTaskClick: any }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col w-[300px] shrink-0 glass rounded-xl h-full border border-border/40 overflow-hidden">
      <div className="p-3 font-semibold text-sm border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-md">
        <span className="uppercase tracking-wider text-xs text-muted-foreground">{column.title}</span>
        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-mono">
          {column.tasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-[150px] bg-background/20">
        <SortableContext items={column.tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task: any) => (
            <KanbanTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
