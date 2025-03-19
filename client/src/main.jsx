import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router";
import router from './routes/router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
