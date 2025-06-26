// src/main.jsx
import 'react-calendar/dist/Calendar.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './ThemeContext'; // 👈 Import your provider
import './index.css';
import './theme.css'; // 👈 Import your theme styles

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* 👈 ThemeProvider wraps everything */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
