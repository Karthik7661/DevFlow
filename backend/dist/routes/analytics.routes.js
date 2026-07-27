"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const workspace_middleware_1 = require("../middleware/workspace.middleware");
const client_1 = require("@prisma/client");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_middleware_1.verifyToken);
router.get('/summary', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), analytics_controller_1.getDashboardSummary);
router.get('/productivity', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), analytics_controller_1.getTeamProductivity);
router.get('/export', (0, workspace_middleware_1.checkWorkspaceRole)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), analytics_controller_1.exportReport);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map