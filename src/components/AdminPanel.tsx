import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, LogOut } from 'lucide-react';
import type { Task } from '../types';

const AdminPanel = () => {
  const { projects, addProject, deleteProject, updateTaskStatus } = useProjects();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create taskStatus object based on selected tasks
    const taskStatus: {
      mddaMap: Task['status'];
      architectureDesign: Task['status'];
      construction: Task['status'];
      other: Task['status'];
    } = {
      mddaMap: 'pending',
      architectureDesign: 'pending',
      construction: 'pending',
      other: 'pending'
    };
    
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      tasks: selectedTasks.map(task => ({
        type: task as Task['type'],
        name: task === 'Other' ? customTask : task,
        status: 'pending' as const
      })),
      taskStatus,
      createdAt: new Date().toISOString(),
      status: 'active' as const
    };
    
    addProject(newProject);
    setShowModal(false);
    setProjectName('');
    setSelectedTasks([]);
    setCustomTask('');
  };
  const handleStatusChange = (projectId: string, taskType: string, status: string) => {
    // Find the project
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Find the index of the task type in the taskStatus object keys
    const taskTypes = Object.keys(project.taskStatus || {});
    const taskIndex = taskTypes.indexOf(taskType);
    
    if (taskIndex !== -1) {
      updateTaskStatus(projectId, taskIndex, status as Task['status']);
    }
  };

  // Helper function to format task type for display
  const formatTaskType = (taskType: string): string => {
    switch (taskType) {
      case 'mddaMap':
        return 'MDDA Submission';
      case 'layout':
        return 'Layout';
      case 'structureDwg':
        return 'Structure Dwg';
      case 'architectureDwg':
        return 'Architecture Dwg';
      case 'ext3D':
        return 'Ext 3D';
      case 'other':
        return 'Other';
      default:
        return taskType.charAt(0).toUpperCase() + taskType.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };

  const taskTypes = ['layout','MDDA Submission', 'Structure Drawing', 'Architecture Drawing', 'Ext3D', 'Other'];
  const statusOptions: Task['status'][] = ['pending', 'in-progress', 'completed'];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(project.taskStatus || {}).map(([taskType, status]) => (
                  <div
                    key={taskType}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {formatTaskType(taskType)}
                    </span>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(project.id, taskType, e.target.value)}
                      className="ml-2 text-sm border rounded-md px-2 py-1 bg-white"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasks
                </label>
                <div className="space-y-2">
                  {taskTypes.map((task) => (
                    <label key={task} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTasks([...selectedTasks, task]);
                          } else {
                            setSelectedTasks(
                              selectedTasks.filter((t) => t !== task)
                            );
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedTasks.includes('Other') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Task Name
                  </label>
                  <input
                    type="text"
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
