import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { fullName, profilePicture } = req.body;
    const uid = req.user?.uid;
    const email = req.user?.email;

    if (!uid || !email) {
      res.status(400).json({ message: 'Invalid token data' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { id: uid } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        id: uid,
        email,
        fullName: fullName || '',
        profilePicture,
        lastLogin: new Date(),
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(400).json({ message: 'Invalid token data' });
      return;
    }

    // Attempt to update lastLogin if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: uid } });
    if (!existingUser) {
      res.status(404).json({ message: 'User not found. Please register first.' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: uid },
      data: { lastLogin: new Date() },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(400).json({ message: 'Invalid token data' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(400).json({ message: 'Invalid token data' });
      return;
    }

    const { fullName, profilePicture } = req.body;
    
    const user = await prisma.user.update({
      where: { id: uid },
      data: { 
        ...(fullName && { fullName }), 
        ...(profilePicture && { profilePicture }) 
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
