/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
*/

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
      
    </AuthProvider>
  </BrowserRouter>
);