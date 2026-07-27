"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.archiveProject = exports.updateProject = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description, status, priority, startDate, endDate } = req.body;
        const project = await prisma.project.create({
            data: {
                workspaceId,
                name,
                description,
                status: status || client_1.ProjectStatus.PLANNED,
                priority: priority || client_1.ProjectPriority.MEDIUM,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Failed to create project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProject = updateProject;
const archiveProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.update({
            where: { id: projectId },
            data: { status: client_1.ProjectStatus.ARCHIVED },
        });
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.archiveProject = archiveProject;
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await prisma.project.delete({
            where: { id: projectId }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.controller.js.map