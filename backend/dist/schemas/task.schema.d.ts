import { z } from 'zod';
export declare const createTaskSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodEnum<{
            BACKLOG: "BACKLOG";
            TODO: "TODO";
            IN_PROGRESS: "IN_PROGRESS";
            REVIEW: "REVIEW";
            TESTING: "TESTING";
            DONE: "DONE";
        }>>;
        priority: z.ZodOptional<z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>>;
        sprintId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        estimatedTime: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodEnum<{
            BACKLOG: "BACKLOG";
            TODO: "TODO";
            IN_PROGRESS: "IN_PROGRESS";
            REVIEW: "REVIEW";
            TESTING: "TESTING";
            DONE: "DONE";
        }>>;
        priority: z.ZodOptional<z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>>;
        sprintId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        estimatedTime: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        timeSpent: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=task.schema.d.ts.map