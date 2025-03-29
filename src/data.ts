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
    id: '1',
    name: 'Luxury Villa Complex',
    tasks: [
      { type: 'MDDA Map', name: 'MDDA Map', status: 'completed' },
      { type: 'Architecture Design', name: 'Architecture Design', status: 'in-progress' },
      { type: 'Construction', name: 'Construction', status: 'pending' }
    ],
    createdAt: '2024-03-10',
    status: 'active'
  },
  {
    id: '2',
    name: 'Commercial Plaza',
    tasks: [
      { type: 'Architecture Design', name: 'Architecture Design', status: 'completed' },
      { type: 'Construction', name: 'Construction', status: 'in-progress' },
      { type: 'Other', name: 'Interior Design', status: 'pending' }
    ],
    createdAt: '2024-03-08',
    status: 'active'
  }
];