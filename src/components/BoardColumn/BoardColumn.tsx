import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Typography, Box } from '@mui/material';
import { Task, TaskStatus } from '@/types';
import { SortableTaskCard } from '@/components/SortableTaskCard';

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

const statusTitles: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'К выполнению',
  [TaskStatus.IN_PROGRESS]: 'В процессе',
  [TaskStatus.DONE]: 'Готово',
};

export const BoardColumn = ({ status, tasks, onTaskClick }: BoardColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        bgcolor: 'background.default',
        minWidth: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={2}
    >
      <Typography variant="h6" gutterBottom>
        {statusTitles[status]} ({tasks.length})
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 200 }}>
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task.id)} />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
};
