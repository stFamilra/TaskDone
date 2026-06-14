import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './stores/StoreProvider.tsx';

import './styles/index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>
);
