// src/App.tsx
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import type { JSX } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
  },
});

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: 'ADMIN' | 'HR' | 'EMPLOYEE' | 'ADMIN/HR' }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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

const UnauthorizedPage = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: 2
    }}
  >
    <h1>401 - Unauthorized</h1>
    <p>You don't have permission to access this page.</p>
    <Navigate to="/login" replace />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Auth Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="ADMIN/HR">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employee/*"
                element={
                  <ProtectedRoute requiredRole="EMPLOYEE">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;