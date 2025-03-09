export interface User {
  id: string;
  email: string;
  role: 'admin' | 'security' | 'operator';
}

export interface Camera {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline';
  url: string;
}

export interface Alert {
  id: string;
  cameraId: string;
  timestamp: string;
  type: 'suspicious_activity' | 'crime' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high';
  description: string;
  snapshot: string;
  status: 'new' | 'reviewing' | 'resolved' | 'false_positive';
}