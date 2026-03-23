/**
 * main.jsx
 * Entry point — renders App into the DOM
 */

import React    from 'react'
import ReactDOM from 'react-dom/client'
import App      from './App'

// WHY import index.css here: loads Tailwind base styles globally
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)