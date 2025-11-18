// src/pages/Employee/EmployeeDashboard.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../component/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Attendance from './Attendance';
import DashboardPage from './DashboardPage';
import EmployeeLeaves from './EmployeeLeaves';
import EmployeeProfile from './EmployeeProfile';
import EmployeeRequestPortal from './EmployeeRequestPortal';
import EmployeePayroll from './EmployeePayroll';
import EmployeeProjects from './EmployeeProjects';

// Placeholder components - remove duplicate declarations
// const EmployeeProjects = () => (
//   <Box sx={{ p: 3 }}>
//     <h1>My Projects</h1>
//     <p>Project management content goes here...</p>
//   </Box>
// );

// const EmployeeLeaves = () => (
//   <Box sx={{ p: 3 }}>
//     <h1>Leave Management</h1>
//     <p>Leave management content goes here...</p>
//   </Box>
// );

// const EmployeePayroll = () => (
//   <Box sx={{ p: 3 }}>
//     <h1>Payroll</h1>
//     <p>Payroll information goes here...</p>
//   </Box>
// );

const EmployeeNotifications = () => (
  <Box sx={{ p: 3 }}>
    <h1>Notifications</h1>
    <p>Notifications content goes here...</p>
  </Box>
);

// const EmployeeRequestPortal = () => (
//   <Box sx={{ p: 3 }}>
//     <h1>Internal Qurey</h1>
//     <p>Internal Qurey content goes here...</p>
//   </Box>
// );

// const EmployeeProfile = () => (
//   <Box sx={{ p: 3 }}>
//     <h1>My Profile</h1>
//     <p>Profile management content goes here...</p>
//   </Box>
// );

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 240px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="projects" element={<EmployeeProjects />} />
          <Route path="leaves" element={<EmployeeLeaves />} />
          <Route path="payroll" element={<EmployeePayroll />} />
          <Route path="queries" element={<EmployeeRequestPortal />} />
          <Route path="notifications" element={<EmployeeNotifications />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="*" element={<div>Employee Page Not Found</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;