import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export const getDashboardSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;

    const [projects, activeSprintsData, allTasks] = await Promise.all([
      prisma.project.findMany({ where: { workspaceId }, select: { status: true } }),
      prisma.sprint.findMany({ 
        where: { project: { workspaceId }, status: 'ACTIVE' },
        include: { tasks: true }
      }),
      prisma.task.findMany({ where: { project: { workspaceId } }, select: { status: true, priority: true } })
    ]);

    const totalProjects = projects.length;
    const activeSprints = activeSprintsData.length;
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'DONE').length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = allTasks.filter(t => ['HIGH', 'CRITICAL'].includes(t.priority)).length;

    // Project Status Distribution
    const projectStats = projects.reduce((acc: any, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    
    const chartData = [
      { name: 'Planned', count: projectStats['PLANNED'] || 0 },
      { name: 'In Progress', count: projectStats['IN_PROGRESS'] || 0 },
      { name: 'Completed', count: projectStats['COMPLETED'] || 0 },
      { name: 'Archived', count: projectStats['ARCHIVED'] || 0 },
    ];

    // Simple Burndown Data Approximation (based on active sprints)
    // In a real burndown, you'd track task completion dates. Here we just return an empty array if no sprint, 
    // or a calculated array if there is one.
    let burndownData: any[] = [];
    if (activeSprintsData.length > 0) {
      const sprint = activeSprintsData[0];
      const sprintTasks = sprint.tasks.length;
      const completed = sprint.tasks.filter(t => t.status === 'DONE').length;
      
      // We'll generate a 7-day linear burndown for the active sprint for demonstration of real data structure
      // Real implementation requires historical daily snapshots of completed tasks
      const days = 7;
      const idealVelocity = sprintTasks / days;
      
      for (let i = 0; i < days; i++) {
        burndownData.push({
          day: `Day ${i + 1}`,
          ideal: Math.round(sprintTasks - (idealVelocity * i)),
          actual: i === 0 ? sprintTasks : (i === days - 1 ? (sprintTasks - completed) : null) // Only plot start and end for now
        });
      }
    }

    res.status(200).json({
      totalProjects,
      activeSprints,
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      chartData,
      burndownData
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTeamProductivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;

    const completedTasks = await prisma.task.findMany({
      where: { project: { workspaceId }, status: 'DONE' },
      include: { assignee: true }
    });

    const productivityByUser = completedTasks.reduce((acc: any, task: any) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const exportReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const { type, projectId, sprintId } = req.query;

    let tasks = [];
    if (type === 'PROJECT' && projectId) {
      tasks = await prisma.task.findMany({
        where: { projectId: String(projectId) },
        include: { assignee: true, project: true, sprint: true }
      });
    } else if (type === 'SPRINT' && sprintId) {
      tasks = await prisma.task.findMany({
        where: { sprintId: String(sprintId) },
        include: { assignee: true, project: true, sprint: true }
      });
    } else {
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

    const parser = new Parser();
    const csv = parser.parse(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
