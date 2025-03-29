import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../context/ProjectContext';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ROW_COLORS = [
  'from-blue-500 to-purple-500',
  'from-green-500 to-teal-500',
  'from-yellow-500 to-orange-500',
  'from-pink-500 to-red-500',
  'from-indigo-500 to-blue-500'
];

const PROJECTS_PER_PAGE = 5;
const DISPLAY_DURATION = 10000;
const REFRESH_INTERVAL = 10000;

const Dashboard = () => {
  const { projects, refreshProjects } = useProjects();
  const [currentPage, setCurrentPage] = useState(0);
  const [key, setKey] = useState(0);
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const pollInterval = useRef<number>();

  useEffect(() => {
    pollInterval.current = window.setInterval(() => {
      refreshProjects();
      setKey(prev => prev + 1);
    }, REFRESH_INTERVAL);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [refreshProjects]);

  useEffect(() => {
    document.title = 'Batra Architects - Project Dashboard';
    
    const pageInterval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, DISPLAY_DURATION);

    return () => clearInterval(pageInterval);
  }, [totalPages]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  }, []);
  const formatTaskType = (taskType: string): string => {
    switch (taskType) {
      case 'mddaMap':
        return 'MDDA Map';
      case 'architectureDesign':
        return 'Architecture Design';
      case 'construction':
        return 'Construction';
      case 'other':
        return 'Other';
      default:
        return taskType.charAt(0).toUpperCase() + taskType.slice(1).replace(/([A-Z])/g, ' $1');
    }
  };
  const currentProjects = projects.slice(
    currentPage * PROJECTS_PER_PAGE,
    (currentPage + 1) * PROJECTS_PER_PAGE
  );

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <header className="flex-none py-2 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Batra Architects
        </h1>
        <p className="text-sm text-center text-gray-400">
          Project Status Board
        </p>
      </header>

      <div className="flex-1 p-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}-${key}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col justify-between gap-2"
          >
            {currentProjects.map((project, idx) => (
              <motion.div
                key={`${project.id}-${key}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex-1 bg-gradient-to-r ${ROW_COLORS[idx % ROW_COLORS.length]} p-[1px] rounded-lg`}
              >
                <div className="h-full bg-gray-800 rounded-lg flex flex-col p-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-bold text-white truncate max-w-[70%]">
                      {project.name}
                    </h2>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 mt-1">
                  {Object.entries(project.taskStatus || {}).map(([taskType, status], taskIdx) => (
  <div
    key={`${taskType}-${status}-${key}`}
    className="bg-gray-700/50 rounded p-1 flex items-center justify-between"
  >
    <div className="flex items-center gap-1 min-w-0">
      {getStatusIcon(status)}
      <span className="text-xs font-medium truncate">
        {formatTaskType(taskType)}
      </span>
    </div>
    <span
      className={`text-[10px] px-1 rounded-full whitespace-nowrap ml-1 ${
        status === 'completed'
          ? 'bg-green-500/20 text-green-400'
          : status === 'in-progress'
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-gray-600/20 text-gray-400'
      }`}
    >
      {status}
    </span>
  </div>
))}

                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex-none py-1 bg-gray-800">
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full ${
                idx === currentPage ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;