import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Project } from '@/types';

interface ProjectFormModalProps {
  open: boolean;
  initialProject?: Partial<Project> | null;
  onClose: () => void;
  onSave: (data: { title: string; description?: string }) => void;
}

export const ProjectFormModal = ({
  open,
  initialProject,
  onClose,
  onSave,
}: ProjectFormModalProps) => {
  const [title, setTitle] = useState(initialProject?.title || '');
  const [description, setDescription] = useState(initialProject?.description || '');

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevInitialProject, setPrevInitialProject] = useState(initialProject);

  if (open !== prevOpen || initialProject !== prevInitialProject) {
    setPrevOpen(open);
    setPrevInitialProject(initialProject);
    setTitle(initialProject?.title || '');
    setDescription(initialProject?.description || '');
  }

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({ title: title.trim(), description: description.trim() || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle color="primary">
        {initialProject ? 'Редактировать проект' : 'Новый проект'}
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Название"
          fullWidth
          value={title}
          onChange={(title) => setTitle(title.target.value)}
        />

        <TextField
          autoFocus
          margin="dense"
          label="Описание"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(description) => setDescription(description.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" disabled={!title.trim()}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
