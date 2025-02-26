import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import reportWebVitals from './reportWebVitals';

const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'; // Check if user is logged in
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/app" /> : <Login />} />
        <Route path="/app" element={isAuthenticated() ? <App /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals(console.log);
