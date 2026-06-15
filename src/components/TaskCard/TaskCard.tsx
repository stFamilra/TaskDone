import { forwardRef } from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Task, TaskPriority } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(({ task, onClick }, ref) => {
  const priorityColor = (() => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return 'error';
      case TaskPriority.MEDIUM:
        return 'warning';
      default:
        return 'success';
    }
  })();

  return (
    <Card ref={ref} sx={{ mb: 1, cursor: 'pointer' }} onClick={onClick} variant="outlined">
      <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
        <Typography sx={{ variant: 'body2', fontWeight: 'bold' }}>{task.title}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Chip label={task.priority} size="small" color={priorityColor} />
        </Box>
      </CardContent>
    </Card>
  );
});
