import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Self-hosted via @fontsource/inter instead of the Google Fonts CDN link —
// bundled, versioned, and cached alongside every other dependency. Only the
// weights actually used in the app (see global.css / inline styles) — 500
// was requested from Google Fonts before but never referenced anywhere.
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
