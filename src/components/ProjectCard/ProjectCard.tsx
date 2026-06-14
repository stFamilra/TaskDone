import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          {project.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {project.description || 'Без описания'}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {project.tasks.length} задач
        </Typography>
      </CardContent>

      <CardActions>
        <IconButton size="small" onClick={() => onEdit(project)} color="primary">
          <EditIcon />
        </IconButton>

        <IconButton size="small" onClick={() => onDelete(project.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
