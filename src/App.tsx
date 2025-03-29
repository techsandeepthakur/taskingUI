import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminPage } from './components/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;