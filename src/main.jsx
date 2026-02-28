import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { XpProvider } from './context/XpContext.jsx';
import { AchievementProvider } from "./context/AchievementContext";
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <XpProvider>
        <AchievementProvider>
          <App />
        </AchievementProvider>
      </XpProvider>
    </AuthProvider>
  </StrictMode>
)
