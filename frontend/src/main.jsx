import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import './styles/theme.css'
import App from './App.jsx'
import i18n, { setDocumentDirection } from './i18n.js'

// Set initial document direction based on current language
setDocumentDirection(i18n.language)

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  setDocumentDirection(lng)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
