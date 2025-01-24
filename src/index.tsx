// src/index.tsx
import React from 'react';
import './styles/output.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
