import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const uid = req.user?.uid;
    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const messages = await prisma.message.findMany({
      where: { workspaceId },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true, profilePicture: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { content } = req.body;
    const uid = req.user?.uid;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }
    if (!content || !content.trim()) { res.status(400).json({ message: 'Content is required' }); return; }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        workspaceId,
        senderId: uid,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true, profilePicture: true }
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
