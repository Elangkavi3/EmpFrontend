// // src/pages/Employee/EmployeeProjects.tsx
// // import React from 'react';

// // const EmployeeProjects: React.FC = () => {
// //   return (
// //     <div>
// //       <h1>My Projects</h1>
// //       <p>Project management content goes here...</p>
// //     </div>
// //   );
// // };

// // export default EmployeeProjects;

// import React, { useState, useEffect } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Button,
//   Grid,
//   CircularProgress,
//   FormHelperText,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { Visibility, Refresh, FilterAlt, Clear } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';

// interface ProjectAssignment {
//   assign_id: number;
//   name: string;
//   project_id: number;
// }

// interface EmployeeProjects {
//   assign_id: number;
//   project_name: string;
//   log_date: string;
//   start_time: string;
//   end_time: string;
//   total_hours: number;
//   progress_status: 'Assigned' | 'In Progress' | 'Completed';
//   task_description: string;
//   emp_id: number;
// }

// interface ProjectLog {
//   log_id: number;
//   assign_id: number;
//   log_date: string;
//   start_time: string;
//   end_time: string;
//   total_hours: number;
//   progress_status: 'Assigned' | 'In Progress' | 'Completed';
//   task_description: string;
//   emp_id: number;
//   project_name?: string;
// }

// const EmployeeProjects: React.FC = () => {
//   const { user } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors }
//   } = useForm<EmployeeProjects>();

//   const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
//   const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([]);
//   const [filteredLogs, setFilteredLogs] = useState<ProjectLog[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [logsLoading, setLogsLoading] = useState<boolean>(false);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [apiError, setApiError] = useState<string>('');
//   const [selectedLog, setSelectedLog] = useState<ProjectLog | null>(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  
//   // Date filter states
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const [dateFilterApplied, setDateFilterApplied] = useState<boolean>(false);

//   const watchStartTime = watch('start_time');
//   const watchEndTime = watch('end_time');
//   const watchAssignId = watch('assign_id');
//   const watchTaskDescription = watch('task_description');

//   // Get employee ID from auth context
//   useEffect(() => {
//     if (user?.emp_id) {
//       setValue('emp_id', user.emp_id);
//     }
//   }, [user, setValue]);

//   // Fetch project assignments and set current date on component mount
//   useEffect(() => {
//     const today = new Date();
//     const formattedDate = today.toISOString().split('T')[0];
//     setValue('log_date', formattedDate);
    
//     if (user?.emp_id) {
//       fetchAssignments();
//       fetchProjectLogs();
//     }
//   }, [setValue, user]);

//   // Apply date filter when logs or filter dates change
//   useEffect(() => {
//     if (startDate || endDate) {
//       applyDateFilter();
//     } else {
//       setFilteredLogs(projectLogs);
//       setDateFilterApplied(false);
//     }
//   }, [projectLogs, startDate, endDate]);

//   // Auto-fill project name when assignment ID changes
//   useEffect(() => {
//     if (watchAssignId) {
//       const selectedAssignment = assignments.find(
//         assignment => assignment.assign_id === Number(watchAssignId)
//       );
//       if (selectedAssignment) {
//         setValue('project_name', selectedAssignment.name);
//       } else {
//         setValue('project_name', '');
//       }
//     }
//   }, [watchAssignId, assignments, setValue]);

//   // Calculate total hours when start or end time changes
//   useEffect(() => {
//     if (watchStartTime && watchEndTime) {
//       const start = new Date(`1970-01-01T${watchStartTime}`);
//       const end = new Date(`1970-01-01T${watchEndTime}`);
      
//       if (end > start) {
//         const diffMs = end.getTime() - start.getTime();
//         const totalHours = diffMs / (1000 * 60 * 60);
//         setValue('total_hours', parseFloat(totalHours.toFixed(2)));
//       } else {
//         setValue('total_hours', 0);
//       }
//     }
//   }, [watchStartTime, watchEndTime, setValue]);

//   // Apply date filter to logs
//   const applyDateFilter = () => {
//     if (!startDate && !endDate) {
//       setFilteredLogs(projectLogs);
//       setDateFilterApplied(false);
//       return;
//     }

//     const filtered = projectLogs.filter(log => {
//       const logDate = new Date(log.log_date);
      
