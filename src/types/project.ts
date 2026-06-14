import { BaseEntity, CreateEntity } from './common';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task extends BaseEntity {
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
}

export interface Project extends BaseEntity {
  tasks: Task[];
}

export type CreateTask = CreateEntity<Task>;

export type CreateProject = CreateEntity<Project>;
