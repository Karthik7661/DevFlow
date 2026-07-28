"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const project_middleware_1 = require("../middleware/project.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const task_schema_1 = require("../schemas/task.schema");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(auth_middleware_1.verifyToken);
router.get('/', (0, project_middleware_1.checkProjectAccess)([]), task_controller_1.getTasks);
router.post('/', (0, project_middleware_1.checkProjectAccess)([]), (0, validate_middleware_1.validateRequest)(task_schema_1.createTaskSchema), task_controller_1.createTask);
router.put('/:taskId', (0, project_middleware_1.checkProjectAccess)([]), (0, validate_middleware_1.validateRequest)(task_schema_1.updateTaskSchema), task_controller_1.updateTask);
router.delete('/:taskId', (0, project_middleware_1.checkProjectAccess)([]), task_controller_1.deleteTask);
router.post('/:taskId/comments', (0, project_middleware_1.checkProjectAccess)([]), task_controller_1.addComment);
exports.default = router;
//# sourceMappingURL=task.routes.js.map