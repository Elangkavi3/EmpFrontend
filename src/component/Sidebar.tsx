// // src/component/Sidebar.tsx
// import React, { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Box,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   IconButton,
//   AppBar,
//   Toolbar,
// } from '@mui/material';
// import {
//   Dashboard,
//   People,
//   Work,
//   AttachMoney,
//   CalendarMonth,
//   //Notifications,
//   Logout,
//   Business,
//   Menu,
//   Person,
//   QuestionAnswer,
// } from '@mui/icons-material';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate, useLocation } from 'react-router-dom';

// const drawerWidth = 240;

// // Define the MenuItem interface
// interface MenuItem {
//   text: string;
//   icon: React.ReactElement;
//   path: string;
// }

// const Sidebar: React.FC = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleNavigation = (path: string) => {
//     navigate(path);
//     if (isMobile) {
//       setMobileOpen(false);
//     }
//   };

//   // Admin/HR menu items
//   const adminMenuItems: MenuItem[] = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
//     { text: 'Employees', icon: <People />, path: '/admin/employees' },
//     { text: 'Projects', icon: <Work />, path: '/admin/projects' },
//     { text: 'Payroll', icon: <AttachMoney />, path: '/admin/payroll' },
//     { text: 'Leaves', icon: <CalendarMonth />, path: '/admin/leaves' },
//   //  { text: 'Notifications', icon: <Notifications />, path: '/admin/notifications' },
//   ];

//   // Employee menu items
//   const employeeMenuItems: MenuItem[] = [
//     { text: 'Dashboard', icon: <Dashboard />, path: '/employee/dashboard' },
//     { text: 'My Projects', icon: <Work />, path: '/employee/projects' },
//     { text: 'Attendance', icon: <CalendarMonth />, path: '/employee/attendance' },
//     { text: 'Leaves', icon: <CalendarMonth />, path: '/employee/leaves' },
//     { text: 'Payroll', icon: <AttachMoney />, path: '/employee/payroll' },
//     { text: 'Internal Queries', icon: <QuestionAnswer />, path: '/employee/queries' },
//    // { text: 'Notifications', icon: <Notifications />, path: '/employee/notifications' },
//     { text: 'Profile', icon: <Person />, path: '/employee/profile' },
//   ];

//   const menuItems = user?.role === 'EMPLOYEE' ? employeeMenuItems : adminMenuItems;

//   const drawerContent = (
//     <Box sx={{ overflow: 'auto' }}>
//       {/* Header */}
//       <Box sx={{ p: 2, textAlign: 'center' }}>
//         <Business sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
//         <Typography variant="h6" noWrap component="div">
//           Company CMS
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {user?.role === 'EMPLOYEE' ? 'Employee Portal' : 'Admin Portal'}
//         </Typography>
//       </Box>

//       <Divider />

//       {/* User Info */}
//       <Box sx={{ p: 2 }}>
//         <Typography variant="subtitle2" fontWeight="bold">
//           {user?.username || 'User'}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {user?.email || 'user@company.com'}
//         </Typography>
//         <Typography variant="caption" color="primary">
//           {user?.role || 'EMPLOYEE'}
//         </Typography>
//       </Box>

//       <Divider />

//       {/* Navigation Menu */}
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton
//               selected={location.pathname === item.path}
//               onClick={() => handleNavigation(item.path)}
//               sx={{
//                 '&.Mui-selected': {
//                   backgroundColor: 'primary.light',
//                   color: 'primary.main',
//                   '&:hover': {
//                     backgroundColor: 'primary.light',
//                   },
//                   '& .MuiListItemIcon-root': {
//                     color: 'primary.main',
//                   },
//                 },
//               }}
//             >
//               <ListItemIcon>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>

//       <Divider />

//       {/* Logout */}
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={handleLogout}>
//             <ListItemIcon>
//               <Logout />
//             </ListItemIcon>
//             <ListItemText primary="Logout" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       {/* Mobile App Bar */}
//       {isMobile && (
//         <AppBar
//           position="fixed"
//           sx={{
//             width: { md: `calc(100% - ${drawerWidth}px)` },
//             ml: { md: `${drawerWidth}px` },
//           }}
//         >
//           <Toolbar>
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2, display: { md: 'none' } }}
//             >
//               <Menu />
//             </IconButton>
//             <Typography variant="h6" noWrap component="div">
//               {user?.role === 'EMPLOYEE' ? 'Employee Portal' : 'Admin Portal'}
//             </Typography>
//           </Toolbar>
//         </AppBar>
//       )}

//       <Box
//         component="nav"
//         sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
//       >
//         {/* Mobile Drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: 'block', md: 'none' },
//             '& .MuiDrawer-paper': { 
//               boxSizing: 'border-box', 
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawerContent}
//         </Drawer>

//         {/* Desktop Permanent Drawer */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', md: 'block' },
//             '& .MuiDrawer-paper': { 
//               boxSizing: 'border-box', 
//               width: drawerWidth,
//               position: 'relative',
//               height: '100vh',
//             },
//           }}
//           open
//         >
//           {drawerContent}
//         </Drawer>
//       </Box>

