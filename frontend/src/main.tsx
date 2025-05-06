import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

document.title = import.meta.env.VITE_APP_NAME;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
