// src/App.tsx
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Button, Typography } from '@mui/material';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import type { JSX } from 'react';
import { CircularProgress } from '@mui/material';

// ------------------ THEME ------------------
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    h4: { fontWeight: 'bold' },
    h6: { fontWeight: 'bold' }
  }
});

// ------------------ PROTECTED ROUTE ------------------
const ProtectedRoute = ({
  children,
  requiredRole
}: {
  children: JSX.Element;
  requiredRole?: 'ADMIN' | 'HR' | 'EMPLOYEE' | 'ADMIN/HR';
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    if (requiredRole === 'ADMIN/HR') {
      if (user.role !== 'ADMIN' && user.role !== 'HR') {
        return <Navigate to="/unauthorized" replace />;
      }
    } else if (user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

// ------------------ UNAUTHORIZED PAGE ------------------
const UnauthorizedPage = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
      textAlign: 'center'
    }}
  >
    <Typography variant="h4" color="error">
      401 - Unauthorized
    </Typography>
    <Typography>You don’t have permission to access this page.</Typography>
    <Button variant="contained" color="primary" href="/EmpFrontend/login">
      Go to Login
    </Button>
  </Box>
);

// ------------------ 404 PAGE ------------------
const NotFoundPage = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
      textAlign: 'center',
      px: 2
    }}
  >
    <Typography variant="h3" color="primary" fontWeight="bold">
      404 - Page Not Found
    </Typography>
    <Typography variant="body1" sx={{ maxWidth: 400 }}>
      The page you’re looking for doesn’t exist or has been moved.
    </Typography>
    <Button variant="contained" color="secondary" href="/EmpFrontend/login">
      Back to Login
    </Button>
  </Box>
);

// ------------------ MAIN APP ------------------
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router basename="/EmpFrontend">
        <AuthProvider>
          <Routes>
            {/* Redirect root → login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="ADMIN/HR">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
