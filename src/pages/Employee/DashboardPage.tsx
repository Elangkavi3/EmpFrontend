// // src/pages/Employee/DashboardPage.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   IconButton,
//   Button,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   Description,
//   Work,
//   AccessTime,
//   EventAvailable,
//   CalendarToday,
// } from '@mui/icons-material';
 
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { employeeAPI } from '../../types/api';

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [todayAttendance, setTodayAttendance] = useState<any>(null);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchTodayAttendance();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await employeeAPI.getDashboard();
//       setStats(response.data.stats);
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTodayAttendance = async () => {
//     try {
//       const response = await employeeAPI.getAttendance();
//       setTodayAttendance(response.data.today);
//     } catch (error) {
//       console.error('Failed to fetch today attendance:', error);
//     }
//   };

//   const statCards = [
//     { 
//       label: 'Present Days', 
//       value: stats?.present_days || 0, 
//       color: 'success' as const, 
//       icon: CheckCircle,
//       description: 'This month'
//     },
//     { 
//       label: 'Leave Balance', 
//       value: (stats?.total_leaves || 0) - (stats?.used_leaves || 0), 
//       color: 'info' as const, 
//       icon: Description,
//       description: 'Remaining leaves'
//     },
//     { 
//       label: 'Active Projects', 
//       value: stats?.active_projects || 0, 
//       color: 'secondary' as const, 
//       icon: Work,
//       description: 'Currently assigned'
//     },
//     { 
//       label: 'Late Days', 
//       value: stats?.late_days || 0, 
//       color: 'warning' as const, 
//       icon: AccessTime,
//       description: 'This month'
//     },
//   ];

//   const quickActions = [
//     {
//       label: 'Mark Attendance',
//       icon: <CheckCircle />,
//       color: 'primary' as const,
//       onClick: () => navigate('/employee/attendance')
//     },
//     {
//       label: 'Apply Leave',
//       icon: <EventAvailable />,
//       color: 'secondary' as const,
//       onClick: () => navigate('/employee/leaves')
//     },
//     {
//       label: 'View Projects',
//       icon: <Work />,
//       color: 'success' as const,
//       onClick: () => navigate('/employee/projects')
//     },
//     {
//       label: 'My Schedule',
//       icon: <CalendarToday />,
//       color: 'info' as const,
//       onClick: () => navigate('/employee/attendance')
//     },
//   ];

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();
    
//     const days = [];
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push(new Date(year, month, i));
//     }
//     return days;
//   };

//   const isToday = (date: Date) => {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//            date.getMonth() === today.getMonth() &&
//            date.getFullYear() === today.getFullYear();
//   };

//   const isWeekend = (date: Date) => {
//     const day = date.getDay();
//     return day === 0 || day === 6; // Sunday or Saturday
//   };

//   const getAttendanceStatus = () => {
//     if (!todayAttendance) {
//       return { status: 'Not Checked In', color: 'error' as const, action: 'Check In' };
//     }
//     if (todayAttendance && !todayAttendance.check_out) {
//       return { status: 'Checked In', color: 'success' as const, action: 'Check Out' };
//     }
//     return { status: 'Completed', color: 'info' as const, action: 'View Details' };
//   };

//   const attendanceStatus = getAttendanceStatus();

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Header Section */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Welcome back, {user?.username}!
//           </Typography>
//           <Typography variant="h6" color="text.secondary">
//             Here's your overview for today
//           </Typography>
//         </Box>
//         <Button 
//           variant="contained" 
//           startIcon={<AddIcon />}
//           onClick={() => navigate('/employee/attendance')}
//         >
//           Quick Check-in
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         {/* User Profile & Calendar Card */}
//         <Grid size={{xs:12,md:4}}>
//           <Card sx={{ height: '100%' }}>
//             <CardContent>
//               {/* User Profile */}
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
//                 <Avatar
//                   sx={{ 
//                     width: 64, 
//                     height: 64, 
//                     bgcolor: 'primary.main',
//                     fontSize: '1.5rem',
//                     fontWeight: 'bold'
//                   }}
//                   src={`https://ui-avatars.com/api/?name=${user?.username}&background=1976d2&color=fff`}
//                 >
//                   {user?.username?.charAt(0).toUpperCase()}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6" fontWeight="bold">
//                     {user?.username}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {user?.designation || 'Employee'}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" display="block">
//                     {user?.department_name || 'Department'}
//                   </Typography>
//                   <Typography variant="caption" color="primary" display="block">
//                     Emp ID: {user?.emp_id}
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* Today's Attendance Status */}
//               <Box 
//                 sx={{ 
//                   p: 2, 
//                   backgroundColor: `${attendanceStatus.color}.light`, 
//                   borderRadius: 2,
//                   border: 1,
//                   borderColor: `${attendanceStatus.color}.main`,
//                   mb: 3
//                 }}
//               >
//                 <Typography variant="subtitle2" fontWeight="bold" color={`${attendanceStatus.color}.dark`}>
//                   Today's Status
//                 </Typography>
//                 <Typography variant="h6" color={`${attendanceStatus.color}.dark`} gutterBottom>
//                   {attendanceStatus.status}
//                 </Typography>
//                 {todayAttendance && (
//                   <Box sx={{ mt: 1 }}>
//                     <Typography variant="caption" display="block">
//                       <strong>Check In:</strong> {new Date(todayAttendance.check_in).toLocaleTimeString()}
//                     </Typography>
//                     {todayAttendance.check_out && (
//                       <Typography variant="caption" display="block">
//                         <strong>Check Out:</strong> {new Date(todayAttendance.check_out).toLocaleTimeString()}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               </Box>

//               {/* === MINI CALENDAR (Updated styling only — logic unchanged) === */}
//               <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
//                 {/* Month Header */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
//                   <IconButton
//                     size="small"
//                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
//                   >
//                     <ChevronLeft />
//                   </IconButton>

//                   <Typography
//                     variant="h6"
//                     fontWeight="600"
//                     textAlign="center"
//                     sx={{ flexGrow: 1, fontSize: '1rem', color: 'text.primary', letterSpacing: 0.5 }}
//                   >
//                     {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                   </Typography>

//                   <IconButton
//                     size="small"
//                     onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
//                   >
//                     <ChevronRight />
//                   </IconButton>
//                 </Box>

//                 {/* Day Headers */}
//                 <Grid container columns={7} spacing={0.5} sx={{ mb: 1 }}>
//                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
//                     <Grid size={{xs:1}} key={day} sx={{ textAlign: 'center' }}>
//                       <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
//                         {day}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Grid>

//                 {/* Calendar Days */}
//                 <Grid container columns={7} spacing={0.5}>
//                   {getDaysInMonth(currentMonth).map((day, idx) => (
//                     <Grid size={{xs:1}} key={idx} sx={{ textAlign: 'center' }}>
//                       {day ? (
//                         <Box
//                           sx={{
//                             width: '100%',
//                             aspectRatio: '1',
//                             borderRadius: 1,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             fontSize: '0.8rem',
//                             fontWeight: isToday(day) ? '600' : '400',
//                             cursor: 'pointer',
//                             backgroundColor: isToday(day)
//                               ? 'primary.main'
//                               : isWeekend(day)
//                               ? 'grey.50'
//                               : 'background.paper',
//                             color: isToday(day)
//                               ? 'primary.contrastText'
//                               : isWeekend(day)
//                               ? 'text.disabled'
//                               : 'text.primary',
//                             border: isToday(day)
//                               ? '2px solid'
//                               : isWeekend(day)
//                               ? '1px solid #f0f0f0'
//                               : '1px solid transparent',
//                             transition: 'all 0.2s ease',
//                             '&:hover': {
//                               backgroundColor: isToday(day) ? 'primary.main' : 'action.hover',
//                               transform: 'scale(1.05)',
//                             },
//                             boxShadow: isToday(day) ? 2 : 0,
//                           }}
//                         >
//                           <Typography variant="caption">
//                             {day.getDate()}
//                           </Typography>
//                         </Box>
//                       ) : (
//                         <Box sx={{ aspectRatio: '1' }} />
//                       )}
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
//               {/* === END MINI CALENDAR === */}

//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Main Content Area */}
//         <Grid size={{xs:12,sm:8 }}>
//           {/* Quick Actions */}
//           <Card sx={{ mb: 3 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Grid container spacing={2}>
//                 {quickActions.map((action, index) => (
//                   <Grid size={{xs:6,sm:3 }} key={index}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       startIcon={action.icon}
//                       onClick={action.onClick}
//                       sx={{
//                         height: 80,
//                         flexDirection: 'column',
//                         gap: 1,
//                         borderColor: `${action.color}.main`,
//                         color: `${action.color}.main`,
//                         '&:hover': {
//                           backgroundColor: `${action.color}.light`,
//                           borderColor: `${action.color}.dark`,
//                         }
//                       }}
//                     >
//                       <Typography variant="caption" fontWeight="bold">
//                         {action.label}
//                       </Typography>
//                     </Button>
//                   </Grid>
//                 ))}
//               </Grid>
//             </CardContent>
//           </Card>

//           {/* Statistics Cards */}
//           <Grid container spacing={3}>
//             {statCards.map((stat, index) => {
//               const IconComponent = stat.icon;
//               return (
//                 <Grid size={{xs:12,sm:6 }} key={index}>
//                   <Card
//                     sx={{
//                       background: (theme) => 
//                         `linear-gradient(135deg, ${theme.palette[stat.color].light}20, ${theme.palette[stat.color].main}20)`,
//                       border: 1,
//                       borderColor: `${stat.color}.light`,
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         transform: 'translateY(-4px)',
//                         boxShadow: 3,
//                       },
//                     }}
//                   >
//                     <CardContent>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary" gutterBottom>
//                             {stat.label}
//                           </Typography>
//                           <Typography 
//                             variant="h3" 
//                             fontWeight="bold" 
//                             color={`${stat.color}.main`}
//                             sx={{ mt: 1 }}
//                           >
//                             {stat.value}
//                           </Typography>
//                           <Typography 
//                             variant="caption" 
//                             color="text.secondary" 
//                             sx={{ mt: 1, display: 'block' }}
//                           >
//                             {stat.description}
//                           </Typography>
//                         </Box>
//                         <IconComponent 
//                           sx={{ 
//                             fontSize: 48, 
//                             color: `${stat.color}.main`, 
//                             opacity: 0.8 
//                           }} 
//                         />
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               );
//             })}
//           </Grid>

