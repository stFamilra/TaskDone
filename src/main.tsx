import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './stores/StoreProvider';
import { ProjectsListPage } from './pages/ProjectsListPage';
import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <ProjectsListPage />
    </StoreProvider>
  </React.StrictMode>
);
