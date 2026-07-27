"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const project_middleware_1 = require("../middleware/project.middleware");
const client_1 = require("@prisma/client");
const sprint_controller_1 = require("../controllers/sprint.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_middleware_1.verifyToken);
router.post('/', (0, project_middleware_1.checkProjectAccess)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), sprint_controller_1.createSprint);
router.get('/', (0, project_middleware_1.checkProjectAccess)([]), sprint_controller_1.getSprints);
router.put('/:sprintId', (0, project_middleware_1.checkProjectAccess)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), sprint_controller_1.updateSprint);
router.delete('/:sprintId', (0, project_middleware_1.checkProjectAccess)([client_1.WorkspaceRole.ADMIN, client_1.WorkspaceRole.MANAGER]), sprint_controller_1.deleteSprint);
exports.default = router;
//# sourceMappingURL=sprint.routes.js.map