//       if (startDate && endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         return logDate >= start && logDate <= end;
//       } else if (startDate) {
//         const start = new Date(startDate);
//         return logDate >= start;
//       } else if (endDate) {
//         const end = new Date(endDate);
//         return logDate <= end;
//       }
      
//       return true;
//     });

//     setFilteredLogs(filtered);
//     setDateFilterApplied(true);
//   };

//   // Clear date filter
//   const clearDateFilter = () => {
//     setStartDate('');
//     setEndDate('');
//     setFilteredLogs(projectLogs);
//     setDateFilterApplied(false);
//   };

//   // API call to fetch project assignments
//   const fetchAssignments = async () => {
//     if (!user?.emp_id) return;

//     setLoading(true);
//     setApiError('');
//     try {
//       const response = await fetch(`http://localhost:5000/api/employee/projects?emp_id=${user.emp_id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         const result = await response.json();
//         if (result.success) {
//           setAssignments(result.data);
//         } else {
//           throw new Error(result.message);
//         }
//       } else {
//         throw new Error(`Server error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error fetching project assignments:', error);
//       setApiError('Failed to load project assignments');
//       setAssignments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // API call to fetch project logs
//   const fetchProjectLogs = async () => {
//     if (!user?.emp_id) return;

//     setLogsLoading(true);
//     try {
//       const response = await fetch(`http://localhost:5000/api/employee/project-logs?emp_id=${user.emp_id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (response.ok) {
//         const result = await response.json();
//         if (result.success) {
//           // Map assignment names to logs
//           const logsWithProjectNames = result.data.map((log: ProjectLog) => {
//             const assignment = assignments.find(a => a.assign_id === log.assign_id);
//             return {
//               ...log,
//               project_name: assignment?.name || `Assignment #${log.assign_id}`
//             };
//           });
//           setProjectLogs(logsWithProjectNames);
//           setFilteredLogs(logsWithProjectNames);
//         } else {
//           throw new Error(result.message);
//         }
//       } else {
//         throw new Error(`Server error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error fetching project logs:', error);
//       setProjectLogs([]);
//       setFilteredLogs([]);
//     } finally {
//       setLogsLoading(false);
//     }
//   };

//   // Refresh logs when assignments are loaded
//   useEffect(() => {
//     if (assignments.length > 0 && user?.emp_id) {
//       fetchProjectLogs();
//     }
//   }, [assignments]);

//   // API call to submit form data
//   const submitProjectLog = async (data: EmployeeProjects) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/employee/project-logs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         return result;
//       } else {
//         const error = await response.json();
//         throw new Error(error.message || 'Failed to save project log');
//       }
//     } catch (error) {
//       console.error('Error saving project log:', error);
//       throw error;
//     }
//   };

//   const onSubmit: SubmitHandler<EmployeeProjects> = async (data) => {
//     setSubmitting(true);
//     try {
//       await submitProjectLog(data);
//       alert('Project log saved successfully!');
//       resetForm();
//       // Refresh the logs list
//       fetchProjectLogs();
//     } catch (error) {
//       alert('Error saving project log. Please try again.');
//       console.error('Submission error:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     reset();
//     const today = new Date();
//     const formattedDate = today.toISOString().split('T')[0];
//     setValue('log_date', formattedDate);
    
//     if (user?.emp_id) {
//       setValue('emp_id', user.emp_id);
//     }
//   };

//   const handleReset = () => {
//     resetForm();
//   };

//   const handleViewDetails = (log: ProjectLog) => {
//     setSelectedLog(log);
//     setDetailDialogOpen(true);
//   };

//   const handleRefreshLogs = () => {
//     fetchProjectLogs();
//     clearDateFilter();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Completed': return 'success';
//       case 'In Progress': return 'warning';
//       case 'Assigned': return 'info';
//       default: return 'default';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString: string) => {
//     return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   // Progress status options
//   const progressStatusOptions = [
//     { value: 'Assigned', label: 'Assigned' },
//     { value: 'In Progress', label: 'In Progress' },
//     { value: 'Completed', label: 'Completed' }
//   ];

