import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {TodoProvider} from './context/TodoContext.jsx'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoProvider>
    <Toaster />
    <App />
    </TodoProvider>
  </React.StrictMode>,
)
