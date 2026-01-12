/**
 * ==========================================
 * React 應用程式入口點
 * ==========================================
 * Anting Card 極速名片 Demo
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// 渲染 React 應用程式至 DOM
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
