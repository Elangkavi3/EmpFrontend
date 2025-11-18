// src/pages/Admin/AdminDashboard.tsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Sidebar from '../../component/Sidebar';
import { Routes, Route } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { md: `calc(100% - 240px)` }
        }}
      >
        <Routes>
          <Route path="/" element={
            <Container maxWidth="lg">
              <Typography variant="h4" gutterBottom>
                Admin / HR Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Manage employees, projects, payroll, leaves, etc.
              </Typography>
            </Container>
          } />
          <Route path="/dashboard" element={
            <Container maxWidth="lg">
              <Typography variant="h4" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body1">
                Welcome to the admin dashboard
              </Typography>
            </Container>
          } />
          <Route path="/employees" element={<div>Employees Management</div>} />
          <Route path="/projects" element={<div>Projects Management</div>} />
          <Route path="/payroll" element={<div>Payroll Management</div>} />
          <Route path="/leaves" element={<div>Leaves Management</div>} />
          <Route path="/notifications" element={<div>Notifications</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;