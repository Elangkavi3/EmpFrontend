// // src/pages/Employee/EmployeeLeaves.tsx
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
//   Grid, // ✅ Using MUI v6 Grid2 API
//   Card,
//   CardContent,
//   Alert,
//   CircularProgress,
//   Snackbar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Description,
//   CheckCircle,
//   Cancel,
//   Pending,
//   Event,
// } from '@mui/icons-material';
// import { employeeAPI } from '../../types/api';

// interface LeaveRecord {
//   leave_id: number;
//   emp_id: number;
//   start_date: string;
//   end_date: string;
//   type: string;
//   reason: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
// }

// interface LeaveApplication {
//   start_date: string;
//   end_date: string;
//   type: string;
//   reason: string;
// }

// const EmployeeLeaves: React.FC = () => {
//   const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showLeaveForm, setShowLeaveForm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [leaveApplication, setLeaveApplication] = useState<LeaveApplication>({
//     start_date: '',
//     end_date: '',
//     type: '',
//     reason: '',
//   });

//   useEffect(() => {
//     fetchLeaveRecords();
//   }, []);

//   const fetchLeaveRecords = async () => {
//     try {
//       setLoading(true);
//       const response = await employeeAPI.getLeaves();
//       setLeaves(response?.data?.leaves || []);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to fetch leave records');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLeaveSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
      
//       setError('');

//       const start = new Date(leaveApplication.start_date);
//       const end = new Date(leaveApplication.end_date);
//       if (end < start) {
//         setError('End date cannot be before start date');
//         return;
//       }
      
//       await employeeAPI.applyLeave(leaveApplication);
      
//       setSuccessMessage('Leave application submitted successfully!');
//       setShowLeaveForm(false);
//       setLeaveApplication({ start_date: '', end_date: '', type: '', reason: '' });
//       fetchLeaveRecords();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to submit leave');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setLeaveApplication((prev) => ({ ...prev, [field]: value }));
//   };

//   const calculateLeaveStats = () => {
//     const totalLeaves = 24;
//     const usedLeaves = leaves
//       .filter((l) => l.status === 'APPROVED')
//       .reduce((sum, l) => {
//         const days =
//           Math.ceil(
//             (new Date(l.end_date).getTime() - new Date(l.start_date).getTime()) /
//               (1000 * 60 * 60 * 24)
//           ) + 1;
//         return sum + days;
//       }, 0);

//     const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
//     const rejectedLeaves = leaves.filter((l) => l.status === 'REJECTED').length;

//     return {
//       totalLeaves,
//       usedLeaves,
//       remainingLeaves: totalLeaves - usedLeaves,
//       pendingLeaves,
//       rejectedLeaves,
//     };
//   };

//   const leaveStats = calculateLeaveStats();

//   const getStatusChip = (status: string) => {
//     const config: Record<string, any> = {
//       APPROVED: { color: 'success', label: 'Approved', icon: <CheckCircle fontSize="small" /> },
//       PENDING: { color: 'warning', label: 'Pending', icon: <Pending fontSize="small" /> },
//       REJECTED: { color: 'error', label: 'Rejected', icon: <Cancel fontSize="small" /> },
//     };
//     const cfg = config[status] || { color: 'default', label: status };
//     return <Chip {...cfg} size="small" />;
//   };

//   const formatDate = (d: string) =>
//     new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

//   const calculateDuration = (start: string, end: string) => {
//     const days =
//       Math.ceil(
//         (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
//       ) + 1;
//     return `${days} day${days > 1 ? 's' : ''}`;
//   };

//   const handleCloseSnackbar = () => {
//     setSuccessMessage('');
//     setError('');
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" fontWeight="bold">
//           Leave Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setShowLeaveForm(true)}
//         >
//           Apply Leave
//         </Button>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={handleCloseSnackbar}>
//           {error}
//         </Alert>
//       )}

