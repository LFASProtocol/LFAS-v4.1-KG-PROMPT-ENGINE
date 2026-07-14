
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress benign WebSocket connection errors and HMR unhandled rejections
if (typeof window !== 'undefined') {
  const isWebSocketError = (str: string) => {
    return str.includes('WebSocket') || str.includes('websocket') || str.includes('closed without opened');
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (isWebSocketError(reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (isWebSocketError(msg)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
