export interface Project {
  _id: string;
  name: string;
  createdAt: string;
  status: 'active' | 'completed';
  tasks: {
    layout: boolean;
    mddaMap: boolean;
    structureDwg: boolean;
    architectureDwg: boolean;
    ext3D: boolean;
    other?: string;
  };
  taskStatus: {
    layout: 'pending' | 'in-progress' | 'completed';
    mddaMap: 'pending' | 'in-progress' | 'completed';
    structureDwg: 'pending' | 'in-progress' | 'completed';
    architectureDwg: 'pending' | 'in-progress' | 'completed';
    ext3D: 'pending' | 'in-progress' | 'completed';
    other: 'pending' | 'in-progress' | 'completed';
  };
}


export interface Task {
  type: 'Layout'| 'MDDA Submission' |'Structure Dwg' | 'Architecture Dwd' | 'Ext 3D' | 'Others';
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface User {
  username: string;
  password: string;
  role: 'admin';
}