//   return (
//     <Box sx={{ 
//       minHeight: '100vh', 
//       bgcolor: 'grey.50', 
//       p: 3 
//     }}>
//       {/* New Project Log Form */}
//       <Card sx={{ 
//         width: '100%', 
//         maxWidth: '800px', 
//         borderRadius: 2, 
//         boxShadow: 3,
//         mb: 4,
//         mx: 'auto'
//       }}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography 
//             variant="h4" 
//             component="h2" 
//             gutterBottom 
//             align="center" 
//             fontWeight="bold" 
//             color="text.primary"
//           >
//             New Project Log Entry
//           </Typography>

//           {apiError && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {apiError}
//             </Alert>
//           )}
          
//           <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
//             <Grid container spacing={3}>
//               {/* Form fields remain the same */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <FormControl fullWidth error={!!errors.assign_id}>
//                   <InputLabel id="assign-id-label">Project Assignment *</InputLabel>
//                   <Select
//                     labelId="assign-id-label"
//                     label="Project Assignment *"
//                     {...register('assign_id', { 
//                       required: 'Project assignment is required',
//                       valueAsNumber: true
//                     })}
//                     disabled={loading}
//                   >
//                     <MenuItem value="">Select Project Assignment</MenuItem>
//                     {assignments.map((assignment) => (
//                       <MenuItem key={assignment.assign_id} value={assignment.assign_id}>
//                         {assignment.name} 
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {loading && (
//                     <FormHelperText sx={{ color: 'blue.600' }}>
//                       <CircularProgress size={12} sx={{ mr: 1 }} />
//                       Loading assignments...
//                     </FormHelperText>
//                   )}
//                   {errors.assign_id && (
//                     <FormHelperText>{errors.assign_id.message}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Log Date *"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                   {...register('log_date', { required: 'Log date is required' })}
//                   error={!!errors.log_date}
//                   helperText={errors.log_date?.message}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Start Time *"
//                   type="time"
//                   InputLabelProps={{ shrink: true }}
//                   {...register('start_time', { required: 'Start time is required' })}
//                   error={!!errors.start_time}
//                   helperText={errors.start_time?.message}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="End Time *"
//                   type="time"
//                   InputLabelProps={{ shrink: true }}
//                   {...register('end_time', { required: 'End time is required' })}
//                   error={!!errors.end_time}
//                   helperText={errors.end_time?.message}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   fullWidth
//                   label="Total Hours *"
//                   type="number"
//                   InputLabelProps={{ shrink: true }}
//                   inputProps={{ 
//                     step: "0.01",
//                     readOnly: true 
//                   }}
//                   {...register('total_hours', { 
//                     required: 'Total hours is required',
//                     valueAsNumber: true,
//                     min: { value: 0, message: 'Total hours cannot be negative' }
//                   })}
//                   error={!!errors.total_hours}
//                   helperText={errors.total_hours?.message}
//                   sx={{ 
//                     '& .MuiInputBase-input': {
//                       backgroundColor: 'grey.50',
//                       color: 'text.primary'
//                     }
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <FormControl fullWidth error={!!errors.progress_status}>
//                   <InputLabel id="progress-status-label">Progress Status *</InputLabel>
//                   <Select
//                     labelId="progress-status-label"
//                     label="Progress Status *"
//                     {...register('progress_status', { 
//                       required: 'Progress status is required'
//                     })}
//                   >
//                     <MenuItem value="">Select Progress Status</MenuItem>
//                     {progressStatusOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.progress_status && (
//                     <FormHelperText>{errors.progress_status.message}</FormHelperText>
//                   )}
//                 </FormControl>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   label="Task Description"
//                   {...register('task_description', { 
//                     maxLength: { 
//                       value: 255, 
//                       message: 'Task description must be 255 characters or less' 
//                     }
//                   })}
//                   error={!!errors.task_description}
//                   helperText={
//                     errors.task_description?.message || 
//                     `${watchTaskDescription?.length || 0}/255`
//                   }
//                   placeholder="Describe the tasks completed during this time period..."
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
//                   <Button
//                     type="submit"
//                     disabled={submitting || !user?.emp_id || assignments.length === 0}
//                     variant="contained"
//                     size="large"
//                     fullWidth
//                     startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
//                   >
//                     {submitting ? 'Submitting...' : 'Submit Log Entry'}
//                   </Button>
//                   <Button
//                     type="button"
//                     onClick={handleReset}
//                     disabled={submitting}
//                     variant="outlined"
//                     size="large"
//                     fullWidth
//                   >
//                     Reset Form
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Project Logs List */}
//       <Card sx={{ 
//         width: '100%', 
//         borderRadius: 2, 
//         boxShadow: 3,
//         mx: 'auto'
//       }}>
//         <CardContent sx={{ p: 4 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//             <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary">
//               My Project Logs ({dateFilterApplied ? filteredLogs.length : projectLogs.length})
//               {dateFilterApplied && (
//                 <Chip 
//                   label="Filtered" 
//                   color="primary" 
//                   size="small" 
//                   sx={{ ml: 1 }} 
//                 />
//               )}
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//               <Button
//                 startIcon={<Refresh />}
//                 onClick={handleRefreshLogs}
//                 disabled={logsLoading}
//                 variant="outlined"
//               >
//                 {logsLoading ? <CircularProgress size={20} /> : 'Refresh'}
//               </Button>
//             </Box>
//           </Box>

//           {/* Date Filter Section */}
//           <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
//             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//               <FilterAlt sx={{ mr: 1 }} /> Filter by Date
//             </Typography>
//             <Grid container spacing={2} alignItems="center">
//               <Grid size={{ xs: 12, md: 3 }}>
//                 <TextField
//                   fullWidth
//                   label="Start Date"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, md: 3 }}>
//                 <TextField
//                   fullWidth
//                   label="End Date"
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Box sx={{ display: 'flex', gap: 1 }}>
//                   <Button
//                     variant="contained"
//                     onClick={applyDateFilter}
//                     disabled={!startDate && !endDate}
//                     startIcon={<FilterAlt />}
//                   >
//                     Apply Filter
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     onClick={clearDateFilter}
//                     disabled={!startDate && !endDate}
//                     startIcon={<Clear />}
//                   >
//                     Clear
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//             {(startDate || endDate) && (
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Showing logs from {startDate || 'beginning'} to {endDate || 'today'}
//               </Typography>
//             )}
//           </Card>

//           {logsLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : filteredLogs.length === 0 ? (
//             <Alert severity={dateFilterApplied ? "warning" : "info"}>
//               {dateFilterApplied 
//                 ? "No project logs found for the selected date range." 
//                 : "No project logs found. Create your first log above!"
//               }
//             </Alert>
//           ) : (
//             <TableContainer component={Paper} elevation={0}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell><strong>Date</strong></TableCell>
//                     <TableCell><strong>Project</strong></TableCell>
//                     <TableCell><strong>Time</strong></TableCell>
//                     <TableCell><strong>Hours</strong></TableCell>
//                     <TableCell><strong>Status</strong></TableCell>
//                     <TableCell><strong>Actions</strong></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredLogs.map((log) => (
//                     <TableRow key={log.log_id} hover>
//                       <TableCell>{formatDate(log.log_date)}</TableCell>
//                       <TableCell>{log.project_name}</TableCell>
//                       <TableCell>
//                         {formatTime(log.start_time)} - {formatTime(log.end_time)}
//                       </TableCell>
//                       <TableCell>
//                         <Typography fontWeight="bold" color="primary.main">
//                           {log.total_hours}h
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={log.progress_status} 
//                           color={getStatusColor(log.progress_status) as any}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleViewDetails(log)}
//                           color="primary"
//                           size="small"
//                         >
//                           <Visibility />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </CardContent>
//       </Card>

//       {/* Log Details Dialog */}
//       <Dialog 
//         open={detailDialogOpen} 
//         onClose={() => setDetailDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           Project Log Details
//         </DialogTitle>
//         <DialogContent>
//           {selectedLog && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Date</Typography>
//                 <Typography variant="body1">{formatDate(selectedLog.log_date)}</Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Project</Typography>
//                 <Typography variant="body1">{selectedLog.project_name}</Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Time</Typography>
//                 <Typography variant="body1">
//                   {formatTime(selectedLog.start_time)} - {formatTime(selectedLog.end_time)}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Total Hours</Typography>
//                 <Typography variant="body1" fontWeight="bold">{selectedLog.total_hours}h</Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Status</Typography>
//                 <Chip 
//                   label={selectedLog.progress_status} 
//                   color={getStatusColor(selectedLog.progress_status) as any}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Assignment ID</Typography>
//                 <Typography variant="body1">#{selectedLog.assign_id}</Typography>
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <Typography variant="subtitle2" color="text.secondary">Task Description</Typography>
//                 <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//                   {selectedLog.task_description || 'No description provided'}
//                 </Typography>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EmployeeProjects;


// src/pages/Employee/EmployeeProjects.tsx
import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem, Select, FormControl,
  InputLabel, Button, Grid, CircularProgress, FormHelperText, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, useMediaQuery, Fade, Collapse
} from '@mui/material';
import { Visibility, Refresh, FilterAlt, Clear, Add, Work } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

