"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(255),
        description: zod_1.z.string().optional().nullable(),
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
        priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
        sprintId: zod_1.z.string().uuid('Invalid sprint ID').optional().nullable(),
        assigneeId: zod_1.z.string().optional().nullable(),
        dueDate: zod_1.z.string().datetime().optional().nullable(),
        estimatedTime: zod_1.z.number().nonnegative().optional().nullable(),
    })
});
exports.updateTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(255).optional(),
        description: zod_1.z.string().optional().nullable(),
        status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
        priority: zod_1.z.nativeEnum(client_1.TaskPriority).optional(),
        sprintId: zod_1.z.string().uuid('Invalid sprint ID').optional().nullable(),
        assigneeId: zod_1.z.string().optional().nullable(),
        dueDate: zod_1.z.string().datetime().optional().nullable(),
        estimatedTime: zod_1.z.number().nonnegative().optional().nullable(),
        timeSpent: zod_1.z.number().nonnegative().optional().nullable(),
    })
});
//# sourceMappingURL=task.schema.js.map