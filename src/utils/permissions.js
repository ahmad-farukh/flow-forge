export const canEditProject = (project, userId) => project?.ownerId === userId;
export const canEditTask = (task, userId) => task?.creatorId === userId || task?.assignedTo === userId;