//       {/* Spacer for mobile app bar */}
//       {isMobile && <Toolbar />}
//     </>
//   );
// };

// export default Sidebar;

// src/component/Sidebar.tsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Work,
  AttachMoney,
  CalendarMonth,
  Logout,
  Business,
  Menu,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;
const collapsedWidth = 72;

// Define the MenuItem interface
interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileClick = () => {
    const profilePath = user?.role === 'EMPLOYEE' ? '/employee/profile' : '/admin/profile';
    handleNavigation(profilePath);
  };

  // Admin/HR menu items
  const adminMenuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Employees', icon: <People />, path: '/admin/employees' },
    { text: 'Projects', icon: <Work />, path: '/admin/projects' },
    { text: 'Payroll', icon: <AttachMoney />, path: '/admin/payroll' },
    { text: 'Leaves', icon: <CalendarMonth />, path: '/admin/leaves' },
  ];

  // Employee menu items
  const employeeMenuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/employee/dashboard' },
    { text: 'My Projects', icon: <Work />, path: '/employee/projects' },
    { text: 'Attendance', icon: <CalendarMonth />, path: '/employee/attendance' },
    { text: 'Leaves', icon: <CalendarMonth />, path: '/employee/leaves' },
    { text: 'Payroll', icon: <AttachMoney />, path: '/employee/payroll' },
    { text: 'Internal Queries', icon: <Business />, path: '/employee/queries' },
  ];

  const menuItems = user?.role === 'EMPLOYEE' ? employeeMenuItems : adminMenuItems;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'HR': return 'warning';
      case 'EMPLOYEE': return 'success';
      default: return 'primary';
    }
  };

  const drawerContent = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Compact Header */}
      <Box sx={{ p: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          {/* Logo Icon - Always Visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Business sx={{ 
              fontSize: 32, 
              color: 'white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} />
          </motion.div>

          {/* Text Content with Collapse Button in line - Only when expanded */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 1
                }}>
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        lineHeight: 1.2
                      }}
                    >
                      Company CMS
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.8,
                        fontSize: '0.7rem',
                        display: 'block',
                        lineHeight: 1.2
                      }}
                    >
                      {user?.role === 'EMPLOYEE' ? 'Employee Portal' : 'Admin Portal'}
                    </Typography>
                  </Box>
                  
                  {/* Collapse Toggle Button - Inline with text */}
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={handleCollapseToggle}
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                      }}
                    >
                      <ChevronLeft fontSize="small" />
                    </IconButton>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show only collapse button when collapsed */}
          {collapsed && (
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleCollapseToggle}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                  width: 32,
                  height: 32,
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </motion.div>
          )}
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1 }} />

      {/* User Info as Profile Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ListItemButton 
          onClick={handleProfileClick}
          sx={{
            p: 1.5,
            mx: 1,
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
              src={`https://ui-avatars.com/api/?name=${user?.username}&background=fff&color=667eea`}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold" 
                      noWrap
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {user?.username || 'User'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.8, 
                        display: 'block',
                        fontSize: '0.7rem'
                      }} 
                      noWrap
                    >
                      {user?.email || 'user@company.com'}
                    </Typography>
                    <Chip
                      label={user?.role || 'EMPLOYEE'}
                      color={getRoleColor(user?.role || 'EMPLOYEE')}
                      size="small"
                      sx={{ 
                        mt: 0.5, 
                        height: 18,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }}
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </ListItemButton>
      </motion.div>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 0.5, pt: 0.5 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: collapsed ? 'auto' : 48,
                    color: 'rgba(255,255,255,0.8)',
                    justifyContent: 'center',
                    marginRight: collapsed ? 0 : 1,
                    '& .MuiSvgIcon-root': {
                      fontSize: collapsed ? 20 : 22
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemText 
                          primary={item.text} 
                          sx={{
                            '& .MuiTypography-root': {
                              fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                              fontSize: '0.875rem',
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <ListItemButton 
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'rgba(255,255,255,0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255,107,107,0.2)',
              color: 'white',
            },
            minHeight: 44,
            justifyContent: collapsed ? 'center' : 'flex-start',
            mx: 0.5,
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: collapsed ? 'auto' : 48,
            color: 'inherit',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : 1,
            '& .MuiSvgIcon-root': {
              fontSize: collapsed ? 20 : 22
            }
          }}>
            <Logout />
          </ListItemIcon>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemText 
                  primary="Logout" 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.875rem' 
                    } 
                  }} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ListItemButton>
      </Box>
    </Box>
  );

  const currentDrawerWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>
              {user?.role === 'EMPLOYEE' ? 'Employee Portal' : 'Admin Portal'}
            </Typography>
            <Avatar
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '0.875rem'
              }}
              src={`https://ui-avatars.com/api/?name=${user?.username}&background=fff&color=667eea`}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{ 
          width: { md: currentDrawerWidth }, 
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer - FIXED POSITION */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              overflowX: 'hidden',
              transition: 'width 0.3s ease',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Spacer for mobile app bar */}
      {isMobile && <Toolbar />}
    </>
  );
};

export default Sidebar;