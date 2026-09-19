import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

if (typeof document !== 'undefined') {
  document.documentElement.lang = 'zh-CN';
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
