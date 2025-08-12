import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ThemeProvider from './context/ThemeProvider.jsx';
import UserProvider from "./context/UserContext.jsx" // import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider >
        <App />
      </UserProvider>
      
    </ThemeProvider>
  </StrictMode>
);
