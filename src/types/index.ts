export interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    name: "admin" | "employee";
  };
  profilePicture?: string;
}

export interface AssignedTo {
  _id?: string;
  name: string;
  profilePicture: string;
  email?: string;
  role?: {
    name: "admin" | "employee";
  };
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  assignedTo?: AssignedTo[];
  createdBy: User;
  cumulativeTime: number;
  deadTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  _id: string;
  title: string;
  description?: string;
  userId: {
    _id?: string;
    name: string;
    profilePicture: string;
    email?: string;
    role?: {
      name: "admin" | "employee";
    };
  };
  taskId: {
    _id?: string;
    title: string;
    description?: string;
  };
  status: "pending" | "in-progress" | "completed" | "stopped";
  assignedBy: {
    name: string;
    profilePicture: string;
  };
  deadTime: string;
  createdAt: string;
  updatedAt: string;
  cumulativeTime: number;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "error" | "success" | "warning" | "task" | "info";
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
export interface TimeLog {
  _id: string;
  taskId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
  };
  time: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status?: "pending" | "in-progress" | "completed" | "stopped";
  deadTime?: string;
  assignedTo?: string[];
}

export interface UpdateTaskPayload {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "stopped";
  deadTime?: string;
}

export interface CreateSubTaskPayload {
  taskId: string;
  userId: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "stopped";
  deadTime?: string;
}

export interface UpdateSubTaskPayload {
  id: string;
  taskId?: string;
  userId?: string;
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "stopped";
  deadTime?: string;
}

export interface SubTaskStatus {
  status: "pending" | "in-progress" | "completed" | "stopped";
}