//       <Snackbar
//         open={!!successMessage}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         message={successMessage}
//       />

//       {/* Leave Stat Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {[
//           {
//             label: 'Total Leave',
//             value: leaveStats.totalLeaves,
//             color: 'linear-gradient(135deg, #667eea, #764ba2)',
//             icon: <Description sx={{ fontSize: 40 }} />,
//           },
//           {
//             label: 'Used Leave',
//             value: leaveStats.usedLeaves,
//             color: 'linear-gradient(135deg, #f093fb, #f5576c)',
//             icon: <Cancel sx={{ fontSize: 40 }} />,
//           },
//           {
//             label: 'Remaining',
//             value: leaveStats.remainingLeaves,
//             color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
//             icon: <CheckCircle sx={{ fontSize: 40 }} />,
//           },
//           {
//             label: 'Pending',
//             value: leaveStats.pendingLeaves,
//             color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
//             icon: <Pending sx={{ fontSize: 40 }} />,
//           },
//         ].map((stat, i) => (
//           <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
//             <Card
//               sx={{
//                 background: stat.color,
//                 color: 'white',
//                 borderRadius: 2,
//                 boxShadow: 3,
//               }}
//             >
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Box>
//                     <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                       {stat.label}
//                     </Typography>
//                     <Typography variant="h3" fontWeight="bold">
//                       {stat.value}
//                     </Typography>
//                   </Box>
//                   {stat.icon}
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Leave Application Dialog */}
//       <Dialog open={showLeaveForm} onClose={() => setShowLeaveForm(false)} fullWidth maxWidth="md">
//         <DialogTitle>
//           <Typography variant="h5" fontWeight="bold">
//             Apply for Leave
//           </Typography>
//         </DialogTitle>
//         <form onSubmit={handleLeaveSubmit}>
//           <DialogContent>
//             <Grid container spacing={3}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <FormControl fullWidth required>
//                   <InputLabel>Leave Type</InputLabel>
//                   <Select
//                     value={leaveApplication.type}
//                     label="Leave Type"
//                     onChange={(e) => handleInputChange('type', e.target.value)}
//                   >
//                     {[
//                       'Sick Leave',
//                       'Casual Leave',
//                       'Paid Leave',
//                       'Emergency Leave',
//                       'Maternity Leave',
//                       'Paternity Leave',
//                     ].map((type) => (
//                       <MenuItem key={type} value={type}>
//                         {type}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Start Date"
//                   type="date"
//                   value={leaveApplication.start_date}
//                   onChange={(e) => handleInputChange('start_date', e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   required
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="End Date"
//                   type="date"
//                   value={leaveApplication.end_date}
//                   onChange={(e) => handleInputChange('end_date', e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                   required
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
//                   <Event color="primary" />
//                   <Typography variant="body2" color="text.secondary">
//                     {leaveApplication.start_date && leaveApplication.end_date
//                       ? `Duration: ${calculateDuration(leaveApplication.start_date, leaveApplication.end_date)}`
//                       : 'Select dates to see duration'}
//                   </Typography>
//                 </Box>
//               </Grid>
//               {/* <Grid size={{ xs: 12 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   label="Reason"
//                   value={leaveApplication.reason}
//                   onChange={(e) => handleInputChange('reason', e.target.value)}
//                   placeholder="Please provide a reason for your leave..."
//                   required
//                 />
//               </Grid> */}
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 3 }}>
//             <Button onClick={() => setShowLeaveForm(false)} disabled={submitting}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={submitting}
//               startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
//             >
//               {submitting ? 'Submitting...' : 'Submit'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Leave History Table */}
//       <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
//         <CardContent>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Leave History
//           </Typography>
//           {leaves.length > 0 ? (
//             <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//               <Table>
//                 <TableHead sx={{ backgroundColor: 'grey.50' }}>
//                   <TableRow>
//                     {[
//                       'Leave Type',
//                       'Start Date',
//                       'End Date',
//                       'Duration',
//                       // 'Reason',
//                       'Status',
//                     ].map((head) => (
//                       <TableCell key={head} sx={{ fontWeight: 'bold' }}>
//                         {head}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {leaves.map((leave) => (
//                     <TableRow
//                       key={leave.leave_id}
//                       sx={{
//                         '&:hover': { backgroundColor: 'grey.50' },
//                         '&:last-child td': { border: 0 },
//                       }}
//                     >
//                       <TableCell>{leave.type}</TableCell>
//                       <TableCell>{formatDate(leave.start_date)}</TableCell>
//                       <TableCell>{formatDate(leave.end_date)}</TableCell>
//                       <TableCell>{calculateDuration(leave.start_date, leave.end_date)}</TableCell>
//                       {/* <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                         {leave.reason}
//                       </TableCell> */}
//                       <TableCell>{getStatusChip(leave.status)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Box sx={{ textAlign: 'center', py: 6 }}>
//               <Description sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 No Leave Records Found
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                 You haven’t applied for any leaves yet.
//               </Typography>
//               <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowLeaveForm(true)}>
//                 Apply for Your First Leave
//               </Button>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default EmployeeLeaves;


