"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProjectAccess = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkProjectAccess = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const uid = req.user?.uid;
            const { projectId } = req.params;
            if (!uid || !projectId) {
                res.status(400).json({ message: 'Missing user or project context' });
                return;
            }
            const project = await prisma.project.findUnique({
                where: { id: projectId }
            });
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }
            const membership = await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: project.workspaceId,
                        userId: uid,
                    },
                },
            });
            if (!membership) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};
exports.checkProjectAccess = checkProjectAccess;
//# sourceMappingURL=project.middleware.js.map