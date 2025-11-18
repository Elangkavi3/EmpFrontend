// // src/pages/Employee/EmployeeProfile.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Avatar,
//   CircularProgress,
//   Divider,
//   TextField,
//   Button,
// } from '@mui/material';
// import { employeeAPI, type User } from '../../types/api';


// const EmployeeProfile: React.FC = () => {
//   const [profile, setProfile] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({ phone: '', designation: '' });

//   const fetchProfile = async () => {
//   try {
//     const res = await employeeAPI.getProfile();
    
//     console.log('Full API response:', res.data); // Debug log
    
//     // ✅ FIX: Backend sends 'user' not 'profile'
//     const profileData = res.data.user; // Change this line
    
//     if (!profileData) {
//       console.error('No user data found in response:', res.data);
//       throw new Error('No profile data received');
//     }
    
//     setProfile(profileData);
//     setFormData({
//       phone: profileData.phone || '',
//       designation: profileData.designation || '',
//     });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleUpdate = async () => {
//     try {
//       await employeeAPI.updateProfile(formData);
//       alert('Profile updated successfully!');
//       setEditMode(false);
//       fetchProfile();
//     } catch (error) {
//       alert('Failed to update profile');
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!profile) {
//     return <Typography color="error">Profile not found.</Typography>;
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         My Profile
//       </Typography>

//       <Paper sx={{ p: 3 }}>
//         <Grid container spacing={3} alignItems="center">
//           <Grid size={{xs:12,sm:3}}>
//             <Avatar
//               sx={{ width: 120, height: 120, fontSize: 40, bgcolor: '#1976d2' }}
//             >
//               {profile.username.charAt(0).toUpperCase()}
//             </Avatar>
//           </Grid>

//           <Grid size={{xs:12,sm:9}}>
//             <Typography variant="h5">{profile.username}</Typography>
//             <Typography color="text.secondary">{profile.email}</Typography>
//             <Typography color="text.secondary">{profile.role}</Typography>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         <Grid container spacing={2}>
//           <Grid size={{xs:12,sm:6}}>
//             <Typography variant="subtitle2">Phone</Typography>
//             {editMode ? (
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//               />
//             ) : (
//               <Typography variant="body1">{profile.phone || '—'}</Typography>
//             )}
//           </Grid>

//           <Grid size={{xs:12,sm:6}}>
//             <Typography variant="subtitle2">Designation</Typography>
//             {editMode ? (
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="designation"
//                 value={formData.designation}
//                 onChange={(e) =>
//                   setFormData({ ...formData, designation: e.target.value })
//                 }
//               />
//             ) : (
//               <Typography variant="body1">
//                 {profile.designation || '—'}
//               </Typography>
//             )}
//           </Grid>

//           <Grid size={{xs:12,sm:6}}>
//             <Typography variant="subtitle2">Department</Typography>
//             <Typography variant="body1">
//               {profile.department_name || '—'}
//             </Typography>
//           </Grid>

//           <Grid size={{xs:12,sm:6}}>
//             <Typography variant="subtitle2">Join Date</Typography>
//             <Typography variant="body1">
//               {profile.join_date
//                 ? new Date(profile.join_date).toLocaleDateString()
//                 : '—'}
//             </Typography>
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 3 }} />

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           {editMode ? (
//             <>
//               <Button variant="contained" color="primary" onClick={handleUpdate}>
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => setEditMode(false)}
//               >
//                 Cancel
//               </Button>
//             </>
//           ) : (
//             <Button variant="contained" onClick={() => setEditMode(true)}>
//               Edit Profile
//             </Button>
//           )}
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default EmployeeProfile;


// src/pages/Employee/EmployeeProfile.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Avatar, CircularProgress, Divider,
  TextField, Button, Alert, useTheme, useMediaQuery, Fade, Card, CardContent
} from '@mui/material';
import { Edit, Save, Cancel, Person, Work, Phone, Business, CalendarToday, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { employeeAPI, type User } from '../../types/api';

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

const EmployeeProfile: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ phone: '', designation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchProfile = async () => {
    try {
      const res = await employeeAPI.getProfile();
      
      console.log('Full API response:', res.data);
      
      const profileData = res.data.user;
      
      if (!profileData) {
        console.error('No user data found in response:', res.data);
        throw new Error('No profile data received');
      }
      
      setProfile(profileData);
      setFormData({
        phone: profileData.phone || '',
        designation: profileData.designation || '',
      });
      setSuccess('Profile loaded successfully');
    } catch (error) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await employeeAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Profile not found.
        </Alert>
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
              My Profile
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage your personal information and preferences
            </Typography>
          </Box>
          <MotionButton
            variant={editMode ? "outlined" : "contained"}
            startIcon={editMode ? <Cancel /> : <Edit />}
            onClick={() => setEditMode(!editMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: editMode ? 'transparent' : 'rgba(255,255,255,0.2)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: editMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
                borderColor: 'rgba(255,255,255,0.5)',
              },
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
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

      {/* Profile Content */}
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
          {/* Profile Header */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Grid size={{xs:12,sm:3}} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: 40, 
                  bgcolor: 'primary.main',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>

            <Grid size={{xs:12,sm:9}}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {profile.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Email fontSize="small" color="primary" />
                <Typography variant="h6" color="text.secondary">
                  {profile.email}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'inline-block' }}>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  {profile.role}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Quick Info Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Card sx={{ p: 2, backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <Business color="primary" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Department
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profile.department_name || '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Card sx={{ p: 2, backgroundColor: 'rgba(118,75,162,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <Work color="primary" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Designation
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profile.designation || '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Card sx={{ p: 2, backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <Phone color="primary" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profile.phone || '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Card sx={{ p: 2, backgroundColor: 'rgba(255,152,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: '0 !important', textAlign: 'center' }}>
                  <CalendarToday color="primary" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Join Date
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {profile.join_date
                      ? new Date(profile.join_date).toLocaleDateString()
                      : '—'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Editable Information */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Update Information
          </Typography>

          <Grid container spacing={3}>
            {/* Personal Information Card */}
            <Grid size={{xs:12,md:6}}>
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(102,126,234,0.1)',
                  border: 1,
                  borderColor: 'primary.light',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Personal Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Phone color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone Number
                    </Typography>
                  </Box>
                  {editMode ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: '500', pl: 4 }}>
                      {profile.phone || 'Not provided'}
                    </Typography>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Professional Information Card */}
            <Grid size={{xs:12,md:6}}>
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(118,75,162,0.1)',
                  border: 1,
                  borderColor: 'secondary.light',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Work color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Professional Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Work color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="textSecondary">
                      Designation
                    </Typography>
                  </Box>
                  {editMode ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="designation"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Enter designation"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: '500', pl: 4 }}>
                      {profile.designation || 'Not provided'}
                    </Typography>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          {editMode && (
            <Fade in>
              <Box sx={{ display: 'flex', gap: 2, mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <MotionButton
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 3
                  }}
                >
                  Save Changes
                </MotionButton>
                <MotionButton
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => setEditMode(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Cancel
                </MotionButton>
              </Box>
            </Fade>
          )}
        </Box>
      </MotionPaper>
    </Box>
  );
};

export default EmployeeProfile;