// src/pages/Employee/EmployeeLeaves.tsx
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
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Description,
  CheckCircle,
  Cancel,
  Pending,
  Event,
  FilterList,
  Clear,
  Check,
  Work
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeAPI } from '../../types/api';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

interface LeaveRecord {
  leave_id: number;
  emp_id: number;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface LeaveApplication {
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
}

const EmployeeLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [leaveApplication, setLeaveApplication] = useState<LeaveApplication>({
    start_date: '',
    end_date: '',
    type: '',
    reason: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchLeaveRecords();
  }, []);

  const fetchLeaveRecords = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getLeaves();
      setLeaves(response?.data?.leaves || []);
      setSuccessMessage('Leave records loaded successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const start = new Date(leaveApplication.start_date);
      const end = new Date(leaveApplication.end_date);
      if (end < start) {
        setError('End date cannot be before start date');
        return;
      }
      
      await employeeAPI.applyLeave(leaveApplication);
      
      setSuccessMessage('Leave application submitted successfully!');
      setShowLeaveForm(false);
      setLeaveApplication({ start_date: '', end_date: '', type: '', reason: '' });
      fetchLeaveRecords();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLeaveApplication((prev) => ({ ...prev, [field]: value }));
  };

  const calculateLeaveStats = () => {
    const totalLeaves = 24;
    const usedLeaves = leaves
      .filter((l) => l.status === 'APPROVED')
      .reduce((sum, l) => {
        const days =
          Math.ceil(
            (new Date(l.end_date).getTime() - new Date(l.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        return sum + days;
      }, 0);

    const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
    const rejectedLeaves = leaves.filter((l) => l.status === 'REJECTED').length;

    return {
      totalLeaves,
      usedLeaves,
      remainingLeaves: totalLeaves - usedLeaves,
      pendingLeaves,
      rejectedLeaves,
    };
  };

  const leaveStats = calculateLeaveStats();

  const getStatusChip = (status: string) => {
    const config: Record<string, any> = {
      APPROVED: { color: 'success', label: 'Approved', icon: <CheckCircle fontSize="small" /> },
      PENDING: { color: 'warning', label: 'Pending', icon: <Pending fontSize="small" /> },
      REJECTED: { color: 'error', label: 'Rejected', icon: <Cancel fontSize="small" /> },
    };
    const cfg = config[status] || { color: 'default', label: status };
    return <Chip {...cfg} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const calculateDuration = (start: string, end: string) => {
    const days =
      Math.ceil(
        (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setError('');
  };

  const clearFilters = () => {
    setStatusFilter('');
    setSuccessMessage('Filters cleared successfully');
  };

  const filteredLeaves = leaves.filter(leave => 
    !statusFilter || leave.status === statusFilter
  );

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
              Leave Management
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage your leave applications and track balances
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
              startIcon={<AddIcon />}
              onClick={() => setShowLeaveForm(true)}
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
              Apply Leave
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
              onClose={handleCloseSnackbar}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {successMessage && (
          <Fade in>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={handleCloseSnackbar}>
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
                Filter Leaves
              </Typography>
            </Box>
            <Chip
              label={`${filteredLeaves.length} records`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                <MotionButton
                  variant="contained"
                  startIcon={<Check />}
                  onClick={() => setSuccessMessage('Filters applied successfully')}
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

          {/* Active Filters Display */}
          {statusFilter && (
            <Fade in>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Active Filters:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Status: ${statusFilter}`}
                    size="small"
                    onDelete={() => setStatusFilter('')}
                    color="primary"
                  />
                </Box>
              </Box>
            </Fade>
          )}
        </MotionPaper>
      </Collapse>

      {/* Leave Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: 'Total Leave',
            value: leaveStats.totalLeaves,
            color: 'primary' as const,
            icon: <Description sx={{ fontSize: 40 }} />,
            description: 'Annual leave balance'
          },
          {
            label: 'Used Leave',
            value: leaveStats.usedLeaves,
            color: 'error' as const,
            icon: <Cancel sx={{ fontSize: 40 }} />,
            description: 'Leaves taken this year'
          },
          {
            label: 'Remaining',
            value: leaveStats.remainingLeaves,
            color: 'success' as const,
            icon: <CheckCircle sx={{ fontSize: 40 }} />,
            description: 'Available leaves'
          },
          {
            label: 'Pending',
            value: leaveStats.pendingLeaves,
            color: 'warning' as const,
            icon: <Pending sx={{ fontSize: 40 }} />,
            description: 'Awaiting approval'
          },
        ].map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
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
                  {stat.icon}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Leave History Table */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Work color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Leave History ({filteredLeaves.length})
              </Typography>
              {statusFilter && (
                <Chip 
                  label={`Filtered: ${statusFilter}`} 
                  color="primary" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </Box>

          {filteredLeaves.length > 0 ? (
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
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredLeaves.map((leave, index) => (
                      <motion.tr
                        key={leave.leave_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          backgroundColor: 'rgba(0,0,0,0.02)',
                        }}
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <TableCell sx={{ fontWeight: '500' }}>{leave.type}</TableCell>
                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                        <TableCell>{calculateDuration(leave.start_date, leave.end_date)}</TableCell>
                        <TableCell>{getStatusChip(leave.status)}</TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Description sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" gutterBottom>
                No Leave Records Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {statusFilter 
                  ? "No leaves found matching your filters." 
                  : "You haven't applied for any leaves yet."
                }
              </Typography>
              <MotionButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowLeaveForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{ mt: 1 }}
              >
                Apply for Leave
              </MotionButton>
            </Box>
          )}
        </CardContent>
      </MotionPaper>

      {/* Leave Application Dialog */}
      <Dialog 
        open={showLeaveForm} 
        onClose={() => setShowLeaveForm(false)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            Apply for Leave
          </Box>
        </DialogTitle>
        <form onSubmit={handleLeaveSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={leaveApplication.type}
                    label="Leave Type"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    {[
                      'Sick Leave',
                      'Casual Leave',
                      'Paid Leave',
                      'Emergency Leave',
                      'Maternity Leave',
                      'Paternity Leave',
                    ].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={leaveApplication.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={leaveApplication.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Event color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    {leaveApplication.start_date && leaveApplication.end_date
                      ? `Duration: ${calculateDuration(leaveApplication.start_date, leaveApplication.end_date)}`
                      : 'Select dates to see duration'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button 
              onClick={() => setShowLeaveForm(false)} 
              disabled={submitting}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <MotionButton
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </MotionButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EmployeeLeaves;