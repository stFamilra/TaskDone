import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { ProjectsListPage } from '@/pages/ProjectsListPage/ProjectsListPage';
import { BoardPage } from '@/pages/BoardPage'; // создадим позже, пока заглушка

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <ProjectsListPage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'board/:projectId?', element: <BoardPage /> },
    ],
  },
]);
