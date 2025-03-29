import { Project, User } from './types';

export const users: User[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
];

export const initialProjects: Project[] = [
  {
    _id: '1',
    name: 'Project A',
    createdAt: new Date().toISOString(),
    status: 'active',
    taskStatus: {
      mddaMap: 'pending',
      architectureDesign: 'in-progress',
      construction: 'completed',
      other: 'pending'
    }
  },
  {
    _id: '2',
    name: 'Project B',
    createdAt: new Date().toISOString(),
    status: 'completed',
    taskStatus: {
      mddaMap: 'completed',
      architectureDesign: 'completed',
      construction: 'completed',
      other: 'completed'
    }
  }
];