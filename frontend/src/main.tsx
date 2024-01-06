import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from '@tanstack/react-router';
import {router} from './routes/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="container mx-auto">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
