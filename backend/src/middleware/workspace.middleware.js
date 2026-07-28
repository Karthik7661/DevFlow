"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorkspaceRole = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkWorkspaceRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const uid = req.user?.uid;
            const { workspaceId } = req.params;
            if (!uid || !workspaceId) {
                res.status(400).json({ message: 'Missing user or workspace context' });
                return;
            }
            const membership = await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId: uid,
                    },
                },
            });
            if (!membership) {
                res.status(403).json({ message: 'Forbidden: Not a member of this workspace' });
                return;
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions in workspace' });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Workspace permission check failed:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};
exports.checkWorkspaceRole = checkWorkspaceRole;
//# sourceMappingURL=workspace.middleware.js.map