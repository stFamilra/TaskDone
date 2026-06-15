import { useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Grid, Typography, Button } from '@mui/material';
import { useStore } from '@/hooks/useStore';
import { BoardColumn } from '@/components/BoardColumn/BoardColumn';
import { TaskStatus } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';

export const BoardPage = observer(() => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projectStore } = useStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const project = projectStore.selectedProject;
    if (!project) return;

    const activeTask = project.tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    let targetStatus: TaskStatus | null = null;

    if (Object.values(TaskStatus).includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = project.tasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
    }

    const oldStatus = activeTask.status;
    let newTasks = [...project.tasks];
    const oldIndex = newTasks.findIndex((t) => t.id === activeId);

    if (oldStatus === targetStatus) {
      const newIndex = newTasks.findIndex((t) => t.id === overId);
      newTasks = arrayMove(newTasks, oldIndex, newIndex);
    } else {
      const tasksOfTargetStatus = project.tasks.filter((t) => t.status === targetStatus);
      let targetIndex = tasksOfTargetStatus.length;
      if (overId !== targetStatus) {
        const idx = tasksOfTargetStatus.findIndex((t) => t.id === overId);
        if (idx !== -1) targetIndex = idx;
      }

      const [movedTask] = newTasks.splice(oldIndex, 1);
      movedTask.status = targetStatus;

      let globalInsertIndex = newTasks.findIndex((t) => t.status === targetStatus);
      if (globalInsertIndex === -1) globalInsertIndex = newTasks.length;
      globalInsertIndex += targetIndex;
      if (globalInsertIndex > newTasks.length) globalInsertIndex = newTasks.length;
      newTasks.splice(globalInsertIndex, 0, movedTask);
    }

    projectStore.updateTasks(project.id, newTasks);
  };

  useEffect(() => {
    if (projectId) {
      projectStore.selectProject(projectId);
    } else if (projectStore.projects.length > 0) {
      projectStore.selectProject(projectStore.projects[0].id);
      navigate(`/board/${projectStore.projects[0].id}`, { replace: true });
    }
  }, [projectId, projectStore, navigate]);

  if (!projectStore.selectedProject) {
    return (
      <Typography>
        Проект не найден.{' '}
        <Button onClick={() => navigate('/projects')}>Вернуться к проектам</Button>
      </Typography>
    );
  }

  const tasksByStatus = projectStore.tasksByStatus;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Grid container spacing={2} sx={{ height: 'calc(100vh - 120px)' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <BoardColumn status={TaskStatus.TODO} tasks={tasksByStatus[TaskStatus.TODO]} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <BoardColumn
            status={TaskStatus.IN_PROGRESS}
            tasks={tasksByStatus[TaskStatus.IN_PROGRESS]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <BoardColumn status={TaskStatus.DONE} tasks={tasksByStatus[TaskStatus.DONE]} />
        </Grid>
      </Grid>{' '}
    </DndContext>
  );
});
