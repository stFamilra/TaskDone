import { makeAutoObservable } from 'mobx';
import { CreateEntity, Project, Task, TaskPriority, TaskStatus } from '@/types';

const generateId = () => crypto.randomUUID();

class ProjectStore {
  projects: Project[] = [];
  selectedProjectId: string | null = null;

  constructor() {
    makeAutoObservable(this);

    this.initMockData();
  }

  private findProject(projectId: string): Project | undefined {
    return this.projects.find((currentProject) => currentProject.id === projectId);
  }

  private initMockData() {
    const mockTasks: Task[] = [
      {
        id: generateId(),
        title: 'Создать систему регистрации и авторизации',
        description: 'Дать для пользователей возможность создавать аккаунты для личных Проектов.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Сделать канбан-доску',
        description: 'Реализовать перетаскивание задач',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockProject: Project = {
      id: generateId(),
      title: 'Pet Project: TaskDone',
      description: 'Система управления задачами',
      tasks: mockTasks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects = [mockProject];
    this.selectedProjectId = mockProject.id;
  }

  addProject(title: string, description?: string) {
    const newProject: Project = {
      title,
      description,
      id: generateId(),
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(newProject);
  }

  deleteProject(projectId: string) {
    this.projects = this.projects.filter((currentProject) => currentProject.id !== projectId);
    if (this.selectedProjectId === projectId) {
      this.selectedProjectId = this.projects[0]?.id || null;
    }
  }

  updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'tasks'>>) {
    const project = this.findProject(projectId);
    if (project) {
      Object.assign(project, updates);
      project.updatedAt = new Date();
    }
  }

  addTask(projectId: string, data: CreateEntity<Task>) {
    const project = this.findProject(projectId);
    if (!project) return;
    const newTask: Task = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    project.tasks.push(newTask);
  }

  updateTask(projectId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    const project = this.findProject(projectId);
    const task = project?.tasks.find((currentTask) => currentTask.id === taskId);
    if (task) {
      Object.assign(task, updates);
      task.updatedAt = new Date();
    }
  }

  updateTasks(projectId: string, tasks: Task[]) {
    const project = this.projects.find((currentTask) => currentTask.id === projectId);
    if (project) {
      project.tasks = tasks;
    }
  }

  deleteTask(projectId: string, taskId: string) {
    const project = this.findProject(projectId);
    if (project) {
      project.tasks = project.tasks.filter((currentTask) => currentTask.id !== taskId);
    }
  }

  moveTask(projectId: string, taskId: string, newStatus: TaskStatus, newIndex?: number) {
    const project = this.findProject(projectId);
    if (!project) return;
    const taskIndex = project.tasks.findIndex((currentTask) => currentTask.id === taskId);
    if (taskIndex === -1) return;

    const [task] = project.tasks.splice(taskIndex, 1);
    task.status = newStatus;
    task.updatedAt = new Date();

    if (newIndex !== undefined && newIndex >= 0 && newIndex <= project.tasks.length) {
      project.tasks.splice(newIndex, 0, task);
    } else {
      project.tasks.push(task);
    }
  }

  selectProject(projectId: string) {
    this.selectedProjectId = projectId;
  }

  get selectedProject(): Project | undefined {
    return this.projects.find((currentProject) => currentProject.id === this.selectedProjectId);
  }

  get tasksByStatus(): Record<TaskStatus, Task[]> {
    if (!this.selectedProject) {
      return {
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.DONE]: [],
      };
    }
    const result: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
    };
    for (const task of this.selectedProject.tasks) {
      result[task.status].push(task);
    }
    return result;
  }

  get taskCountByStatus(): Record<TaskStatus, number> {
    const counts = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
    };
    if (!this.selectedProject) return counts;
    for (const task of this.selectedProject.tasks) {
      counts[task.status]++;
    }
    return counts;
  }
}

export default ProjectStore;