//           {/* Recent Activity Placeholder */}
//           <Card sx={{ mt: 3 }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight="bold" gutterBottom>
//                 Recent Activity
//               </Typography>
//               <Box sx={{ textAlign: 'center', py: 4 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   Your recent activities will appear here
//                 </Typography>
//                 <Button 
//                   variant="text" 
//                   color="primary" 
//                   sx={{ mt: 1 }}
//                   onClick={() => navigate('/employee/attendance')}
//                 >
//                   View Full Activity
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default DashboardPage;


// src/pages/Employee/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Avatar, IconButton,
  Button, CircularProgress, Alert, useTheme, useMediaQuery, Fade,
  Paper
} from '@mui/material';
import {
  Add as AddIcon, ChevronLeft, ChevronRight, CheckCircle, Description,
  Work, AccessTime, EventAvailable, CalendarToday,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../types/api';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);
//const MotionGrid = motion(Grid);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchDashboardData();
    fetchTodayAttendance();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await employeeAPI.getDashboard();
      setStats(response.data.stats);
      setSuccess('Dashboard data loaded successfully');
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const response = await employeeAPI.getAttendance();
      setTodayAttendance(response.data.today);
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
    }
  };

  const statCards = [
    { 
      label: 'Present Days', 
      value: stats?.present_days || 0, 
      color: 'success' as const, 
      icon: CheckCircle,
      description: 'This month'
    },
    { 
      label: 'Leave Balance', 
      value: (stats?.total_leaves || 0) - (stats?.used_leaves || 0), 
      color: 'info' as const, 
      icon: Description,
      description: 'Remaining leaves'
    },
    { 
      label: 'Active Projects', 
      value: stats?.active_projects || 0, 
      color: 'secondary' as const, 
      icon: Work,
      description: 'Currently assigned'
    },
    { 
      label: 'Late Days', 
      value: stats?.late_days || 0, 
      color: 'warning' as const, 
      icon: AccessTime,
      description: 'This month'
    },
  ];

  const quickActions = [
    {
      label: 'Mark Attendance',
      icon: <CheckCircle />,
      color: 'primary' as const,
      onClick: () => navigate('/employee/attendance')
    },
    {
      label: 'Apply Leave',
      icon: <EventAvailable />,
      color: 'secondary' as const,
      onClick: () => navigate('/employee/leaves')
    },
    {
      label: 'View Projects',
      icon: <Work />,
      color: 'success' as const,
      onClick: () => navigate('/employee/projects')
    },
    {
      label: 'My Schedule',
      icon: <CalendarToday />,
      color: 'info' as const,
      onClick: () => navigate('/employee/attendance')
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getAttendanceStatus = () => {
    if (!todayAttendance) {
      return { status: 'Not Checked In', color: 'error' as const, action: 'Check In' };
    }
    if (todayAttendance && !todayAttendance.check_out) {
      return { status: 'Checked In', color: 'success' as const, action: 'Check Out' };
    }
    return { status: 'Completed', color: 'info' as const, action: 'View Details' };
  };

  const attendanceStatus = getAttendanceStatus();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: isMobile ? 1 : 3,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Section */}
      <MotionPaper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome back, {user?.username}!
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Here's your overview for today
            </Typography>
          </Box>
          <MotionButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/employee/attendance')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            Quick Check-in
          </MotionButton>
        </Box>
      </MotionPaper>

      {/* Alerts Section */}
      <Box sx={{ flexShrink: 0, mb: 3 }}>
        {error && (
          <Fade in>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                animation: error ? 'shake 0.5s ease-in-out' : 'none',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' },
                }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {success && (
          <Fade in>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </Fade>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* User Profile & Calendar Card */}
        <Grid size={{xs:12,md:4}}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.95)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* User Profile */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=1976d2&color=fff`}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.designation || 'Employee'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {user?.department_name || 'Department'}
                  </Typography>
                  <Typography variant="caption" color="primary" display="block">
                    Emp ID: {user?.emp_id}
                  </Typography>
                </Box>
              </Box>

              {/* Today's Attendance Status */}
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: `${attendanceStatus.color}.light`, 
                  borderRadius: 2,
                  border: 1,
                  borderColor: `${attendanceStatus.color}.main`,
                  mb: 3
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" color={`${attendanceStatus.color}.dark`}>
                  Today's Status
                </Typography>
                <Typography variant="h6" color={`${attendanceStatus.color}.dark`} gutterBottom>
                  {attendanceStatus.status}
                </Typography>
                {todayAttendance && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>Check In:</strong> {new Date(todayAttendance.check_in).toLocaleTimeString()}
                    </Typography>
                    {todayAttendance.check_out && (
                      <Typography variant="caption" display="block">
                        <strong>Check Out:</strong> {new Date(todayAttendance.check_out).toLocaleTimeString()}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              {/* Mini Calendar */}
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    sx={{
                      backgroundColor: 'rgba(102,126,234,0.1)',
                      '&:hover': { backgroundColor: 'rgba(102,126,234,0.2)' }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <Typography
                    variant="h6"
                    fontWeight="600"
                    textAlign="center"
                    sx={{ flexGrow: 1, fontSize: '1rem', color: 'text.primary', letterSpacing: 0.5 }}
                  >
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    sx={{
                      backgroundColor: 'rgba(102,126,234,0.1)',
                      '&:hover': { backgroundColor: 'rgba(102,126,234,0.2)' }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>

                {/* Day Headers */}
                <Grid container columns={7} spacing={0.5} sx={{ mb: 1 }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <Grid size={{xs:1}} key={day} sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Calendar Days */}
                <Grid container columns={7} spacing={0.5}>
                  {getDaysInMonth(currentMonth).map((day, idx) => (
                    <Grid size={{xs:1}} key={idx} sx={{ textAlign: 'center' }}>
                      {day ? (
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: isToday(day) ? '600' : '400',
                            cursor: 'pointer',
                            backgroundColor: isToday(day)
                              ? 'primary.main'
                              : isWeekend(day)
                              ? 'grey.50'
                              : 'background.paper',
                            color: isToday(day)
                              ? 'primary.contrastText'
                              : isWeekend(day)
                              ? 'text.disabled'
                              : 'text.primary',
                            border: isToday(day)
                              ? '2px solid'
                              : isWeekend(day)
                              ? '1px solid #f0f0f0'
                              : '1px solid transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: isToday(day) ? 'primary.main' : 'action.hover',
                              transform: 'scale(1.05)',
                            },
                            boxShadow: isToday(day) ? 2 : 0,
                          }}
                        >
                          <Typography variant="caption">
                            {day.getDate()}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ aspectRatio: '1' }} />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Main Content Area */}
        <Grid size={{xs:12,sm:8}}>
          {/* Quick Actions */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              flexShrink: 0
            }}
          >
            <CardContent sx={{ p: '0 !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid size={{xs:6,sm:3}} key={index}>
                    <MotionButton
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.onClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        height: 80,
                        flexDirection: 'column',
                        gap: 1,
                        borderColor: `${action.color}.main`,
                        color: `${action.color}.main`,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          backgroundColor: `${action.color}.light`,
                          borderColor: `${action.color}.dark`,
                        },
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        {action.label}
                      </Typography>
                    </MotionButton>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>

          {/* Statistics Cards */}
          <Grid container spacing={3}>
            <AnimatePresence>
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Grid size={{xs:12,sm:6}} key={index}>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)',
                        background: (theme) => 
                          `linear-gradient(135deg, ${theme.palette[stat.color].light}20, ${theme.palette[stat.color].main}20)`,
                        border: 1,
                        borderColor: `${stat.color}.light`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {stat.label}
                            </Typography>
                            <Typography 
                              variant="h3" 
                              fontWeight="bold" 
                              color={`${stat.color}.main`}
                              sx={{ mt: 1 }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ mt: 1, display: 'block' }}
                            >
                              {stat.description}
                            </Typography>
                          </Box>
                          <IconComponent 
                            sx={{ 
                              fontSize: 48, 
                              color: `${stat.color}.main`, 
                              opacity: 0.8 
                            }} 
                          />
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>

          {/* Recent Activity Placeholder */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            sx={{
              mt: 3,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.95)'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Your recent activities will appear here
                </Typography>
                <MotionButton 
                  variant="text" 
                  color="primary" 
                  sx={{ mt: 1 }}
                  onClick={() => navigate('/employee/attendance')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Full Activity
                </MotionButton>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;