"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.addComment = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const uid = req.user?.uid;
        const { title, description, status, priority, sprintId, assigneeId, dueDate, estimatedTime } = req.body;
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                status: status || client_1.TaskStatus.TODO,
                priority: priority || client_1.TaskPriority.MEDIUM,
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
    }
    catch (error) {
        console.error('Failed to create task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { sprintId, status, assigneeId } = req.query;
        const tasks = await prisma.task.findMany({
            where: {
                projectId,
                ...(sprintId && { sprintId: String(sprintId) }),
                ...(status && { status: status }),
                ...(assigneeId && { assigneeId: String(assigneeId) }),
            },
            include: {
                assignee: { select: { id: true, fullName: true, email: true, profilePicture: true } },
                reporter: { select: { id: true, fullName: true, email: true, profilePicture: true } },
                labels: { include: { label: true } }
            }
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status, priority, sprintId, assigneeId, dueDate, estimatedTime, timeSpent } = req.body;
        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(status && { status: status }),
                ...(priority && { priority: priority }),
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateTask = updateTask;
const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const uid = req.user?.uid;
        const { content } = req.body;
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addComment = addComment;
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await prisma.task.delete({ where: { id: taskId } });
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.controller.js.map