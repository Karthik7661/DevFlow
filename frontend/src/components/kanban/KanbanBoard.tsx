'use client'

import React, { useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task } from '@/store/projectStore';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTask } from './KanbanTask';

interface Props {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
}

const COLUMNS = [
  { id: 'BACKLOG', title: 'Backlog' },
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'Review' },
  { id: 'TESTING', title: 'Testing' },
  { id: 'DONE', title: 'Done' }
];

export function KanbanBoard({ tasks, onTaskMove, onTaskClick }: Props) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const columnsData = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.status === col.id)
    }));
  }, [tasks]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    const isOverColumn = COLUMNS.some(c => c.id === overId);
    let newStatus = '';
    
    if (isOverColumn) {
      newStatus = overId;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    // Check if status actually changed to avoid unnecessary API calls
    const currentTask = tasks.find(t => t.id === taskId);
    if (newStatus && currentTask?.status !== newStatus) {
      onTaskMove(taskId as string, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
        {columnsData.map(col => (
          <KanbanColumn key={col.id} column={col} onTaskClick={onTaskClick} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTask task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
