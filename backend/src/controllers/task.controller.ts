import { Response } from 'express';
import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const uid = req.user?.uid;
    const { title, description, status, priority, sprintId, assigneeId, dueDate, estimatedTime } = req.body;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        status: status as TaskStatus || TaskStatus.TODO,
        priority: priority as TaskPriority || TaskPriority.MEDIUM,
        sprintId,
        assigneeId,
        reporterId: uid,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedTime,
      },
      include: {
        assignee: { select: { id: true, fullName: true, email: true, profilePicture: true } },
        reporter: { select: { id: true, fullName: true, email: true, profilePicture: true } },
        labels: { include: { label: true } }
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { sprintId, status, assigneeId } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(sprintId && { sprintId: String(sprintId) }),
        ...(status && { status: status as TaskStatus }),
        ...(assigneeId && { assigneeId: String(assigneeId) }),
      },
      include: {
        assignee: { select: { id: true, fullName: true, email: true, profilePicture: true } },
        reporter: { select: { id: true, fullName: true, email: true, profilePicture: true } },
        labels: { include: { label: true } }
      }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, sprintId, assigneeId, dueDate, estimatedTime, timeSpent } = req.body;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status: status as TaskStatus }),
        ...(priority && { priority: priority as TaskPriority }),
        ...(sprintId !== undefined && { sprintId }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(estimatedTime !== undefined && { estimatedTime }),
        ...(timeSpent !== undefined && { timeSpent }),
      },
      include: {
        assignee: { select: { id: true, fullName: true, email: true, profilePicture: true } },
        labels: { include: { label: true } }
      }
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const uid = req.user?.uid;
    const { content } = req.body;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId: uid,
        content,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, profilePicture: true } }
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    await prisma.task.delete({ where: { id: taskId } });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
