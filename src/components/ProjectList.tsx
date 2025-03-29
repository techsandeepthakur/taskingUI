import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Project } from '../types';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'in-progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const API_URL = 'https://tasking-v4o6.onrender.com/api';

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const updateTaskStatus = async (projectId: string, taskType: keyof Project['taskStatus'], status: Project['taskStatus'][keyof Project['taskStatus']]) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskStatus: {
            [taskType]: status
          }
        }),
      });
      if (!response.ok) throw new Error('Failed to update task status');
      await fetchProjects();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const TaskStatusSelect = ({ 
    projectId, 
    taskType, 
    currentStatus,
    isEnabled
  }: { 
    projectId: string;
    taskType: keyof Project['taskStatus'];
    currentStatus?: Project['taskStatus'][keyof Project['taskStatus']];
    isEnabled: boolean;
  }) => {
    if (!isEnabled) return null;
    
    const status = currentStatus || 'pending';
    
    return (
      <select
        value={status}
        onChange={(e) => updateTaskStatus(
          projectId, 
          taskType, 
          e.target.value as Project['taskStatus'][keyof Project['taskStatus']]
        )}
        className={`ml-2 text-sm font-medium px-2 py-1 rounded-full border ${STATUS_COLORS[status]}`}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                    {project.tasks.layout && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">Layout</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="layout"
                            currentStatus={project.taskStatus?.layout}
                            isEnabled={true}
                          />
                        </div>
                      )}
                      {project.tasks.mddaMap && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">MDDA Submission</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="mddaMap"
                            currentStatus={project.taskStatus?.mddaMap}
                            isEnabled={true}
                          />
                        </div>
                      )}
                      
                      {project.tasks.structureDwg && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">Structure Dwg</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="structureDwg"
                            currentStatus={project.taskStatus?.structureDwg}
                            isEnabled={true}
                          />
                        </div>
                      )}
                      {project.tasks.architectureDwg && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">Architecture Dwg</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="architectureDwg"
                            currentStatus={project.taskStatus?.architectureDwg}
                            isEnabled={true}
                          />
                        </div>
                      )}
                      {project.tasks.ext3D && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">Ext3D</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="ext3D"
                            currentStatus={project.taskStatus?.ext3D}
                            isEnabled={true}
                          />
                        </div>
                      )}
                      {project.tasks.other && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">{project.taskStatus.other}</span>
                          <TaskStatusSelect
                            projectId={project._id}
                            taskType="other"
                            currentStatus={project.taskStatus?.other}
                            isEnabled={!!project.taskStatus.other}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(project.status)}
                      <span className={`text-sm font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>
          Total Projects: {projects.length}
        </p>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Auto-refreshing</span>
        </div>
      </div>
    </div>
  );
};