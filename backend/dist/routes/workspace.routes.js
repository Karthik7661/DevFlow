"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const workspace_middleware_1 = require("../middleware/workspace.middleware");
const client_1 = require("@prisma/client");
const project_routes_1 = __importDefault(require("./project.routes"));
const analytics_routes_1 = __importDefault(require("./analytics.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const workspace_controller_1 = require("../controllers/workspace.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken);
router.post('/', workspace_controller_1.createWorkspace);
router.get('/', workspace_controller_1.getWorkspaces);
router.get('/:workspaceId', (0, workspace_middleware_1.checkWorkspaceRole)([]), workspace_controller_1.getWorkspaceDetails);
router.put('/:workspaceId', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN]), workspace_controller_1.updateWorkspace);
router.delete('/:workspaceId', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN]), workspace_controller_1.deleteWorkspace);
// Member management
router.post('/:workspaceId/members', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), workspace_controller_1.inviteMember);
router.put('/:workspaceId/members/:memberId', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN]), workspace_controller_1.updateMemberRole);
router.delete('/:workspaceId/members/:memberId', (0, workspace_middleware_1.checkWorkspaceRole)([]), workspace_controller_1.removeMember); // empty [] so users can leave themselves
// Mount nested routes
router.use('/:workspaceId/projects', project_routes_1.default);
router.use('/:workspaceId/analytics', analytics_routes_1.default);
router.use('/:workspaceId/messages', message_routes_1.default);
exports.default = router;
//# sourceMappingURL=workspace.routes.js.map