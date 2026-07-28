import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

let io: Server;
const prisma = new PrismaClient();

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For demo purposes; configure properly in production
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decodedToken = await admin.auth().verifyIdToken(token);
      (socket as any).user = decodedToken;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    
    // Join workspace rooms
    socket.on('join_workspace', async (workspaceId: string) => {
      // Verify user is in workspace
      const membership = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: user.uid } }
      });
      if (membership) {
        socket.join(workspaceId);
      }
    });

    socket.on('leave_workspace', (workspaceId: string) => {
      socket.leave(workspaceId);
    });

    socket.on('disconnect', () => {
      // Handle disconnect
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
