import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './userContext/userContext.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <UserProvider>
      <App />
    </UserProvider>
  );
} else {
  console.error("Không tìm thấy phần tử #root trong DOM!");
}