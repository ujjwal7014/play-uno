import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "next-themes";
import { AuthProvider } from './components/auth-provider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider attribute="class">
  +      <App />
  +    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
