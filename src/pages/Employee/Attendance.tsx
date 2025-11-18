// // src/pages/Employee/Attendance.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Chip,
//   TextField,
//   MenuItem,
//   Grid,
//   Card,
//   CardContent,
//   Alert,
//   CircularProgress,
//   Snackbar
// } from '@mui/material';
// import {
//   CheckCircle,
//   Schedule,
//   AccessTime,
//   EventAvailable,
// } from '@mui/icons-material';
 
// //import { useAuth } from '../../context/AuthContext';
// import { employeeAPI } from '../../types/api';

// interface AttendanceRecord {
//   attendance_id: number;
//   emp_id: number;
//   date: string;
//   check_in: string;
//   check_out: string | null;
//   status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
// }

// const Attendance: React.FC = () => {
//  // const { user } = useAuth();
//   const [records, setRecords] = useState<AttendanceRecord[]>([]);
//   const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');
//   const [checkingIn, setCheckingIn] = useState<boolean>(false);
//   const [checkingOut, setCheckingOut] = useState<boolean>(false);
  
//   const [filters, setFilters] = useState({
//     month: new Date().getMonth() + 1,
//     year: new Date().getFullYear(),
//   });

//   const fetchAttendanceRecords = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const response = await employeeAPI.getAttendance(filters.month, filters.year);
//       setRecords(response.data.records);
//       setTodayRecord(response.data.today);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch attendance records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCheckIn = async () => {
//     try {
//       setCheckingIn(true);
//       setError('');

//       const response = await employeeAPI.checkIn();
//       setSuccessMessage(response.data.message);
//       fetchAttendanceRecords();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Check-in failed');
//     } finally {
//       setCheckingIn(false);
//     }
//   };

//   const handleCheckOut = async () => {
//     try {
//       setCheckingOut(true);
//       setError('');

//       const response = await employeeAPI.checkOut();
//       setSuccessMessage(response.data.message);
//       fetchAttendanceRecords();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Check-out failed');
//     } finally {
//       setCheckingOut(false);
//     }
//   };

//   const handleFilterChange = (field: string, value: string) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: parseInt(value)
//     }));
//   };

//   const applyFilters = () => {
//     fetchAttendanceRecords();
//   };

//   const getStatusChip = (status: string) => {
//     const statusConfig = {
//       PRESENT: { color: 'success', label: 'Present' },
//       ABSENT: { color: 'error', label: 'Absent' },
//       LATE: { color: 'warning', label: 'Late' },
//       HALF_DAY: { color: 'info', label: 'Half Day' }
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
    
//     return (
//       <Chip 
//         label={config.label} 
//         color={config.color as any} 
//         size="small" 
//       />
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (dateTimeString: string | null) => {
//     if (!dateTimeString) return 'Not checked out';
//     return new Date(dateTimeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSuccessMessage('');
//     setError('');
//   };

//   const calculateSummary = () => {
//     const present = records.filter(r => r.status === 'PRESENT').length;
//     const late = records.filter(r => r.status === 'LATE').length;
//     const absent = records.filter(r => r.status === 'ABSENT').length;
//     const total = records.length;
//     const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

//     return {
//       present,
//       late,
//       absent,
//       attendanceRate: Math.round(attendanceRate * 100) / 100
//     };
//   };

//   const summary = calculateSummary();

//   useEffect(() => {
//     fetchAttendanceRecords();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom fontWeight="bold">
//         Attendance Management
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseSnackbar}>
//           {error}
//         </Alert>
//       )}

//       <Snackbar
//         open={!!successMessage}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         message={successMessage}
//       />

//       {/* Today's Attendance Section */}
//       <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//         <CardContent>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Box>
//               <Typography variant="h5" gutterBottom color="white" fontWeight="bold">
//                 Today's Attendance
//               </Typography>
//               <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               {!todayRecord ? (
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: 'white',
//                     color: '#667eea',
//                     fontWeight: 'bold',
//                     '&:hover': {
//                       backgroundColor: 'grey.100',
//                     },
//                   }}
//                   onClick={handleCheckIn}
//                   disabled={checkingIn}
//                   size="large"
//                   startIcon={checkingIn ? <CircularProgress size={20} /> : <CheckCircle />}
//                 >
//                   {checkingIn ? 'Checking In...' : 'Check In'}
//                 </Button>
//               ) : !todayRecord.check_out ? (
//                 <Button
//                   variant="contained"
//                   sx={{
//                     backgroundColor: 'white',
//                     color: '#f56565',
//                     fontWeight: 'bold',
//                     '&:hover': {
//                       backgroundColor: 'grey.100',
//                     },
//                   }}
//                   onClick={handleCheckOut}
//                   disabled={checkingOut}
//                   size="large"
//                   startIcon={checkingOut ? <CircularProgress size={20} /> : <AccessTime />}
//                 >
//                   {checkingOut ? 'Checking Out...' : 'Check Out'}
//                 </Button>
//               ) : (
//                 <Chip 
//                   label="Completed for today" 
//                   color="success" 
//                   sx={{ 
//                     backgroundColor: 'white',
//                     color: 'success.main',
//                     fontWeight: 'bold',
//                     fontSize: '1rem',
//                     padding: '8px 16px'
//                   }}
//                 />
//               )}
//             </Box>
//           </Box>

