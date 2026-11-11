import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SpaceProvider } from '@/context/SpaceContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to mount Ghosts in the Dust: root element is missing.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <SpaceProvider>
      <App />
    </SpaceProvider>
  </React.StrictMode>,
);
