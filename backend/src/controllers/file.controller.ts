import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const uploadFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const uid = req.user?.uid;
    const file = req.file;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }
    if (!file) { res.status(400).json({ message: 'No file uploaded' }); return; }

    const fileUrl = `/uploads/${file.filename}`;

    const newFile = await prisma.workspaceFile.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        fileUrl,
        workspaceId,
        uploadedById: uid,
      },
      include: {
        uploadedBy: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Failed to upload file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const uid = req.user?.uid;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const files = await prisma.workspaceFile.findMany({
      where: { workspaceId },
      include: {
        uploadedBy: {
          select: { id: true, fullName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(files);
  } catch (error) {
    console.error('Failed to fetch files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const fileId = req.params.fileId as string;
    const uid = req.user?.uid;

    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const file = await prisma.workspaceFile.findUnique({
      where: { id: fileId }
    });

    if (!file) { res.status(404).json({ message: 'File not found' }); return; }
    if (file.workspaceId !== workspaceId) { res.status(400).json({ message: 'Invalid workspace' }); return; }

    // Check if user is uploader or admin
    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: uid } }
    });

    if (!membership || (membership.role !== 'ADMIN' && file.uploadedById !== uid)) {
      res.status(403).json({ message: 'Forbidden' }); return;
    }

    // Delete from DB
    await prisma.workspaceFile.delete({ where: { id: fileId } });

    // Try to delete physical file
    const filePath = path.join(__dirname, '../../uploads', file.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to delete file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
