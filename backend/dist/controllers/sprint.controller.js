"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSprint = exports.updateSprint = exports.getSprints = exports.createSprint = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSprint = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { name, goal, startDate, endDate } = req.body;
        const sprint = await prisma.sprint.create({
            data: {
                projectId,
                name,
                goal,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            }
        });
        res.status(201).json(sprint);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createSprint = createSprint;
const getSprints = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const sprints = await prisma.sprint.findMany({
            where: { projectId },
            include: { tasks: true }
        });
        res.status(200).json(sprints);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getSprints = getSprints;
const updateSprint = async (req, res) => {
    try {
        const sprintId = req.params.sprintId;
        const { name, goal, startDate, endDate, status } = req.body;
        const sprint = await prisma.sprint.update({
            where: { id: sprintId },
            data: {
                ...(name && { name }),
                ...(goal && { goal }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(status && { status: status }),
            }
        });
        res.status(200).json(sprint);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateSprint = updateSprint;
const deleteSprint = async (req, res) => {
    try {
        const sprintId = req.params.sprintId;
        await prisma.sprint.delete({ where: { id: sprintId } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteSprint = deleteSprint;
//# sourceMappingURL=sprint.controller.js.map