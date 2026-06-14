import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectsListPage } from './ProjectsListPage';
import { StoreProvider } from '@/stores/StoreProvider';
import RootStore from '@/stores/RootStore';

const renderPage = (store = new RootStore()) =>
  render(
    <StoreProvider store={store}>
      <ProjectsListPage />
    </StoreProvider>
  );

const getProjectCard = (title: string): HTMLElement => {
  const card = screen.getByText(title).closest('.MuiCard-root');
  if (!(card instanceof HTMLElement)) {
    throw new Error(`Project card not found for "${title}"`);
  }
  return card;
};

describe('ProjectsListPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page title and add button', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Проекты' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Новый проект' })).toBeInTheDocument();
  });

  it('renders projects from store', () => {
    renderPage();

    expect(screen.getByText('Pet Project: TaskDone')).toBeInTheDocument();
    expect(screen.getByText('Система управления задачами')).toBeInTheDocument();
    expect(screen.getByText('2 задач')).toBeInTheDocument();
  });

  it('shows empty state when there are no projects', () => {
    const store = new RootStore();
    store.projectStore.projects = [];

    renderPage(store);

    expect(screen.getByText('Нет проектов. Создайте первый проект!')).toBeInTheDocument();
  });

  it('opens create modal when clicking "Новый проект"', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Новый проект' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('Новый проект', { selector: 'h2' })).toBeInTheDocument();
  });

  it('creates a new project from modal', async () => {
    const store = new RootStore();
    store.projectStore.projects = [];

    renderPage(store);

    fireEvent.click(screen.getByRole('button', { name: 'Новый проект' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Мой проект' } });
    fireEvent.change(screen.getByLabelText('Описание'), { target: { value: 'Описание проекта' } });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    const projectCard = getProjectCard('Мой проект');
    expect(within(projectCard).getByText('Описание проекта')).toBeInTheDocument();
    expect(store.projectStore.projects).toHaveLength(1);
  });

  it('deletes project when deletion is confirmed', async () => {
    const store = new RootStore();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderPage(store);

    const { getAllByRole } = within(getProjectCard('Pet Project: TaskDone'));
    fireEvent.click(getAllByRole('button')[1]);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => expect(store.projectStore.projects).toHaveLength(0));
    expect(screen.getByText('Нет проектов. Создайте первый проект!')).toBeInTheDocument();
  });

  it('does not delete project when deletion is cancelled', () => {
    const store = new RootStore();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderPage(store);

    const { getAllByRole } = within(getProjectCard('Pet Project: TaskDone'));
    fireEvent.click(getAllByRole('button')[1]);

    expect(store.projectStore.projects).toHaveLength(1);
    expect(screen.getByText('Pet Project: TaskDone')).toBeInTheDocument();
  });

  it('opens edit modal with project data', async () => {
    renderPage();

    const { getAllByRole } = within(getProjectCard('Pet Project: TaskDone'));
    fireEvent.click(getAllByRole('button')[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Редактировать проект')).toBeInTheDocument();
    expect(screen.getByLabelText('Название')).toHaveValue('Pet Project: TaskDone');
    expect(screen.getByLabelText('Описание')).toHaveValue('Система управления задачами');
  });

  it('updates project from edit modal', async () => {
    const store = new RootStore();
    const projectId = store.projectStore.projects[0].id;

    renderPage(store);

    const { getAllByRole } = within(getProjectCard('Pet Project: TaskDone'));
    fireEvent.click(getAllByRole('button')[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Название'), {
      target: { value: 'Обновлённый проект' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(screen.getByText('Обновлённый проект')).toBeInTheDocument();
    });
    expect(store.projectStore.projects.find((p) => p.id === projectId)?.title).toBe(
      'Обновлённый проект'
    );
  });
});