interface ProjectAssignment {
  assign_id: number;
  name: string;
  project_id: number;
}

interface EmployeeProjects {
  assign_id: number;
  project_name: string;
  log_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  progress_status: 'Assigned' | 'In Progress' | 'Completed';
  task_description: string;
  emp_id: number;
}

interface ProjectLog {
  log_id: number;
  assign_id: number;
  log_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  progress_status: 'Assigned' | 'In Progress' | 'Completed';
  task_description: string;
  emp_id: number;
  project_name?: string;
}

const EmployeeProjects: React.FC = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<EmployeeProjects>();

  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ProjectLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<ProjectLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  
  // Date filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateFilterApplied, setDateFilterApplied] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const watchStartTime = watch('start_time');
  const watchEndTime = watch('end_time');
  const watchAssignId = watch('assign_id');
  const watchTaskDescription = watch('task_description');

  // Get employee ID from auth context
  useEffect(() => {
    if (user?.emp_id) {
      setValue('emp_id', user.emp_id);
    }
  }, [user, setValue]);

  // Fetch project assignments and set current date on component mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setValue('log_date', formattedDate);
    
    if (user?.emp_id) {
      fetchAssignments();
      fetchProjectLogs();
    }
  }, [setValue, user]);

  // Apply date filter when logs or filter dates change
  useEffect(() => {
    if (startDate || endDate) {
      applyDateFilter();
    } else {
      setFilteredLogs(projectLogs);
      setDateFilterApplied(false);
    }
  }, [projectLogs, startDate, endDate]);

  // Auto-fill project name when assignment ID changes
  useEffect(() => {
    if (watchAssignId) {
      const selectedAssignment = assignments.find(
        assignment => assignment.assign_id === Number(watchAssignId)
      );
      if (selectedAssignment) {
        setValue('project_name', selectedAssignment.name);
      } else {
        setValue('project_name', '');
      }
    }
  }, [watchAssignId, assignments, setValue]);

  // Calculate total hours when start or end time changes
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const start = new Date(`1970-01-01T${watchStartTime}`);
      const end = new Date(`1970-01-01T${watchEndTime}`);
      
      if (end > start) {
        const diffMs = end.getTime() - start.getTime();
        const totalHours = diffMs / (1000 * 60 * 60);
        setValue('total_hours', parseFloat(totalHours.toFixed(2)));
      } else {
        setValue('total_hours', 0);
      }
    }
  }, [watchStartTime, watchEndTime, setValue]);

  // Apply date filter to logs
  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredLogs(projectLogs);
      setDateFilterApplied(false);
      return;
    }

    const filtered = projectLogs.filter(log => {
      const logDate = new Date(log.log_date);
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return logDate >= start && logDate <= end;
      } else if (startDate) {
        const start = new Date(startDate);
        return logDate >= start;
      } else if (endDate) {
        const end = new Date(endDate);
        return logDate <= end;
      }
      
      return true;
    });

    setFilteredLogs(filtered);
    setDateFilterApplied(true);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredLogs(projectLogs);
    setDateFilterApplied(false);
    setSuccessMessage('Filters cleared successfully');
  };

  // API call to fetch project assignments
  const fetchAssignments = async () => {
    if (!user?.emp_id) return;

    setLoading(true);
    setApiError('');
    try {
      const response = await fetch(`http://localhost:5000/api/employee/projects?emp_id=${user.emp_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAssignments(result.data);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching project assignments:', error);
      setApiError('Failed to load project assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // API call to fetch project logs
  const fetchProjectLogs = async () => {
    if (!user?.emp_id) return;

    setLogsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/employee/project-logs?emp_id=${user.emp_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Map assignment names to logs
          const logsWithProjectNames = result.data.map((log: ProjectLog) => {
            const assignment = assignments.find(a => a.assign_id === log.assign_id);
            return {
              ...log,
              project_name: assignment?.name || `Assignment #${log.assign_id}`
            };
          });
          setProjectLogs(logsWithProjectNames);
          setFilteredLogs(logsWithProjectNames);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching project logs:', error);
      setProjectLogs([]);
      setFilteredLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  // Refresh logs when assignments are loaded
  useEffect(() => {
    if (assignments.length > 0 && user?.emp_id) {
      fetchProjectLogs();
    }
  }, [assignments]);

  // API call to submit form data
  const submitProjectLog = async (data: EmployeeProjects) => {
    try {
      const response = await fetch('http://localhost:5000/api/employee/project-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save project log');
      }
    } catch (error) {
      console.error('Error saving project log:', error);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<EmployeeProjects> = async (data) => {
    setSubmitting(true);
    setApiError('');
    try {
      await submitProjectLog(data);
      setSuccessMessage('Project log saved successfully!');
      resetForm();
      // Refresh the logs list
      fetchProjectLogs();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setApiError('Error saving project log. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setValue('log_date', formattedDate);
    
    if (user?.emp_id) {
      setValue('emp_id', user.emp_id);
    }
  };

  const handleReset = () => {
    resetForm();
    setSuccessMessage('Form reset successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewDetails = (log: ProjectLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  const handleRefreshLogs = () => {
    fetchProjectLogs();
    clearDateFilter();
    setSuccessMessage('Project logs refreshed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Assigned': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Progress status options
  const progressStatusOptions = [
    { value: 'Assigned', label: 'Assigned' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ];

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
              Project Management
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Track your project hours and progress
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <MotionButton
              variant="outlined"
              startIcon={<FilterAlt />}
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
              onClick={handleRefreshLogs}
              disabled={logsLoading}
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
              {logsLoading ? 'Refreshing...' : 'Refresh'}
            </MotionButton>
          </Box>
        </Box>
      </MotionPaper>

      {/* Alerts Section */}
      <Box sx={{ flexShrink: 0, mb: 3 }}>
        {apiError && (
          <Fade in>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                animation: apiError ? 'shake 0.5s ease-in-out' : 'none',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' },
                }
              }}
              onClose={() => setApiError('')}
            >
              {apiError}
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
              <FilterAlt color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Filter Project Logs
              </Typography>
            </Box>
            <Chip
              label={`${filteredLogs.length} records`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                <MotionButton
                  variant="contained"
                  startIcon={<FilterAlt />}
                  onClick={applyDateFilter}
                  disabled={!startDate && !endDate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    flex: 1
                  }}
                >
                  Apply Filter
                </MotionButton>
                <MotionButton
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearDateFilter}
                  disabled={!startDate && !endDate}
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
          {(startDate || endDate) && (
            <Fade in>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Active Filters:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {startDate && (
                    <Chip
                      label={`From: ${startDate}`}
                      size="small"
                      onDelete={() => setStartDate('')}
                      color="primary"
                    />
                  )}
                  {endDate && (
                    <Chip
                      label={`To: ${endDate}`}
                      size="small"
                      onDelete={() => setEndDate('')}
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
            </Fade>
          )}
        </MotionPaper>
      </Collapse>

      {/* New Project Log Form */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.95)',
          mb: 4
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Add color="primary" sx={{ mr: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              New Project Log Entry
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.assign_id} size="small">
                  <InputLabel id="assign-id-label">Project Assignment *</InputLabel>
                  <Select
                    labelId="assign-id-label"
                    label="Project Assignment *"
                    {...register('assign_id', { 
                      required: 'Project assignment is required',
                      valueAsNumber: true
                    })}
                    disabled={loading}
                  >
                    <MenuItem value="">Select Project Assignment</MenuItem>
                    {assignments.map((assignment) => (
                      <MenuItem key={assignment.assign_id} value={assignment.assign_id}>
                        {assignment.name} 
                      </MenuItem>
                    ))}
                  </Select>
                  {loading && (
                    <FormHelperText sx={{ color: 'blue.600' }}>
                      <CircularProgress size={12} sx={{ mr: 1 }} />
                      Loading assignments...
                    </FormHelperText>
                  )}
                  {errors.assign_id && (
                    <FormHelperText>{errors.assign_id.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Log Date *"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('log_date', { required: 'Log date is required' })}
                  error={!!errors.log_date}
                  helperText={errors.log_date?.message}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Start Time *"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  {...register('start_time', { required: 'Start time is required' })}
                  error={!!errors.start_time}
                  helperText={errors.start_time?.message}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="End Time *"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  {...register('end_time', { required: 'End time is required' })}
                  error={!!errors.end_time}
                  helperText={errors.end_time?.message}
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Total Hours *"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 
                    step: "0.01",
                    readOnly: true 
                  }}
                  {...register('total_hours', { 
                    required: 'Total hours is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Total hours cannot be negative' }
                  })}
                  error={!!errors.total_hours}
                  helperText={errors.total_hours?.message}
                  size="small"
                  sx={{ 
                    '& .MuiInputBase-input': {
                      backgroundColor: 'grey.50',
                      color: 'text.primary'
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.progress_status} size="small">
                  <InputLabel id="progress-status-label">Progress Status *</InputLabel>
                  <Select
                    labelId="progress-status-label"
                    label="Progress Status *"
                    {...register('progress_status', { 
                      required: 'Progress status is required'
                    })}
                  >
                    <MenuItem value="">Select Progress Status</MenuItem>
                    {progressStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.progress_status && (
                    <FormHelperText>{errors.progress_status.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Task Description"
                  {...register('task_description', { 
                    maxLength: { 
                      value: 255, 
                      message: 'Task description must be 255 characters or less' 
                    }
                  })}
                  error={!!errors.task_description}
                  helperText={
                    errors.task_description?.message || 
                    `${watchTaskDescription?.length || 0}/255`
                  }
                  placeholder="Describe the tasks completed during this time period..."
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                  <MotionButton
                    type="submit"
                    disabled={submitting || !user?.emp_id || assignments.length === 0}
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Add />}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Log Entry'}
                  </MotionButton>
                  <MotionButton
                    type="button"
                    onClick={handleReset}
                    disabled={submitting}
                    variant="outlined"
                    size="large"
                    fullWidth
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                  >
                    Reset Form
                  </MotionButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </MotionCard>

      {/* Project Logs List */}
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
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Work color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                My Project Logs ({dateFilterApplied ? filteredLogs.length : projectLogs.length})
              </Typography>
              {dateFilterApplied && (
                <Chip 
                  label="Filtered" 
                  color="primary" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </Box>

          {logsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5, flex: 1 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : filteredLogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Work sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" gutterBottom>
                No project logs found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {dateFilterApplied 
                  ? "No project logs found for the selected date range." 
                  : "No project logs found. Create your first log above!"
                }
              </Typography>
            </Box>
          ) : (
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
                    <TableCell>Project</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {filteredLogs.map((log, index) => (
                      <motion.tr
                        key={log.log_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          backgroundColor: 'rgba(0,0,0,0.02)',
                        }}
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <TableCell>{formatDate(log.log_date)}</TableCell>
                        <TableCell sx={{ fontWeight: '500' }}>{log.project_name}</TableCell>
                        <TableCell>
                          {formatTime(log.start_time)} - {formatTime(log.end_time)}
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold" color="primary.main">
                            {log.total_hours}h
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={log.progress_status} 
                            color={getStatusColor(log.progress_status) as any}
                            size="small"
                            sx={{ fontWeight: 'bold', borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewDetails(log)}
                            color="primary"
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(33,150,243,0.1)',
                              '&:hover': { backgroundColor: 'rgba(33,150,243,0.2)' }
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </MotionPaper>

      {/* Log Details Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
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
            <Visibility />
            Project Log Details
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedLog && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Date
                    </Typography>
                    <Typography variant="body1">{formatDate(selectedLog.log_date)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(118,75,162,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Project
                    </Typography>
                    <Typography variant="body1">{selectedLog.project_name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Time
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(selectedLog.start_time)} - {formatTime(selectedLog.end_time)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Total Hours
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                      {selectedLog.total_hours}h
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(255,152,0,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={selectedLog.progress_status} 
                      color={getStatusColor(selectedLog.progress_status) as any}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(156,39,176,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Assignment ID
                    </Typography>
                    <Typography variant="body1">#{selectedLog.assign_id}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Task Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {selectedLog.task_description || 'No description provided'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDetailDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeProjects;