import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/autoResponsive.css'
import { ResponsiveProvider } from './contexts/ResponsiveContext'

// Initialize dark mode as default
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const initialTheme = savedTheme || 'dark'; // Default to dark mode
document.documentElement.classList.toggle('dark', initialTheme === 'dark');

createRoot(document.getElementById("root")!).render(
  <ResponsiveProvider>
    <App />
  </ResponsiveProvider>
);
