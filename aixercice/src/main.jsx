import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from './hooks/use-toast-custom'

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
  </ToastProvider>
); 