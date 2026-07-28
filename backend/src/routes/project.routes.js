"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const workspace_middleware_1 = require("../middleware/workspace.middleware");
const client_1 = require("@prisma/client");
const project_controller_1 = require("../controllers/project.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_middleware_1.verifyToken);
// /api/workspaces/:workspaceId/projects
router.post('/', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER, client_1.WorkspaceRole.DEVELOPER]), project_controller_1.createProject);
router.put('/:projectId', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER, client_1.WorkspaceRole.DEVELOPER]), project_controller_1.updateProject);
router.put('/:projectId/archive', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), project_controller_1.archiveProject);
router.delete('/:projectId', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), project_controller_1.deleteProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map