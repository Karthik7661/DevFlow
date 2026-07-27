import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    sprintId: z.string().uuid('Invalid sprint ID').optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    estimatedTime: z.number().nonnegative().optional().nullable(),
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    sprintId: z.string().uuid('Invalid sprint ID').optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
    estimatedTime: z.number().nonnegative().optional().nullable(),
    timeSpent: z.number().nonnegative().optional().nullable(),
  })
});
