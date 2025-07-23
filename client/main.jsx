import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './index.css';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-white">Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);