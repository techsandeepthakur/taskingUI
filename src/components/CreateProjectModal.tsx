import React, { useState } from 'react';
import { Layout, X } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = 'https://tasking-v4o6.onrender.com/api';;

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [tasks, setTasks] = useState({
    layout:false,
    mddaMap: false,
    structureDwg: false,
    architectureDwg: false,
    ext3D: false,   
    other: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          tasks,
          taskStatus: {
            layout: tasks.layout ? 'pending' : undefined,
            mddaMap: tasks.mddaMap ? 'pending' : undefined,
            structureDwg: tasks.structureDwg ? 'pending' : undefined,
            architectureDwg: tasks.architectureDwg ? 'pending' : undefined,
            ext3D: tasks.ext3D ? 'pending' : undefined,
            other: tasks.other ? 'pending' : undefined,
          },
          status: 'pending',
        }),
      });

      if (!response.ok) throw new Error('Failed to create project');

      setProjectName('');
      setTasks({
        layout:false,
    mddaMap: false,
    structureDwg: false,
    architectureDwg: false,
    ext3D: false,   
    other: '',
      });
      onClose();
      // Trigger a refresh of the project list
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasks
            </label>
            
            <div className="space-y-2">
            
            <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tasks.layout}
                  onChange={(e) => setTasks({ ...tasks, layout: e.target.checked })}
                  className="mr-2"
                />
                Layout
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tasks.mddaMap}
                  onChange={(e) => setTasks({ ...tasks, mddaMap: e.target.checked })}
                  className="mr-2"
                />
                MDDA Submission
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tasks.architectureDwg}
                  onChange={(e) => setTasks({ ...tasks, architectureDwg: e.target.checked })}
                  className="mr-2"
                />
                Architecture Dwg
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tasks.structureDwg}
                  onChange={(e) => setTasks({ ...tasks, structureDwg: e.target.checked })}
                  className="mr-2"
                />
                Structure Dwg
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tasks.ext3D}
                  onChange={(e) => setTasks({ ...tasks, ext3D: e.target.checked })}
                  className="mr-2"
                />
                Ext-3D
              </label>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Other (Optional)
                </label>
                <input
                  type="text"
                  value={tasks.other}
                  onChange={(e) => setTasks({ ...tasks, other: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Specify other task"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};