//           {todayRecord && (
//             <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
//               <Typography variant="body1" color="white" sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CheckCircle fontSize="small" />
//                   <strong>Check In:</strong> {formatTime(todayRecord.check_in)}
//                 </Box>
//                 {todayRecord.check_out && (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <AccessTime fontSize="small" />
//                     <strong>Check Out:</strong> {formatTime(todayRecord.check_out)}
//                   </Box>
//                 )}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <EventAvailable fontSize="small" />
//                   <strong>Status:</strong> 
//                   <span style={{ marginLeft: 8 }}>{getStatusChip(todayRecord.status)}</span>
//                 </Box>
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Filters and Quick Stats */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         {/* Filters */}
//         <Grid size={{xs:12,md:8 }}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Filters
//               </Typography>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid size={{xs:12,sm:6,md:4 }}>
//                   <TextField
//                     fullWidth
//                     select
//                     label="Month"
//                     value={filters.month}
//                     onChange={(e) => handleFilterChange('month', e.target.value)}
//                   >
//                     {Array.from({ length: 12 }, (_, i) => (
//                       <MenuItem key={i + 1} value={i + 1}>
//                         {new Date(2000, i).toLocaleDateString('en-US', { month: 'long' })}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//                 <Grid size={{xs:12,sm:6,md:4 }}>
//                   <TextField
//                     fullWidth
//                     select
//                     label="Year"
//                     value={filters.year}
//                     onChange={(e) => handleFilterChange('year', e.target.value)}
//                   >
//                     {Array.from({ length: 5 }, (_, i) => {
//                       const year = new Date().getFullYear() - 2 + i;
//                       return (
//                         <MenuItem key={year} value={year}>
//                           {year}
//                         </MenuItem>
//                       );
//                     })}
//                   </TextField>
//                 </Grid>
//                 <Grid size={{xs:12,sm:6,md:4 }}>
//                   <Button
//                     variant="contained"
//                     onClick={applyFilters}
//                     fullWidth
//                     startIcon={<Schedule />}
//                   >
//                     Apply Filters
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Quick Stats */}
//         <Grid size={{xs:12,md:4 }}>
//           <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Stats
//               </Typography>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Attendance Rate
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold">
//                     {summary.attendanceRate}%
//                   </Typography>
//                 </Box>
//                 <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Monthly Summary Cards */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid size={{xs:12,sm:6,md:3 }}>
//           <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Present Days
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold" color="success.main">
//                     {summary.present}
//                   </Typography>
//                 </Box>
//                 <CheckCircle sx={{ color: 'success.main', fontSize: 32 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid size={{xs:12,sm:6,md:3 }}>
//           <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Late Days
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold" color="warning.main">
//                     {summary.late}
//                   </Typography>
//                 </Box>
//                 <Schedule sx={{ color: 'warning.main', fontSize: 32 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid size={{xs:12,sm:6,md:3 }}>
//           <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Absent Days
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold" color="error.main">
//                     {summary.absent}
//                   </Typography>
//                 </Box>
//                 <EventAvailable sx={{ color: 'error.main', fontSize: 32 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid size={{xs:12,sm:6,md:3 }}>
//           <Card sx={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' }}>
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Records
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold" color="info.main">
//                     {records.length}
//                   </Typography>
//                 </Box>
//                 <AccessTime sx={{ color: 'info.main', fontSize: 32 }} />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Today's Overview */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid size={{xs:12,md:6 }}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Today's Details
//               </Typography>
//               <Box sx={{ spaceY: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
//                   <Typography variant="body2" color="text.secondary">Status:</Typography>
//                   <Typography variant="body1" fontWeight="medium">
//                     {todayRecord?.status || 'Not Checked In'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
//                   <Typography variant="body2" color="text.secondary">Check In:</Typography>
//                   <Typography variant="body1" fontWeight="medium">
//                     {todayRecord ? formatTime(todayRecord.check_in) : '--:--'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
//                   <Typography variant="body2" color="text.secondary">Check Out:</Typography>
//                   <Typography variant="body1" fontWeight="medium">
//                     {todayRecord ? formatTime(todayRecord.check_out) : '--:--'}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid size={{xs:12,md:6 }}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Monthly Summary
//               </Typography>
//               <Box sx={{ spaceY: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
//                   <Typography variant="body2">Present</Typography>
//                   <Typography variant="h6" fontWeight="bold" color="success.main">
//                     {summary.present} days
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
//                   <Typography variant="body2">Late</Typography>
//                   <Typography variant="h6" fontWeight="bold" color="warning.main">
//                     {summary.late} days
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
//                   <Typography variant="body2">Absent</Typography>
//                   <Typography variant="h6" fontWeight="bold" color="error.main">
//                     {summary.absent} days
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Attendance Records Table */}
//       <Card>
//         <CardContent>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//             <Typography variant="h6" fontWeight="bold">
//               Attendance History
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {records.length} record(s) found
//             </Typography>
//           </Box>
          
