import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Task } from '../types';
import { initialProjects } from '../data';

// Define the base API URL
const API_BASE_URL = 'https://tasking-v4o6.onrender.com/api/projects';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateTaskStatus: (projectId: string, taskIndex: number, status: Task['status']) => void;
  refreshProjects: () => void;
  isLoading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch projects from API
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      localStorage.setItem('projects', JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Fall back to local storage if API fails
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        setProjects(initialProjects);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback((project: Project) => {
    setIsLoading(true);
    setError(null);
    
    fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add project');
        }
        return response.json();
      })
      .then(newProject => {
        setProjects(prev => {
          const newProjects = [...prev, newProject];
          localStorage.setItem('projects', JSON.stringify(newProjects));
          return newProjects;
        });
      })
      .catch(err => {
        console.error('Error adding project:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setIsLoading(true);
    setError(null);
    
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        
        setProjects(prev => {
          const newProjects = prev.filter(p => p.id !== id);
          localStorage.setItem('projects', JSON.stringify(newProjects));
          return newProjects;
        });
      })
      .catch(err => {
        console.error('Error deleting project:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const updateTaskStatus = useCallback((projectId: string, taskIndex: number, status: Task['status']) => {
    setIsLoading(true);
    setError(null);
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      setError('Project not found');
      setIsLoading(false);
      return;
    }
    
    // Get the task type from the index
    const taskTypes = Object.keys(project.taskStatus);
    if (taskIndex >= taskTypes.length) {
      setError('Task not found');
      setIsLoading(false);
      return;
    }
    
    const taskType = taskTypes[taskIndex];
    
    // Create a new taskStatus object with the updated status
    const updatedTaskStatus = {
      ...project.taskStatus,
      [taskType]: status
    };
    
    const updatedProject = { ...project, taskStatus: updatedTaskStatus };
    
    fetch(`${API_BASE_URL}/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
        
        setProjects(prev => {
          const newProjects = prev.map(p => 
            p.id === projectId ? { ...p, taskStatus: updatedTaskStatus } : p
          );
          localStorage.setItem('projects', JSON.stringify(newProjects));
          return newProjects;
        });
      })
      .catch(err => {
        console.error('Error updating task status:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      addProject, 
      deleteProject, 
      updateTaskStatus,
      refreshProjects,
      isLoading,
      error
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
