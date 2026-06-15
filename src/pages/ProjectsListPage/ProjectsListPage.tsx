import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '@/hooks/useStore';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { ProjectFormModal } from '@/components/ProjectFormModal';
import { Project } from '@/types';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export const ProjectsListPage = observer(() => {
  const { projectStore } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const projectToDelete = projectStore.projects.find(
    (currentProject) => currentProject.id === deletingProjectId
  );

  const navigate = useNavigate();

  const handleAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingProjectId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingProjectId) {
      projectStore.deleteProject(deletingProjectId);
    }
    setDeletingProjectId(null);
  };
  const handleCancelDelete = () => {
    setDeletingProjectId(null);
  };

  const handleSave = (data: { title: string; description?: string }) => {
    if (editingProject) {
      projectStore.updateProject(editingProject.id, data);
    } else {
      projectStore.addProject(data.title, data.description);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Проекты
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Новый проект
        </Button>
      </Box>

      {projectStore.projects.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          Нет проектов. Создайте первый проект!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projectStore.projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <div onClick={() => navigate(`/board/${project.id}`)} style={{ cursor: 'pointer' }}>
                <ProjectCard
                  project={project}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(project.id)}
                />{' '}
              </div>
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectFormModal
        open={modalOpen}
        initialProject={editingProject}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deletingProjectId !== null}
        title="Удалить проект?"
        message={
          projectToDelete
            ? `Удалить «${projectToDelete.title}»? Все задачи также будут удалены.`
            : 'Удалить проект? Все задачи также будут удалены.'
        }
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
});
