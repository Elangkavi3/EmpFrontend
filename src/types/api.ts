// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://empbackend-pj7o.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
  emp_id: number;
  designation?: string;
  department_name?: string;
  join_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  attendance_id: number;
  emp_id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

export interface LeaveRecord {
  leave_id: number;
  emp_id: number;
  start_date: string;
  end_date: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applied_on: string;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  role: string;
  progress: string;
  remarks: string;
}

export interface DashboardStats {
  present_days: number;
  late_days: number;
  absent_days: number;
  total_leaves: number;
  used_leaves: number;
  active_projects: number;
}

export interface LeaveRecord {
  leave_id: number;
  emp_id: number;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applied_on: string;
}

export interface LeaveApplicationData {
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
  }

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

export interface Payroll {
  id: string;
  designation: string;
  join_date: string;
  basic_salary: string;
  bonus: string;
  deduction: string;
  total: string;
  status: "PAID" | "PENDING" | "CANCELLED";
  payroll_month: string;
  generated_date?: string;
}

export interface PayrollSummary {
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
}





// Auth API
export const authAPI = {
  login: (data: LoginData) => 
    api.post<{ token: string; user: User; message: string }>('/auth/login', data),
  getProfile: () => 
    api.get<{ user: User }>('/auth/profile'),
};

// Employee API
export const employeeAPI = {
  getDashboard: () => 
    api.get<{ stats: DashboardStats }>('/employee/dashboard'),
  getAttendance: (month?: number, year?: number) => 
    api.get<{ records: AttendanceRecord[]; today: AttendanceRecord | null }>('/employee/attendance', {
      params: { month, year }
    }),
  checkIn: () => 
    api.post<{ message: string; record: AttendanceRecord }>('/employee/checkin'),
  checkOut: () => 
    api.post<{ message: string; record: AttendanceRecord }>('/employee/checkout'),
//   getLeaves: () => 
//     api.get<{ leaves: LeaveRecord[] }>('/employee/leaves'),
  getProjects: () => 
    api.get<{ projects: Project[] }>('/employee/projects'),
  getLeaves: () => api.get<{ leaves: LeaveRecord[] }>('/employee/leaves'),
  applyLeave: (data: LeaveApplicationData) => 
    api.post<{ message: string; leave: LeaveRecord }>('/employee/leaves', data),

    getProfile: () =>
    api.get<ProfileResponse>('/employee/profile'), 
  updateProfile: (data: { phone?: string; designation?: string }) =>
    api.put<UpdateProfileResponse>('/employee/profile', data),
};

export default api;