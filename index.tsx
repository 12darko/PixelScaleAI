import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from './context/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);