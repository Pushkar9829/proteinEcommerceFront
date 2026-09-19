import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getGuestId } from './lib/guest';
import App from './App.jsx';
import './index.css';

getGuestId();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
