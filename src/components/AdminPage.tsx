import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut } from 'lucide-react';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectList } from './ProjectList';

export const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ProjectList />
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};