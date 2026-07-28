import { Response } from 'express';
import { PrismaClient, SprintStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createSprint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const { name, goal, startDate, endDate } = req.body;

    const sprint = await prisma.sprint.create({
      data: {
        projectId,
        name,
        goal,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSprints = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      include: { tasks: true }
    });
    res.status(200).json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSprint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const sprintId = req.params.sprintId as string;
    const { name, goal, startDate, endDate, status } = req.body;

    const sprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        ...(name && { name }),
        ...(goal && { goal }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status: status as SprintStatus }),
      }
    });
    res.status(200).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSprint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const sprintId = req.params.sprintId as string;
    await prisma.sprint.delete({ where: { id: sprintId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