//           <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//             <Table>
//               <TableHead sx={{ backgroundColor: 'grey.50' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Check In</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Check Out</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Working Hours</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {records.map((record) => {
//                   const checkIn = new Date(record.check_in);
//                   const checkOut = record.check_out ? new Date(record.check_out) : null;
//                   const workingHours = checkOut ? 
//                     ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(1) + 'h' : 
//                     'In Progress';

//                   return (
//                     <TableRow key={record.attendance_id} hover>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="medium">
//                           {formatDate(record.date)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatTime(record.check_in)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatTime(record.check_out)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         {getStatusChip(record.status)}
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="medium">
//                           {workingHours}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
          
//           {records.length === 0 && !loading && (
//             <Box sx={{ textAlign: 'center', py: 6 }}>
//               <EventAvailable sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
//               <Typography variant="h6" color="textSecondary" gutterBottom>
//                 No attendance records found
//               </Typography>
//               <Typography variant="body2" color="textSecondary">
//                 No attendance records available for the selected period.
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Attendance;

// src/pages/Employee/Attendance.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  AccessTime,
  EventAvailable,
  FilterList,
  Clear,
  Check,
  CalendarToday,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeAPI } from '../../types/api';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

interface AttendanceRecord {
  attendance_id: number;
  emp_id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [checkingIn, setCheckingIn] = useState<boolean>(false);
  const [checkingOut, setCheckingOut] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  
  const [filters, setFilters] = useState({
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Convert string filters to numbers for API call
      const monthNum = parseInt(filters.month);
      const yearNum = parseInt(filters.year);
      
      const response = await employeeAPI.getAttendance(monthNum, yearNum);
      setRecords(response.data.records);
      setTodayRecord(response.data.today);
      setSuccessMessage('Attendance records loaded successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      setError('');

      const response = await employeeAPI.checkIn();
      setSuccessMessage(response.data.message);
      fetchAttendanceRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckingOut(true);
      setError('');

      const response = await employeeAPI.checkOut();
      setSuccessMessage(response.data.message);
      fetchAttendanceRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchAttendanceRecords();
    setSuccessMessage('Filters applied successfully');
  };

  const clearFilters = () => {
    setFilters({
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear().toString(),
    });
    setSuccessMessage('Filters cleared successfully');
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PRESENT: { color: 'success', label: 'Present' },
      ABSENT: { color: 'error', label: 'Absent' },
      LATE: { color: 'warning', label: 'Late' },
      HALF_DAY: { color: 'info', label: 'Half Day' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
    
    return (
      <Chip 
        label={config.label} 
        color={config.color as any} 
        size="small" 
        sx={{ fontWeight: 'bold', borderRadius: 1 }}
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not checked out';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSummary = () => {
    const present = records.filter(r => r.status === 'PRESENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const total = records.length;
    const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      present,
      late,
      absent,
      total,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  };

  const summary = calculateSummary();

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

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
              Attendance Management
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Track your daily attendance and working hours
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <MotionButton
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                px: 3,
                py: 1,
                borderRadius: 2
              }}
            >
              Filters
            </MotionButton>
            <MotionButton
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchAttendanceRecords}
              disabled={loading}
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
              Refresh
            </MotionButton>
          </Box>
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

        {successMessage && (
          <Fade in>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          </Fade>
        )}
      </Box>

      {/* Filters Section */}
      <Collapse in={filtersOpen}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Filter Attendance
              </Typography>
            </Box>
            <Chip
              label={`${records.length} records`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select
                  value={filters.month}
                  label="Month"
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(2000, i).toLocaleDateString('en-US', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                <MotionButton
                  variant="contained"
                  startIcon={<Check />}
                  onClick={applyFilters}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    flex: 1
                  }}
                >
                  Apply
                </MotionButton>
                <MotionButton
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{ borderRadius: 2, flex: 1 }}
                >
                  Clear
                </MotionButton>
              </Box>
            </Grid>
          </Grid>
        </MotionPaper>
      </Collapse>

      {/* Today's Attendance Section */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Today's Attendance
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!todayRecord ? (
                <MotionButton
                  variant="contained"
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  size="large"
                  startIcon={checkingIn ? <CircularProgress size={20} /> : <CheckCircle />}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: 'white',
                    color: '#667eea',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  {checkingIn ? 'Checking In...' : 'Check In'}
                </MotionButton>
              ) : !todayRecord.check_out ? (
                <MotionButton
                  variant="contained"
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  size="large"
                  startIcon={checkingOut ? <CircularProgress size={20} /> : <AccessTime />}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: 'white',
                    color: '#f56565',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }}
                >
                  {checkingOut ? 'Checking Out...' : 'Check Out'}
                </MotionButton>
              ) : (
                <Chip 
                  label="Completed for today" 
                  color="success" 
                  sx={{ 
                    backgroundColor: 'white',
                    color: 'success.main',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    borderRadius: 2
                  }}
                />
              )}
            </Box>
          </Box>

          {todayRecord && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle fontSize="small" />
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Check In</Typography>
                      <Typography variant="body1" fontWeight="bold">{formatTime(todayRecord.check_in)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime fontSize="small" />
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Check Out</Typography>
                      <Typography variant="body1" fontWeight="bold">{formatTime(todayRecord.check_out)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventAvailable fontSize="small" />
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Status</Typography>
                      <Box sx={{ mt: 0.5 }}>{getStatusChip(todayRecord.status)}</Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </MotionCard>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Present Days",
            value: summary.present,
            color: "success" as const,
            icon: <CheckCircle />,
            description: "On-time attendance"
          },
          {
            label: "Late Days",
            value: summary.late,
            color: "warning" as const,
            icon: <Schedule />,
            description: "Late arrivals"
          },
          {
            label: "Absent Days",
            value: summary.absent,
            color: "error" as const,
            icon: <EventAvailable />,
            description: "Missing days"
          },
          {
            label: "Attendance Rate",
            value: `${summary.attendanceRate}%`,
            color: "info" as const,
            icon: <CalendarToday />,
            description: "Overall performance"
          }
        ].map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                color: 'white',
                boxShadow: '0 8px 20px rgba(0,0,0,.1)',
                background: (theme) => 
                  `linear-gradient(135deg, ${theme.palette[stat.color].light}, ${theme.palette[stat.color].main})`,
              }}
            >
              <CardContent sx={{ p: '0 !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" fontWeight="800">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {stat.description}
                    </Typography>
                  </Box>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Attendance Records Table */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.95)',
          flex: 1
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Attendance History ({records.length})
            </Typography>
          </Box>
          
          {records.length > 0 ? (
            <TableContainer 
              sx={{ 
                flex: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#a8a8a8',
                  },
                },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        padding: '12px 16px'
                      }
                    }}
                  >
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Working Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {records.map((record, index) => {
                      const checkIn = new Date(record.check_in);
                      const checkOut = record.check_out ? new Date(record.check_out) : null;
                      const workingHours = checkOut ? 
                        ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(1) + 'h' : 
                        'In Progress';

                      return (
                        <motion.tr
                          key={record.attendance_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{
                            backgroundColor: 'rgba(0,0,0,0.02)',
                          }}
                          style={{ transition: 'all 0.3s ease' }}
                        >
                          <TableCell sx={{ fontWeight: '500' }}>{formatDate(record.date)}</TableCell>
                          <TableCell>{formatTime(record.check_in)}</TableCell>
                          <TableCell>{formatTime(record.check_out)}</TableCell>
                          <TableCell>{getStatusChip(record.status)}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{workingHours}</TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <EventAvailable sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" gutterBottom>
                No attendance records found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No attendance records available for the selected period.
              </Typography>
            </Box>
          )}
        </CardContent>
      </MotionPaper>
    </Box>
  );
};

export default Attendance;