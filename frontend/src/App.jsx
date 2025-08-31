import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./Components/Auth/LoginPage";
import SignupPage from "./Components/Auth/SignupPage";
import ProtectedRoute from './Components/Auth/ProtectedRoute';

import Dashboard from './Pages/App/Dashboard';
import HabitsPage from './Pages/App/HabitsPage';
import GoalsPage from './Pages/App/GoalsPage';
import SettingsPage from './Pages/App/SettingsPage';

import AppLayout from './Components/Layouts/AppLayout';

import { AuthProvider } from './Components/Auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>  {/* <-- Wrap here */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes with layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
