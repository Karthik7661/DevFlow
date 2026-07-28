"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReport = exports.getTeamProductivity = exports.getDashboardSummary = void 0;
const client_1 = require("@prisma/client");
const json2csv_1 = require("json2csv");
const prisma = new client_1.PrismaClient();
const getDashboardSummary = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const [totalProjects, activeSprints, allTasks] = await Promise.all([
            prisma.project.count({ where: { workspaceId } }),
            prisma.sprint.count({ where: { project: { workspaceId }, status: 'ACTIVE' } }),
            prisma.task.findMany({ where: { project: { workspaceId } }, select: { status: true, priority: true } })
        ]);
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(t => t.status === 'DONE').length;
        const pendingTasks = totalTasks - completedTasks;
        const highPriorityTasks = allTasks.filter(t => ['HIGH', 'CRITICAL'].includes(t.priority)).length;
        res.status(200).json({
            totalProjects,
            activeSprints,
            totalTasks,
            completedTasks,
            pendingTasks,
            highPriorityTasks
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDashboardSummary = getDashboardSummary;
const getTeamProductivity = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const completedTasks = await prisma.task.findMany({
            where: { project: { workspaceId }, status: 'DONE' },
            include: { assignee: true }
        });
        const productivityByUser = completedTasks.reduce((acc, task) => {
            if (task.assignee) {
                const uid = task.assignee.id;
                if (!acc[uid]) {
                    acc[uid] = { name: task.assignee.fullName || task.assignee.email, tasksCompleted: 0 };
                }
                acc[uid].tasksCompleted += 1;
            }
            return acc;
        }, {});
        const chartData = Object.values(productivityByUser);
        res.status(200).json(chartData);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTeamProductivity = getTeamProductivity;
const exportReport = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { type, projectId, sprintId } = req.query;
        let tasks = [];
        if (type === 'PROJECT' && projectId) {
            tasks = await prisma.task.findMany({
                where: { projectId: String(projectId) },
                include: { assignee: true, project: true, sprint: true }
            });
        }
        else if (type === 'SPRINT' && sprintId) {
            tasks = await prisma.task.findMany({
                where: { sprintId: String(sprintId) },
                include: { assignee: true, project: true, sprint: true }
            });
        }
        else {
            tasks = await prisma.task.findMany({
                where: { project: { workspaceId } },
                include: { assignee: true, project: true, sprint: true }
            });
        }
        const data = tasks.map(t => ({
            Title: t.title,
            Status: t.status,
            Priority: t.priority,
            Project: t.project.name,
            Sprint: t.sprint?.name || 'Backlog',
            Assignee: t.assignee?.email || 'Unassigned',
            CreatedAt: t.createdAt.toISOString(),
            TimeSpent: t.timeSpent || 0
        }));
        if (data.length === 0) {
            res.status(404).json({ message: 'No data found for this report.' });
            return;
        }
        const parser = new json2csv_1.Parser();
        const csv = parser.parse(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.csv"`);
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.exportReport = exportReport;
//# sourceMappingURL=analytics.controller.js.map