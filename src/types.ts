export interface Project {
  id: string;
  name: string;
  createdAt: string;
  status: 'active' | 'completed';
  taskStatus: {
    mddaMap: 'pending' | 'in-progress' | 'completed';
    architectureDesign: 'pending' | 'in-progress' | 'completed';
    construction: 'pending' | 'in-progress' | 'completed';
    other: 'pending' | 'in-progress' | 'completed';
  };
}


export interface Task {
  type: 'MDDA Map' | 'Architecture Design' | 'Construction' | 'Other';
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface User {
  username: string;
  password: string;
  role: 'admin';
}