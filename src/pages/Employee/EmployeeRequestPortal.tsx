// // src/pages/Employee/EmployeeRequestPortal.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Card,
//   CardContent,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Tab,
//   Tabs,
//   Checkbox,
//   FormControlLabel,
//   Divider,
//   Stack,
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Error as ErrorIcon,
//   Help as HelpIcon,
//   Schedule as ScheduleIcon,
//   Message as MessageIcon,
//   History as HistoryIcon,
//   Refresh as RefreshIcon,
//   DoneAll as DoneAllIcon,
//   Close as CloseIcon,
// } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';

// interface Request {
//   request_id: number;
//   category: string;
//   description: string;
//   status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
//   response: string | null;
//   hr_handler_id: number | null;
// }

// interface ResponseHistoryItem {
//   type: string;
//   timestamp: string;
//   message: string;
//   id: number;
// }

// const EmployeeRequestPortal: React.FC = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
//   const [feedbackOpen, setFeedbackOpen] = useState(false);
  
//   const [feedbackForm, setFeedbackForm] = useState({
//     feedback_message: '',
//     is_resolved: false
//   });

//   const [requestForm, setRequestForm] = useState({
//     category: 'IT Support',
//     description: ''
//   });

//   useEffect(() => {
//     if (activeTab === 1) {
//       fetchRequestHistory();
//     }
//   }, [activeTab]);

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setRequestForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (e: any) => {
//     setRequestForm(prev => ({ ...prev, category: e.target.value }));
//   };

//   const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFeedbackForm(prev => ({ 
//       ...prev, 
//       [name]: type === 'checkbox' ? checked : value 
//     }));
//   };

//   const submitRequest = async () => {
//     if (!requestForm.category || !requestForm.description.trim()) {
//       setErrorMessage('Please fill in all required fields');
//       return;
//     }

//     setLoading(true);
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       const response = await fetch(`http://localhost:5000/api/employee/requests`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(requestForm)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage(`Request submitted successfully! Request ID: ${data.request_id}`);
//         setRequestForm({ category: 'IT Support', description: '' });
//         setTimeout(() => setSuccessMessage(''), 5000);
        
//         if (activeTab === 1) {
//           fetchRequestHistory();
//         }
//       } else {
//         setErrorMessage(data.error || data.message || 'Failed to submit request');
//       }
//     } catch (error) {
//       setErrorMessage('Network error. Please check if the server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRequestHistory = async () => {
//     setLoading(true);
//     setErrorMessage('');

//     try {
//       const response = await fetch(`http://localhost:5000/api/employee/requests`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setRequests(data.requests || []);
//       } else {
//         setErrorMessage(data.error || data.message || 'Failed to fetch request history');
//       }
//     } catch (error) {
//       setErrorMessage('Network error. Please check if the server is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitFeedback = async () => {
//     if (!feedbackForm.feedback_message.trim() || !selectedRequest) {
//       setErrorMessage('Please enter your feedback');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch(`http://localhost:5000/api/employee/requests/feedback`, {
//         method: 'PUT',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           request_id: selectedRequest.request_id,
//           feedback_message: feedbackForm.feedback_message.trim(),
//           is_resolved: feedbackForm.is_resolved
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage(`Feedback submitted successfully! Status: ${data.status}`);
//         setFeedbackForm({ feedback_message: '', is_resolved: false });
//         setSelectedRequest(null);
//         setFeedbackOpen(false);
//         fetchRequestHistory();
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         setErrorMessage(data.error || 'Failed to submit feedback');
//       }
//     } catch (error) {
//       setErrorMessage('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING': return 'warning';
//       case 'IN_PROGRESS': return 'info';
//       case 'RESOLVED': return 'success';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'PENDING': return <ScheduleIcon />;
//       case 'IN_PROGRESS': return <RefreshIcon />;
//       case 'RESOLVED': return <DoneAllIcon />;
//       default: return <ErrorIcon />;
//     }
//   };

//   const parseResponseHistory = (responseText: string | null): ResponseHistoryItem[] => {
//     if (!responseText) return [];
    
//     const sections = responseText.split(/\n\n(?=\[)/);
//     return sections.map((section, index) => {
//       const headerMatch = section.match(/\[(.*?) - (.*?)\]/);
//       if (headerMatch) {
//         const type = headerMatch[1];
//         const timestamp = headerMatch[2];
//         const message = section.replace(/\[.*?\]\n/, '').trim();
//         return { type, timestamp, message, id: index };
//       }
//       return { type: 'Unknown', timestamp: '', message: section, id: index };
//     });
//   };

//   const handleFeedbackOpen = (request: Request) => {
//     setSelectedRequest(request);
//     setFeedbackOpen(true);
//   };

//   const handleFeedbackClose = () => {
//     setFeedbackOpen(false);
//     setSelectedRequest(null);
//     setFeedbackForm({ feedback_message: '', is_resolved: false });
//   };

//   if (!user) {
//     return (
//       <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
//         <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
//           <ErrorIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
//           <Typography variant="h5" gutterBottom>
//             No User Data Found
//           </Typography>
//           <Typography color="text.secondary" sx={{ mb: 3 }}>
//             Unable to load user information. Please log in first.
//           </Typography>
//           <Button 
//             variant="contained" 
//             onClick={() => window.location.href = '/login'}
//           >
//             Go to Login
//           </Button>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Internal Request Portal
//       </Typography>

//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Box sx={{ textAlign: 'center', mb: 4 }}>
//           <Box
//             sx={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: 80,
//               height: 80,
//               bgcolor: 'primary.main',
//               borderRadius: '50%',
//               mb: 2,
//             }}
//           >
//             <HelpIcon sx={{ fontSize: 40, color: 'white' }} />
//           </Box>
//           <Typography variant="h6" gutterBottom>
//             Submit and track your internal queries
//           </Typography>
//         </Box>

//         {successMessage && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             {successMessage}
//           </Alert>
//         )}

//         {errorMessage && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {errorMessage}
//           </Alert>
//         )}

//         <Paper sx={{ width: '100%', mb: 3 }}>
//           <Tabs
//             value={activeTab}
//             onChange={(_, newValue) => setActiveTab(newValue)}
//             sx={{ borderBottom: 1, borderColor: 'divider' }}
//           >
//             <Tab 
//               icon={<SendIcon />} 
//               iconPosition="start"
//               label="Submit Request" 
//             />
//             <Tab 
//               icon={<HistoryIcon />} 
//               iconPosition="start"
//               label="Request History" 
//             />
//           </Tabs>

//           <Box sx={{ p: 3 }}>
//             {activeTab === 0 && (
//               <Stack spacing={3}>
//                 <Alert severity="info">
//                   <Typography variant="body2">
//                     <strong>Submitting as:</strong> {user.email}
//                   </Typography>
//                 </Alert>

//                 <FormControl fullWidth>
//                   <InputLabel>Request Category *</InputLabel>
//                   <Select
//                     value={requestForm.category}
//                     onChange={handleSelectChange}
//                     label="Request Category *"
//                   >
//                     <MenuItem value="IT Support">IT Support</MenuItem>
//                     <MenuItem value="HR Query">HR Query</MenuItem>
//                     <MenuItem value="Leave Request">Leave Request</MenuItem>
//                     <MenuItem value="Reimbursement">Reimbursement</MenuItem>
//                     <MenuItem value="Access Request">Access Request</MenuItem>
//                     <MenuItem value="Equipment">Equipment</MenuItem>
//                     <MenuItem value="Training">Training</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   name="description"
//                   label="Request Description *"
//                   value={requestForm.description}
//                   onChange={handleFormChange}
//                   multiline
//                   rows={4}
//                   fullWidth
//                   inputProps={{ maxLength: 200 }}
//                   helperText={`${requestForm.description.length}/200 characters`}
//                   placeholder="Describe your request in detail..."
//                 />

//                 <Button
//                   variant="contained"
//                   size="large"
//                   onClick={submitRequest}
//                   disabled={loading || !requestForm.description.trim()}
//                   startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
//                   sx={{ py: 1.5 }}
//                 >
//                   {loading ? 'Submitting...' : 'Submit Request'}
//                 </Button>
//               </Stack>
//             )}

//             {activeTab === 1 && (
//               <Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                   <Typography variant="h6">Your Request History</Typography>
//                   <Button
//                     variant="outlined"
//                     onClick={fetchRequestHistory}
//                     disabled={loading}
//                     startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
//                   >
//                     Refresh
//                   </Button>
//                 </Box>

//                 {requests.length === 0 && !loading && (
//                   <Box sx={{ textAlign: 'center', py: 4 }}>
//                     <HistoryIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
//                     <Typography color="text.secondary">
//                       No requests found. Submit your first request!
//                     </Typography>
//                   </Box>
//                 )}

//                 <Stack spacing={2}>
//                   {requests.map((request) => {
//                     const responseHistory = parseResponseHistory(request.response);
//                     const hasAdminResponse = responseHistory.some(item => 
//                       item.type.includes('Admin') || item.type.includes('HR') || item.type.includes('Department')
//                     );
                    
//                     return (
//                       <Card key={request.request_id} variant="outlined">
//                         <CardContent>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//                             <Box>
//                               <Typography variant="h6" gutterBottom>
//                                 Request #{request.request_id}
//                               </Typography>
//                               <Typography color="text.secondary" variant="body2">
//                                 {request.category}
//                               </Typography>
//                             </Box>
//                             <Chip
//                               icon={getStatusIcon(request.status)}
//                               label={request.status.replace('_', ' ')}
//                               color={getStatusColor(request.status)}
//                               variant="outlined"
//                             />
//                           </Box>

//                           <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
//                             <Typography variant="subtitle2" gutterBottom color="text.secondary">
//                               Your Request:
//                             </Typography>
//                             <Typography variant="body1">
//                               {request.description}
//                             </Typography>
//                           </Paper>

//                           {responseHistory.length > 0 && (
//                             <Box sx={{ mt: 2 }}>
//                               <Divider sx={{ mb: 2 }} />
//                               <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <MessageIcon />
//                                 Response History
//                               </Typography>
//                               <Stack spacing={1}>
//                                 {responseHistory.map((item) => (
//                                   <Paper 
//                                     key={item.id}
//                                     sx={{ 
//                                       p: 2, 
//                                       bgcolor: item.type.includes('Employee') ? 'secondary.50' : 'primary.50',
//                                       border: 1,
//                                       borderColor: item.type.includes('Employee') ? 'secondary.200' : 'primary.200'
//                                     }}
//                                   >
//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//                                       <Chip
//                                         label={item.type}
//                                         size="small"
//                                         color={item.type.includes('Employee') ? 'secondary' : 'primary'}
//                                       />
//                                       <Typography variant="caption" color="text.secondary">
//                                         {item.timestamp}
//                                       </Typography>
//                                     </Box>
//                                     <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
//                                       {item.message}
//                                     </Typography>
//                                   </Paper>
//                                 ))}
//                               </Stack>
//                             </Box>
//                           )}

//                           {request.status !== 'RESOLVED' && (
//                             <Button
//                               variant="outlined"
//                               onClick={() => handleFeedbackOpen(request)}
//                               disabled={!hasAdminResponse && request.status === 'PENDING'}
//                               startIcon={<MessageIcon />}
//                               fullWidth
//                               sx={{ mt: 2 }}
//                             >
//                               {hasAdminResponse 
//                                 ? 'Add Feedback / Mark as Resolved' 
//                                 : 'Awaiting Admin/HR Response'}
//                             </Button>
//                           )}
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </Stack>
//               </Box>
//             )}
//           </Box>
//         </Paper>
//       </Paper>

//       <Dialog 
//         open={feedbackOpen} 
//         onClose={handleFeedbackClose}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           <Typography variant="h6">
//             Provide Feedback for Request #{selectedRequest?.request_id}
//           </Typography>
//           <IconButton
//             aria-label="close"
//             onClick={handleFeedbackClose}
//             sx={{ position: 'absolute', right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
        
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//             <strong>Original Request:</strong> {selectedRequest?.description}
//           </Typography>
          
//           <TextField
//             name="feedback_message"
//             label="Your Feedback *"
//             value={feedbackForm.feedback_message}
//             onChange={handleFeedbackChange}
//             multiline
//             rows={4}
//             fullWidth
//             sx={{ mb: 2 }}
//             inputProps={{ maxLength: 500 }}
//             helperText={`${feedbackForm.feedback_message.length}/500 characters`}
//             placeholder="Provide additional information or confirm if your issue is resolved..."
//           />

//           <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="is_resolved"
//                   checked={feedbackForm.is_resolved}
//                   onChange={handleFeedbackChange}
//                   color="primary"
//                 />
//               }
//               label={
//                 <Box>
//                   <Typography variant="subtitle2" color="primary">
//                     Mark this request as resolved
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Check this box only if you're completely satisfied and your issue is fully resolved
//                   </Typography>
//                 </Box>
//               }
//             />
//           </Paper>
//         </DialogContent>

//         <DialogActions sx={{ p: 3, gap: 1 }}>
//           <Button onClick={handleFeedbackClose} color="inherit">
//             Cancel
//           </Button>
//           <Button
//             onClick={submitFeedback}
//             disabled={loading || !feedbackForm.feedback_message.trim()}
//             variant="contained"
//             startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
//           >
//             {loading ? 'Submitting...' : 'Submit Feedback'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default EmployeeRequestPortal;

// src/pages/Employee/EmployeeRequestPortal.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, IconButton, Tab, Tabs, Checkbox,
  FormControlLabel, Divider, Stack, useTheme, useMediaQuery, Fade
} from '@mui/material';
import {
  Send as SendIcon, Error as ErrorIcon, Schedule as ScheduleIcon,
  Message as MessageIcon, History as HistoryIcon, Refresh as RefreshIcon,
  DoneAll as DoneAllIcon, Close as CloseIcon, Person
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

const API_BASE_URL = 'https://empbackend-pj7o.onrender.com/api';

interface Request {
  request_id: number;
  category: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  response: string | null;
  hr_handler_id: number | null;
}

interface ResponseHistoryItem {
  type: string;
  timestamp: string;
  message: string;
  id: number;
}

const EmployeeRequestPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const [feedbackForm, setFeedbackForm] = useState({
    feedback_message: '',
    is_resolved: false
  });

  const [requestForm, setRequestForm] = useState({
    category: 'IT Support',
    description: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (activeTab === 1) {
      fetchRequestHistory();
    }
  }, [activeTab]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    setRequestForm(prev => ({ ...prev, category: e.target.value }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFeedbackForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const submitRequest = async () => {
    if (!requestForm.category || !requestForm.description.trim()) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/employee/requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestForm)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Request submitted successfully! Request ID: ${data.request_id}`);
        setRequestForm({ category: 'IT Support', description: '' });
        setTimeout(() => setSuccessMessage(''), 5000);
        
        if (activeTab === 1) {
          fetchRequestHistory();
        }
      } else {
        setErrorMessage(data.error || data.message || 'Failed to submit request');
      }
    } catch (error) {
      setErrorMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestHistory = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/employee/requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setRequests(data.requests || []);
      } else {
        setErrorMessage(data.error || data.message || 'Failed to fetch request history');
      }
    } catch (error) {
      setErrorMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackForm.feedback_message.trim() || !selectedRequest) {
      setErrorMessage('Please enter your feedback');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/employee/requests/feedback`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          request_id: selectedRequest.request_id,
          feedback_message: feedbackForm.feedback_message.trim(),
          is_resolved: feedbackForm.is_resolved
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Feedback submitted successfully! Status: ${data.status}`);
        setFeedbackForm({ feedback_message: '', is_resolved: false });
        setSelectedRequest(null);
        setFeedbackOpen(false);
        fetchRequestHistory();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      setErrorMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'RESOLVED': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ScheduleIcon />;
      case 'IN_PROGRESS': return <RefreshIcon />;
      case 'RESOLVED': return <DoneAllIcon />;
      default: return <ErrorIcon />;
    }
  };

  const parseResponseHistory = (responseText: string | null): ResponseHistoryItem[] => {
    if (!responseText) return [];
    
    const sections = responseText.split(/\n\n(?=\[)/);
    return sections.map((section, index) => {
      const headerMatch = section.match(/\[(.*?) - (.*?)\]/);
      if (headerMatch) {
        const type = headerMatch[1];
        const timestamp = headerMatch[2];
        const message = section.replace(/\[.*?\]\n/, '').trim();
        return { type, timestamp, message, id: index };
      }
      return { type: 'Unknown', timestamp: '', message: section, id: index };
    });
  };

  const handleFeedbackOpen = (request: Request) => {
    setSelectedRequest(request);
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    setSelectedRequest(null);
    setFeedbackForm({ feedback_message: '', is_resolved: false });
  };

  if (!user) {
    return (
      <Box sx={{ 
        p: isMobile ? 1 : 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            maxWidth: 400,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <ErrorIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No User Data Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Unable to load user information. Please log in first.
          </Typography>
          <MotionButton 
            variant="contained" 
            onClick={() => window.location.href = '/login'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2
            }}
          >
            Go to Login
          </MotionButton>
        </MotionPaper>
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
              Internal Request Portal
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Submit and track your internal queries
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${requests.length} requests`}
              color="primary"
              variant="outlined"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>
      </MotionPaper>

      {/* Alerts Section */}
      <Box sx={{ flexShrink: 0, mb: 3 }}>
        {successMessage && (
          <Fade in>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          </Fade>
        )}

        {errorMessage && (
          <Fade in>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                animation: errorMessage ? 'shake 0.5s ease-in-out' : 'none',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' },
                }
              }}
              onClose={() => setErrorMessage('')}
            >
              {errorMessage}
            </Alert>
          </Fade>
        )}
      </Box>

      {/* Main Content */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.95)',
          flex: 1
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* User Info Card */}
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(102,126,234,0.1)',
              border: 1,
              borderColor: 'primary.light'
            }}
          >
            <CardContent sx={{ p: '0 !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                  }}
                >
                  <Person sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                    {user.department_name || 'Employee'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Tabs Section */}
          <Paper sx={{ width: '100%', mb: 3, borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  py: 2,
                  minHeight: 'auto'
                }
              }}
            >
              <Tab 
                icon={<SendIcon />} 
                iconPosition="start"
                label="Submit Request" 
              />
              <Tab 
                icon={<HistoryIcon />} 
                iconPosition="start"
                label="Request History" 
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Request Category *</InputLabel>
                    <Select
                      value={requestForm.category}
                      onChange={handleSelectChange}
                      label="Request Category *"
                    >
                      <MenuItem value="IT Support">IT Support</MenuItem>
                      <MenuItem value="HR Query">HR Query</MenuItem>
                      <MenuItem value="Leave Request">Leave Request</MenuItem>
                      <MenuItem value="Reimbursement">Reimbursement</MenuItem>
                      <MenuItem value="Access Request">Access Request</MenuItem>
                      <MenuItem value="Equipment">Equipment</MenuItem>
                      <MenuItem value="Training">Training</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    name="description"
                    label="Request Description *"
                    value={requestForm.description}
                    onChange={handleFormChange}
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 200 }}
                    helperText={`${requestForm.description.length}/200 characters`}
                    placeholder="Describe your request in detail..."
                  />

                  <MotionButton
                    variant="contained"
                    size="large"
                    onClick={submitRequest}
                    disabled={loading || !requestForm.description.trim()}
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      fontWeight: 'bold'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </MotionButton>
                </Stack>
              )}

              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Your Request History
                    </Typography>
                    <MotionButton
                      variant="outlined"
                      onClick={fetchRequestHistory}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{ borderRadius: 2, fontWeight: 'bold' }}
                    >
                      Refresh
                    </MotionButton>
                  </Box>

                  {requests.length === 0 && !loading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HistoryIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                      <Typography color="text.secondary">
                        No requests found. Submit your first request!
                      </Typography>
                    </Box>
                  )}

                  <Stack spacing={2}>
                    <AnimatePresence>
                      {requests.map((request, index) => {
                        const responseHistory = parseResponseHistory(request.response);
                        const hasAdminResponse = responseHistory.some(item => 
                          item.type.includes('Admin') || item.type.includes('HR') || item.type.includes('Department')
                        );
                        
                        return (
                          <MotionCard 
                            key={request.request_id} 
                            variant="outlined"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            sx={{
                              borderRadius: 3,
                              border: 1,
                              borderColor: 'grey.200',
                              '&:hover': {
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                borderColor: 'primary.light'
                              }
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    Request #{request.request_id}
                                  </Typography>
                                  <Chip
                                    label={request.category}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ borderRadius: 1, fontWeight: 'bold' }}
                                  />
                                </Box>
                                <Chip
                                  icon={getStatusIcon(request.status)}
                                  label={request.status.replace('_', ' ')}
                                  color={getStatusColor(request.status)}
                                  variant="filled"
                                  sx={{ fontWeight: 'bold', borderRadius: 1 }}
                                />
                              </Box>

                              <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                  Your Request:
                                </Typography>
                                <Typography variant="body1">
                                  {request.description}
                                </Typography>
                              </Paper>

                              {responseHistory.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Divider sx={{ mb: 2 }} />
                                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                                    <MessageIcon />
                                    Response History
                                  </Typography>
                                  <Stack spacing={1}>
                                    {responseHistory.map((item) => (
                                      <Paper 
                                        key={item.id}
                                        sx={{ 
                                          p: 2, 
                                          bgcolor: item.type.includes('Employee') ? 'secondary.50' : 'primary.50',
                                          border: 1,
                                          borderColor: item.type.includes('Employee') ? 'secondary.200' : 'primary.200',
                                          borderRadius: 2
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                          <Chip
                                            label={item.type}
                                            size="small"
                                            color={item.type.includes('Employee') ? 'secondary' : 'primary'}
                                            sx={{ borderRadius: 1, fontWeight: 'bold' }}
                                          />
                                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                            {item.timestamp}
                                          </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                          {item.message}
                                        </Typography>
                                      </Paper>
                                    ))}
                                  </Stack>
                                </Box>
                              )}

                              {request.status !== 'RESOLVED' && (
                                <MotionButton
                                  variant="outlined"
                                  onClick={() => handleFeedbackOpen(request)}
                                  disabled={!hasAdminResponse && request.status === 'PENDING'}
                                  startIcon={<MessageIcon />}
                                  fullWidth
                                  sx={{ 
                                    mt: 2, 
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    borderColor: hasAdminResponse ? 'primary.main' : 'grey.400',
                                    color: hasAdminResponse ? 'primary.main' : 'grey.600'
                                  }}
                                  whileHover={{ scale: hasAdminResponse ? 1.02 : 1 }}
                                  whileTap={{ scale: hasAdminResponse ? 0.98 : 1 }}
                                >
                                  {hasAdminResponse 
                                    ? 'Add Feedback / Mark as Resolved' 
                                    : 'Awaiting Admin/HR Response'}
                                </MotionButton>
                              )}
                            </CardContent>
                          </MotionCard>
                        );
                      })}
                    </AnimatePresence>
                  </Stack>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </MotionPaper>

      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackOpen} 
        onClose={handleFeedbackClose}
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
            fontWeight: 'bold',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MessageIcon />
              <Typography variant="h6">
                Feedback for Request #{selectedRequest?.request_id}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleFeedbackClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Card sx={{ p: 2, mb: 2, backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
            <CardContent sx={{ p: '0 !important' }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
                Original Request:
              </Typography>
              <Typography variant="body2">
                {selectedRequest?.description}
              </Typography>
            </CardContent>
          </Card>
          
          <TextField
            name="feedback_message"
            label="Your Feedback *"
            value={feedbackForm.feedback_message}
            onChange={handleFeedbackChange}
            multiline
            rows={4}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 500 }}
            helperText={`${feedbackForm.feedback_message.length}/500 characters`}
            placeholder="Provide additional information or confirm if your issue is resolved..."
          />

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50', borderRadius: 2, borderColor: 'info.main' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="is_resolved"
                  checked={feedbackForm.is_resolved}
                  onChange={handleFeedbackChange}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                    Mark this request as resolved
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Check this box only if you're completely satisfied and your issue is fully resolved
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleFeedbackClose} 
            color="inherit"
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            Cancel
          </Button>
          <MotionButton
            onClick={submitFeedback}
            disabled={loading || !feedbackForm.feedback_message.trim()}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 'bold'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </MotionButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeRequestPortal;