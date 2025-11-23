import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/theme.css";
import { RouterProvider } from "react-router";
import router from './routes/router';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
