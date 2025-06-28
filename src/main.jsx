import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class">
+      <App />
+    </ThemeProvider>
  </StrictMode>,
)
