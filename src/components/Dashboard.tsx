import React, { useState, useEffect } from 'react';
import { Project } from '../types';

const STATUS_COLORS = {
  pending: 'text-yellow-500',
  'in-progress': 'text-blue-500',
  completed: 'text-green-500',
};

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 5;

  useEffect(() => {
    const loadProjects = () => {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      setProjects(storedProjects);
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => 
        (prev + 1) % Math.ceil(projects.length / projectsPerPage)
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const currentProjects = projects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative scanline overflow-hidden">
      <div className="h-screen flex flex-col">
        <div className="p-8 border-b border-blue-500">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-4 text-center">
              BATRA ARCHITECTS
            </h1>
            <div className="flex justify-between items-center text-lg md:text-xl">
              <p>PROJECT STATUS BOARD</p>
              <p className="text-yellow-500">{time}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-lg text-blue-500 bg-black bg-opacity-90">
              <div>PROJECT ID</div>
              <div>TASKS</div>
              <div>STATUS</div>
              <div className="text-right">CREATED</div>
            </div>

            <div className="flex-1 overflow-y-auto md:overflow-y-hidden">
              <div className="space-y-1 p-4">
                {currentProjects.map((project, index) => (
                  <div
                    key={project._id}
                    className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 bg-gray-900 bg-opacity-80 p-4 split-flap"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    <div className="text-xl font-bold truncate">
                      {project.name}
                    </div>
                    <div>
                      <div className="space-y-1">
                      {project.tasks.layout && (
                          <div className="text-blue-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">Layout - {project.taskStatus?.layout?.toUpperCase()}</span>
                          </div>
                        )}
                        {project.tasks.mddaMap && (
                          <div className="text-blue-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">MDDA Submission - {project.taskStatus?.mddaMap?.toUpperCase()}</span>
                          </div>
                        )}
                        {project.tasks.structureDwg && (
                          <div className="text-green-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">Structure Dwg - {project.taskStatus?.structureDwg?.toUpperCase()}</span>
                          </div>
                        )}
                        {project.tasks.architectureDwg && (
                          <div className="text-green-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">Architecture Dwg - {project.taskStatus?.architectureDwg?.toUpperCase()}</span>
                          </div>
                        )}
                        {project.tasks.ext3D && (
                          <div className="text-purple-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">Ext-3D - {project.taskStatus?.ext3D?.toUpperCase()}</span>
                          </div>
                        )}
                        {project.tasks.other && (
                          <div className="text-red-400 flex items-center space-x-2">
                            <span>⬤</span>
                            <span className="truncate">{project.taskStatus.other} - {project.taskStatus?.other?.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`text-lg ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`}>
                        ● {project.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-blue-500 p-4 bg-black bg-opacity-90">
              <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-500">
                <p className="text-sm">
                  SHOWING {currentPage * projectsPerPage + 1}-
                  {Math.min((currentPage + 1) * projectsPerPage, projects.length)} OF {projects.length}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">AUTO-REFRESH: 15s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;