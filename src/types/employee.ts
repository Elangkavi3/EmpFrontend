// src/services/employeeService.ts
import axios from 'axios';

const API_BASE_URL = 'https://empbackend-pj7o.onrender.com/api';

// Attendance APIs - all expect employee ID (number)
export const getTodayAttendance = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/attendance/today/${empId}`);
  return response.data;
};

export const getAttendanceHistory = async (empId: number, month?: string, year?: string) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  
  const response = await axios.get(`${API_BASE_URL}/attendance/history/${empId}?${params}`);
  return response.data;
};

export const checkIn = async (empId: number) => {
  const response = await axios.post(`${API_BASE_URL}/attendance/checkin`, { empId });
  return response.data;
};

export const checkOut = async (empId: number) => {
  const response = await axios.post(`${API_BASE_URL}/attendance/checkout`, { empId });
  return response.data;
};

// Leave APIs
export const getLeaveBalance = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/leaves/balance/${empId}`);
  return response.data;
};

export const getLeaveHistory = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/leaves/history/${empId}`);
  return response.data;
};

export const applyLeave = async (leaveData: any) => {
  const response = await axios.post(`${API_BASE_URL}/leaves/apply`, leaveData);
  return response.data;
};

// Project APIs
export const getAssignedProjects = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/projects/assigned/${empId}`);
  return response.data;
};

export const getWorkLogs = async (empId: number, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await axios.get(`${API_BASE_URL}/worklogs/${empId}?${params}`);
  return response.data;
};

export const addWorkLog = async (workLogData: any) => {
  const response = await axios.post(`${API_BASE_URL}/worklogs`, workLogData);
  return response.data;
};

// Payroll APIs
export const getPayrollHistory = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/payroll/history/${empId}`);
  return response.data;
};

export const getCurrentPayroll = async (empId: number) => {
  const response = await axios.get(`${API_BASE_URL}/payroll/current/${empId}`);
  return response.data;
};