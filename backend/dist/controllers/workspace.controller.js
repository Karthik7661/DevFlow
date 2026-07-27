"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.updateMemberRole = exports.inviteMember = exports.deleteWorkspace = exports.updateWorkspace = exports.getWorkspaceDetails = exports.getWorkspaces = exports.createWorkspace = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createWorkspace = async (req, res) => {
    try {
        const uid = req.user?.uid;
        const { name, description, logo } = req.body;
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const workspace = await prisma.workspace.create({
            data: {
                name,
                description,
                logo,
                ownerId: uid,
                members: {
                    create: {
                        userId: uid,
                        role: client_1.WorkspaceRole.ADMIN,
                    }
                }
            },
            include: {
                members: true
            }
        });
        res.status(201).json(workspace);
    }
    catch (error) {
        console.error('Failed to create workspace:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createWorkspace = createWorkspace;
const getWorkspaces = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: uid
                    }
                }
            },
            include: {
                _count: {
                    select: { members: true, projects: true }
                }
            }
        });
        res.status(200).json(workspaces);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getWorkspaces = getWorkspaces;
const getWorkspaceDetails = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, fullName: true, email: true, profilePicture: true } }
                    }
                },
                projects: true
            }
        });
        if (!workspace) {
            res.status(404).json({ message: 'Not found' });
            return;
        }
        res.status(200).json(workspace);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getWorkspaceDetails = getWorkspaceDetails;
const updateWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description, logo } = req.body;
        const workspace = await prisma.workspace.update({
            where: { id: workspaceId },
            data: { name, description, logo },
        });
        res.status(200).json(workspace);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateWorkspace = updateWorkspace;
const deleteWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const uid = req.user?.uid;
        const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!workspace) {
            res.status(404).json({ message: 'Not found' });
            return;
        }
        if (workspace.ownerId !== uid) {
            res.status(403).json({ message: 'Only owner can delete' });
            return;
        }
        await prisma.workspace.delete({ where: { id: workspaceId } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteWorkspace = deleteWorkspace;
const inviteMember = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found in system' });
            return;
        }
        const member = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: user.id,
                role: role || client_1.WorkspaceRole.DEVELOPER,
            },
            include: {
                user: { select: { id: true, fullName: true, email: true, profilePicture: true } }
            }
        });
        res.status(201).json(member);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ message: 'User is already a member' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.inviteMember = inviteMember;
const updateMemberRole = async (req, res) => {
    try {
        const { workspaceId, memberId } = req.params;
        const { role } = req.body;
        const updated = await prisma.workspaceMember.update({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: memberId
                }
            },
            data: { role }
        });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateMemberRole = updateMemberRole;
const removeMember = async (req, res) => {
    try {
        const { workspaceId, memberId } = req.params;
        const uid = req.user?.uid;
        // Check if user is removing themselves, or if they are an admin
        if (memberId !== uid) {
            const callerMembership = await prisma.workspaceMember.findUnique({
                where: { workspaceId_userId: { workspaceId, userId: uid } }
            });
            if (!callerMembership || callerMembership.role !== 'ADMIN') {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
        }
        await prisma.workspaceMember.delete({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: memberId
                }
            }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.removeMember = removeMember;
//# sourceMappingURL=workspace.controller.js.map