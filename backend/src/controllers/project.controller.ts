import { Response } from 'express';
import { PrismaClient, ProjectStatus, ProjectPriority } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const { name, description, status, priority, startDate, endDate } = req.body;

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
        status: status as ProjectStatus || ProjectStatus.PLANNED,
        priority: priority as ProjectPriority || ProjectPriority.MEDIUM,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Failed to create project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const { name, description, status, priority, startDate, endDate } = req.body;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { 
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const archiveProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ARCHIVED },
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    await prisma.project.delete({
      where: { id: projectId }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
