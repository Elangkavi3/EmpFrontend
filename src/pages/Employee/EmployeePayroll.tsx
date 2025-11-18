// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   CircularProgress,
//   Alert,
//   Chip,
//   Button,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Paper,
//   Stack,
//   useTheme,
//   alpha,
//   Fade,
//   Zoom,
//   Slide,
//   Tabs,
//   Tab,
//   Avatar,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   LinearProgress,
// } from "@mui/material";

// import {
//   Refresh,
//   CalendarMonth,
//   FilterList,
//   AccountBalanceWallet,
//   TrendingUp,
//   Savings,
//   ReceiptLong,
//   Analytics,
//   Download,
// } from "@mui/icons-material";

// import { motion, AnimatePresence } from "framer-motion";

// /* -------------------------------------------------------
//    Types
// --------------------------------------------------------- */
// interface Payroll {
//   designation: string;
//   join_date: string;
//   basic_salary: string;
//   bonus: string;
//   deduction: string;
//   total: string;
//   status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
//   payroll_month: string;
// }

// interface PayrollSummary {
//   totalEarnings: number;
//   totalDeductions: number;
//   netSalary: number;
//   ytdEarnings: number;
//   averageSalary: number;
// }

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// const TabPanel = (props: TabPanelProps) => {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`payroll-tabpanel-${index}`}
//       aria-labelledby={`payroll-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// };

// /* -------------------------------------------------------
//    Component Start
// --------------------------------------------------------- */
// const EmployeePayroll: React.FC = () => {
//   const [payrolls, setPayrolls] = useState<Payroll[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [summary, setSummary] = useState<PayrollSummary | null>(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [successMessage, setSuccessMessage] = useState("");

//   const theme = useTheme();

//   /* -------------------------------------------------------
//      Year + Month Arrays
//   --------------------------------------------------------- */
//   const years = useMemo(
//     () =>
//       Array.from(
//         { length: new Date().getFullYear() - 2019 },
//         (_, i) => 2020 + i
//       ).reverse(),
//     []
//   );

//   const months = useMemo(
//     () => [
//       { value: "1", label: "January", short: "Jan" },
//       { value: "2", label: "February", short: "Feb" },
//       { value: "3", label: "March", short: "Mar" },
//       { value: "4", label: "April", short: "Apr" },
//       { value: "5", label: "May", short: "May" },
//       { value: "6", label: "June", short: "Jun" },
//       { value: "7", label: "July", short: "Jul" },
//       { value: "8", label: "August", short: "Aug" },
//       { value: "9", label: "September", short: "Sep" },
//       { value: "10", label: "October", short: "Oct" },
//       { value: "11", label: "November", short: "Nov" },
//       { value: "12", label: "December", short: "Dec" },
//     ],
//     []
//   );

//   /* -------------------------------------------------------
//      Summary Calculation
//   --------------------------------------------------------- */
//   const calculateSummary = useCallback((list: Payroll[]) => {
//     const totalEarnings = list.reduce(
//       (sum, p) => sum + Number(p.basic_salary) + Number(p.bonus),
//       0
//     );
//     const totalDeductions = list.reduce(
//       (sum, p) => sum + Number(p.deduction),
//       0
//     );
//     const netSalary = list.reduce((sum, p) => sum + Number(p.total), 0);
//     const ytdEarnings = list
//       .filter(
//         (p) =>
//           new Date(p.payroll_month).getFullYear() === new Date().getFullYear()
//       )
//       .reduce((sum, p) => sum + Number(p.total), 0);

//     const averageSalary = list.length > 0 ? netSalary / list.length : 0;

//     setSummary({
//       totalEarnings,
//       totalDeductions,
//       netSalary,
//       ytdEarnings,
//       averageSalary,
//     });
//   }, []);

//   /* -------------------------------------------------------
//      Fetch Payroll
//   --------------------------------------------------------- */
//   const fetchPayrolls = useCallback(
//     async (filters?: { month?: string; year?: string }) => {
//       setLoading(true);
//       setError("");

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Authentication required. Please login again.");
//           return;
//         }

//         let url = "http://localhost:5000/api/employee/payroll";
//         const params = new URLSearchParams();

//         if (filters?.month) params.append("month", filters.month);
//         if (filters?.year) params.append("year", filters.year);

//         if (params.toString()) url += `?${params}`;

//         const res = await fetch(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (res.status === 401) {
//           setError("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           return;
//         }

//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.message || "Failed to fetch payroll data");
//         }

//         const data = await res.json();

//         if (data.success && data.payroll) {
//           setPayrolls(data.payroll);
//           calculateSummary(data.payroll);
//         } else {
//           setPayrolls([]);
//           setSummary(null);
//         }
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [calculateSummary]
//   );

//   /* -------------------------------------------------------
//      Download Payslip
//   --------------------------------------------------------- */
//   const downloadPayslip = async (payroll: Payroll) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentication required. Please login again.");
//         return;
//       }

//       const d = new Date(payroll.payroll_month);
//       const month = (d.getMonth() + 1).toString();
//       const year = d.getFullYear().toString();

//       let url = "http://localhost:5000/api/employee/payroll/payslip";
//       const params = new URLSearchParams();
//       params.append("month", month);
//       params.append("year", year);
//       url += `?${params}`;

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to download payslip");
//       }

//       const blob = await res.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = `payslip_${d.toLocaleDateString("en-IN", {
//         month: "short",
//         year: "numeric",
//       })}.pdf`;

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(downloadUrl);

//       setSuccessMessage("Payslip downloaded successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (e: any) {
//       setError(e.message);
//     }
//   };

//   /* -------------------------------------------------------
//      Init
//   --------------------------------------------------------- */
//   useEffect(() => {
//     fetchPayrolls();
//   }, [fetchPayrolls]);

//   const handleTabChange = (_: any, v: number) => setTabValue(v);

//   const handleFilter = () => fetchPayrolls({ month, year });

//   const clearFilters = () => {
//     setMonth("");
//     setYear("");
//     fetchPayrolls();
//   };

//   /* -------------------------------------------------------
//      Helpers
//   --------------------------------------------------------- */
//   const getStatusInfo = (status: string) => {
//     const data = {
//       PAID: { color: "success", label: "Paid", icon: "💳" },
//       PENDING: { color: "warning", label: "Pending", icon: "⏳" },
//       PROCESSING: { color: "info", label: "Processing", icon: "⚙️" },
//       CANCELLED: { color: "error", label: "Cancelled", icon: "❌" },
//     };
//     return data[status as keyof typeof data];
//   };

//   const formatCurrency = (n: number | string) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(Number(n));

//   const formatDate = (d: string) =>
//     d
//       ? new Date(d).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         })
//       : "N/A";

//   const getProgressColor = (status: string) => {
//     if (status === "PAID") return "success";
//     if (status === "PROCESSING") return "info";
//     if (status === "PENDING") return "warning";
//     return "error";
//   };

//   /* -------------------------------------------------------
//      Loading Screen
//   --------------------------------------------------------- */
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           minHeight: "100vh",
//           background: "linear-gradient(135deg,#667eea,#764ba2)",
//         }}
//       >
//         <Box
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Fade in timeout={900}>
//             <Stack spacing={3} alignItems="center">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 2 }}
//               >
//                 <CircularProgress size={80} sx={{ color: "white" }} />
//               </motion.div>

//               <Typography color="white" variant="h5">
//                 Loading Your Payroll…
//               </Typography>

//               <LinearProgress
//                 sx={{
//                   width: 200,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: alpha("#fff", 0.3),
//                 }}
//               />
//             </Stack>
//           </Fade>
//         </Box>
//       </Box>
//     );
//   }

// /*  
//  ---------------------------------------------------------------
//  END OF PART 1
//  ---------------------------------------------------------------
// */

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, md: 3 },
//           background: "linear-gradient(135deg,#f5f7fa,#c3cfe2)",
//         }}
//       >
//         {/* -------------------------------------------------------
//            HEADER
//         --------------------------------------------------------- */}
//         <Slide in direction="down" timeout={800}>
//           <Paper
//             sx={{
//               p: 4,
//               mb: 4,
//               borderRadius: 4,
//               background: "linear-gradient(135deg,#667eea,#764ba2)",
//               color: "white",
//               position: "relative",
//               overflow: "hidden",
//               boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", md: "row" },
//                 justifyContent: "space-between",
//                 alignItems: { xs: "stretch", md: "center" },
//                 gap: 3,
//                 position: "relative",
//                 zIndex: 2,
//               }}
//             >
//               <Box>
//                 <Typography variant="h3" fontWeight="800" sx={{ textShadow: "0 2px 4px rgba(0,0,0,.3)" }}>
//                   💼 Payroll
//                 </Typography>

//                 <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
//                   Manage and analyze your compensation details
//                 </Typography>
//               </Box>

//               <Button
//                 variant="contained"
//                 startIcon={<Refresh />}
//                 disabled={loading}
//                 onClick={() => fetchPayrolls({ month, year })}
//                 sx={{
//                   bgcolor: "white",
//                   color: "#667eea",
//                   px: 3,
//                   py: 1,
//                   borderRadius: 3,
//                   fontWeight: "bold",
//                   "&:hover": {
//                     bgcolor: alpha("#fff", 0.9),
//                     transform: "translateY(-2px)",
//                   },
//                 }}
//               >
//                 Refresh Data
//               </Button>
//             </Box>

//             {/* FILTERS */}
//             <Paper
//               variant="outlined"
//               sx={{
//                 p: 3,
//                 mt: 3,
//                 borderRadius: 3,
//                 bgcolor: alpha("#fff", 0.15),
//                 backdropFilter: "blur(10px)",
//                 border: `1px solid ${alpha("#fff", 0.2)}`,
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   gap: 2,
//                   alignItems: { xs: "stretch", sm: "flex-end" },
//                 }}
//               >
//                 {/* Month */}
//                 <FormControl size="small" sx={{ minWidth: 140 }}>
//                   <InputLabel sx={{ color: "white" }}>Select Month</InputLabel>
//                   <Select
//                     value={month}
//                     label="Select Month"
//                     onChange={(e) => setMonth(e.target.value)}
//                     sx={{
//                       color: "white",
//                       ".MuiOutlinedInput-notchedOutline": {
//                         borderColor: alpha("#fff", 0.3),
//                       },
//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: alpha("#fff", 0.5),
//                       },
//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "white",
//                       },
//                       ".MuiSvgIcon-root": { color: "white" },
//                     }}
//                   >
//                     <MenuItem value="">All Months</MenuItem>
//                     {months.map((m) => (
//                       <MenuItem key={m.value} value={m.value}>
//                         {m.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 {/* Year */}
//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: "white" }}>Select Year</InputLabel>
//                   <Select
//                     value={year}
//                     label="Select Year"
//                     onChange={(e) => setYear(e.target.value)}
//                     sx={{
//                       color: "white",
//                       ".MuiOutlinedInput-notchedOutline": {
//                         borderColor: alpha("#fff", 0.3),
//                       },
//                       "&:hover .MuiOutlinedInput-notchedOutline": {
//                         borderColor: alpha("#fff", 0.5),
//                       },
//                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                         borderColor: "white",
//                       },
//                       ".MuiSvgIcon-root": { color: "white" },
//                     }}
//                   >
//                     <MenuItem value="">All Years</MenuItem>
//                     {years.map((y) => (
//                       <MenuItem key={y} value={y.toString()}>
//                         {y}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 {/* Buttons */}
//                 <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<FilterList />}
//                     disabled={loading}
//                     onClick={handleFilter}
//                     sx={{
//                       bgcolor: "white",
//                       color: "#667eea",
//                       fontWeight: "bold",
//                       flex: { xs: 1, sm: "none" },
//                     }}
//                   >
//                     Apply Filters
//                   </Button>

//                   <Button
//                     variant="outlined"
//                     disabled={loading}
//                     onClick={clearFilters}
//                     sx={{
//                       borderColor: "white",
//                       color: "white",
//                       flex: { xs: 1, sm: "none" },
//                       "&:hover": {
//                         bgcolor: alpha("#fff", 0.15),
//                       },
//                     }}
//                   >
//                     Clear All
//                   </Button>
//                 </Box>
//               </Box>
//             </Paper>
//           </Paper>
//         </Slide>

//         {/* -------------------------------------------------------
//            ERROR ALERT
//         --------------------------------------------------------- */}
//         <AnimatePresence>
//           {error && (
//             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//               <Alert
//                 severity="error"
//                 sx={{
//                   mb: 3,
//                   borderRadius: 3,
//                   boxShadow: "0 4px 12px rgba(244,67,54,.2)",
//                 }}
//                 onClose={() => setError("")}
//                 action={
//                   <Button color="inherit" size="small" onClick={() => fetchPayrolls()}>
//                     Retry
//                   </Button>
//                 }
//               >
//                 <strong>Error:</strong> {error}
//               </Alert>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* -------------------------------------------------------
//            SUCCESS ALERT
//         --------------------------------------------------------- */}
//         <AnimatePresence>
//           {successMessage && (
//             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
//               <Alert
//                 severity="success"
//                 sx={{
//                   mb: 3,
//                   borderRadius: 3,
//                   boxShadow: "0 4px 12px rgba(76,175,80,.2)",
//                 }}
//                 onClose={() => setSuccessMessage("")}
//               >
//                 <strong>Success:</strong> {successMessage}
//               </Alert>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* -------------------------------------------------------
//            SUMMARY CARDS
//         --------------------------------------------------------- */}
//         {summary && payrolls.length > 0 && (
//           <Zoom in timeout={900}>
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               {[
//                 {
//                   label: "Total Earnings",
//                   value: summary.totalEarnings,
//                   icon: <TrendingUp />,
//                   color: "success",
//                   description: "Gross earnings including bonuses",
//                 },
//                 {
//                   label: "Total Deductions",
//                   value: summary.totalDeductions,
//                   icon: <Savings />,
//                   color: "error",
//                   description: "Taxes and other deductions",
//                 },
//                 {
//                   label: "Net Salary",
//                   value: summary.netSalary,
//                   icon: <AccountBalanceWallet />,
//                   color: "primary",
//                   description: "Amount credited to your account",
//                 },
//                 {
//                   label: "YTD Earnings",
//                   value: summary.ytdEarnings,
//                   icon: <Analytics />,
//                   color: "info",
//                   description: "Year-to-date total earnings",
//                 },
//               ].map((item) => (
//                 <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.label}>
//                   <motion.div whileHover={{ scale: 1.05, y: -5 }}>
//                     <Card
//                       sx={{
//                         p: 3,
//                         textAlign: "center",
//                         borderRadius: 4,
//                         color: "white",
//                         position: "relative",
//                         boxShadow: "0 8px 20px rgba(0,0,0,.1)",
//                         background: (theme) => {
//                           const map = {
//                             success: `linear-gradient(135deg,${theme.palette.success.light},${theme.palette.success.main})`,
//                             error: `linear-gradient(135deg,${theme.palette.error.light},${theme.palette.error.main})`,
//                             primary: `linear-gradient(135deg,${theme.palette.primary.light},${theme.palette.primary.main})`,
//                             info: `linear-gradient(135deg,${theme.palette.info.light},${theme.palette.info.main})`,
//                           };
//                           return map[item.color as keyof typeof map];
//                         },
//                       }}
//                     >
//                       <Box sx={{ position: "relative", zIndex: 1 }}>
//                         <Avatar
//                           sx={{
//                             bgcolor: alpha("#fff", 0.2),
//                             width: 60,
//                             height: 60,
//                             mx: "auto",
//                             mb: 2,
//                           }}
//                         >
//                           {item.icon}
//                         </Avatar>

//                         <Typography variant="h4" fontWeight="800">
//                           {formatCurrency(item.value)}
//                         </Typography>

//                         <Typography variant="h6" fontWeight="600">
//                           {item.label}
//                         </Typography>

//                         <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                           {item.description}
//                         </Typography>
//                       </Box>
//                     </Card>
//                   </motion.div>
//                 </Grid>
//               ))}
//             </Grid>
//           </Zoom>
//         )}

//         {/* -------------------------------------------------------
//            TABS
//         --------------------------------------------------------- */}
//         <Paper sx={{ mb: 3, borderRadius: 3 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             sx={{
//               "& .MuiTab-root": {
//                 py: 2,
//                 fontWeight: 600,
//                 fontSize: "0.95rem",
//               },
//               "& .Mui-selected": {
//                 color: "#667eea !important",
//               },
//             }}
//             TabIndicatorProps={{
//               sx: {
//                 height: 3,
//                 bgcolor: "#667eea",
//                 borderRadius: 3,
//               },
//             }}
//           >
//             <Tab label="Payroll History" icon={<ReceiptLong />} iconPosition="start" />
//           </Tabs>
//         </Paper>
//         {/* -------------------------------------------------------
//            PAYROLL LIST
//         --------------------------------------------------------- */}
//         <TabPanel value={tabValue} index={0}>
//           <AnimatePresence>
//             {payrolls.length > 0 ? (
//               <Stack spacing={3}>
//                 {payrolls.map((payroll, index) => {
//                   const statusInfo = getStatusInfo(payroll.status);
//                   const dateObj = new Date(payroll.payroll_month);

//                   const monthYear = dateObj.toLocaleDateString("en-IN", {
//                     month: "long",
//                     year: "numeric",
//                   });

//                   const progressValue =
//                     payroll.status === "PAID"
//                       ? 100
//                       : payroll.status === "PROCESSING"
//                       ? 66
//                       : 33;

//                   return (
//                     <motion.div
//                       key={`${payroll.payroll_month}-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.08 }}
//                     >
//                       <Card
//                         sx={{
//                           borderRadius: 4,
//                           boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
//                           position: "relative",
//                           overflow: "visible",
//                           border: `1px solid ${alpha(
//                             theme.palette.primary.main,
//                             0.1
//                           )}`,
//                         }}
//                       >
//                         {/* FIXED: Status Chip Alignment */}
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             top: 16,
//                             right: 16,
//                             zIndex: 3,
//                             display: "flex",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Chip
//                             icon={<span>{statusInfo.icon}</span>}
//                             label={statusInfo.label}
//                             color={statusInfo.color as any}
//                             sx={{
//                               fontWeight: "bold",
//                               borderRadius: 2,
//                               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                             }}
//                           />
//                         </Box>

//                         <CardContent sx={{ p: 4 }}>
//                           {/* FIXED: Header alignment */}
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: { xs: "column", md: "row" },
//                               justifyContent: "space-between",
//                               alignItems: "flex-start",
//                               gap: 2,
//                               mb: 3,
//                             }}
//                           >
//                             <Box sx={{ flex: 1 }}>
//                               <Typography
//                                 variant="h5"
//                                 fontWeight="700"
//                                 gutterBottom
//                               >
//                                 <CalendarMonth
//                                   sx={{
//                                     mr: 1,
//                                     verticalAlign: "middle",
//                                     color: "primary.main",
//                                   }}
//                                 />
//                                 Payroll for {monthYear}
//                               </Typography>

//                               <Typography
//                                 variant="body2"
//                                 color="text.secondary"
//                               >
//                                 Processed on {formatDate(payroll.payroll_month)}
//                               </Typography>

//                               {/* FIXED: Progress Bar alignment */}
//                               <Box
//                                 sx={{
//                                   mt: 2,
//                                   width: { xs: "100%", md: 260 },
//                                 }}
//                               >
//                                 <LinearProgress
//                                   variant="determinate"
//                                   value={progressValue}
//                                   color={getProgressColor(payroll.status)}
//                                   sx={{
//                                     height: 6,
//                                     borderRadius: 3,
//                                     backgroundColor: alpha(
//                                       theme.palette[
//                                         getProgressColor(payroll.status)
//                                       ].main,
//                                       0.2
//                                     ),
//                                   }}
//                                 />
//                               </Box>
//                             </Box>

//                             <Button
//                               variant="outlined"
//                               startIcon={<Download />}
//                               onClick={() => downloadPayslip(payroll)}
//                               sx={{
//                                 borderRadius: 3,
//                                 fontWeight: "bold",
//                                 borderWidth: 2,
//                                 "&:hover": {
//                                   backgroundColor: alpha(
//                                     theme.palette.primary.main,
//                                     0.05
//                                   ),
//                                 },
//                               }}
//                             >
//                               Download Payslip
//                             </Button>
//                           </Box>

//                           <Divider sx={{ my: 3, opacity: 0.6 }} />

//                           {/* -------------------------------------------------------
//                                FIXED: Employee Info + Salary Breakdown Grid
//                           --------------------------------------------------------- */}
//                           <Grid container spacing={4} alignItems="flex-start">
//                             {/* LEFT COLUMN — Employee Information */}
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                               <Stack spacing={2} sx={{ width: "100%" }}>
//                                 <Typography
//                                   variant="h6"
//                                   fontWeight="600"
//                                   color="primary.main"
//                                 >
//                                   Employee Information
//                                 </Typography>

//                                 <List dense sx={{ width: "100%" }}>
//                                   <ListItem alignItems="flex-start">
//                                     <ListItemIcon sx={{ minWidth: 46 }}>
//                                       <Avatar
//                                         sx={{
//                                           width: 28,
//                                           height: 28,
//                                           bgcolor: "primary.light",
//                                         }}
//                                       >
//                                         💼
//                                       </Avatar>
//                                     </ListItemIcon>

//                                     <ListItemText
//                                       primary="Designation"
//                                       secondary={payroll.designation}
//                                       secondaryTypographyProps={{
//                                         fontWeight: 500,
//                                       }}
//                                     />
//                                   </ListItem>

//                                   <ListItem alignItems="flex-start">
//                                     <ListItemIcon sx={{ minWidth: 46 }}>
//                                       <Avatar
//                                         sx={{
//                                           width: 28,
//                                           height: 28,
//                                           bgcolor: "success.light",
//                                         }}
//                                       >
//                                         📅
//                                       </Avatar>
//                                     </ListItemIcon>

//                                     <ListItemText
//                                       primary="Join Date"
//                                       secondary={formatDate(
//                                         payroll.join_date
//                                       )}
//                                       secondaryTypographyProps={{
//                                         fontWeight: 500,
//                                       }}
//                                     />
//                                   </ListItem>
//                                 </List>
//                               </Stack>
//                             </Grid>

//                             {/* RIGHT COLUMN — Salary Breakdown */}
//                             <Grid size={{ xs: 12, sm: 6 }}>
//                               <Stack spacing={2} sx={{ width: "100%" }}>
//                                 <Typography
//                                   variant="h6"
//                                   fontWeight="600"
//                                   color="primary.main"
//                                 >
//                                   Salary Breakdown
//                                 </Typography>

//                                 <List dense sx={{ width: "100%" }}>
//                                   <ListItem>
//                                     <ListItemText primary="Basic Salary" />
//                                     <Typography fontWeight="700">
//                                       {formatCurrency(payroll.basic_salary)}
//                                     </Typography>
//                                   </ListItem>

//                                   <ListItem sx={{ color: "success.main" }}>
//                                     <ListItemText primary="Bonus & Allowances" />
//                                     <Typography fontWeight="700">
//                                       +{formatCurrency(payroll.bonus)}
//                                     </Typography>
//                                   </ListItem>

//                                   <ListItem sx={{ color: "error.main" }}>
//                                     <ListItemText primary="Deductions" />
//                                     <Typography fontWeight="700">
//                                       -{formatCurrency(payroll.deduction)}
//                                     </Typography>
//                                   </ListItem>

//                                   <Divider sx={{ my: 1 }} />

//                                   <ListItem>
//                                     <ListItemText
//                                       primary={
//                                         <Typography
//                                           variant="h6"
//                                           fontWeight="800"
//                                         >
//                                           Net Salary
//                                         </Typography>
//                                       }
//                                     />
//                                     <Typography
//                                       variant="h6"
//                                       fontWeight="800"
//                                       color="primary.main"
//                                     >
//                                       {formatCurrency(payroll.total)}
//                                     </Typography>
//                                   </ListItem>
//                                 </List>
//                               </Stack>
//                             </Grid>
//                           </Grid>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   );
//                 })}
//               </Stack>
//             ) : (
//               <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}>
//                 <Paper
//                   sx={{
//                     p: 8,
//                     textAlign: "center",
//                     borderRadius: 4,
//                     boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <CalendarMonth
//                     sx={{
//                       fontSize: 80,
//                       color: "text.secondary",
//                       opacity: 0.5,
//                       mb: 2,
//                     }}
//                   />

//                   <Typography
//                     variant="h4"
//                     fontWeight="300"
//                     color="text.secondary"
//                     gutterBottom
//                   >
//                     No Payroll Records Found
//                   </Typography>

//                   <Typography
//                     color="text.secondary"
//                     sx={{ mb: 3, maxWidth: 420, mx: "auto" }}
//                   >
//                     {month || year
//                       ? "No payroll data matches your filters. Try clearing them."
//                       : "You don't have any payroll records yet."}
//                   </Typography>

//                   {(month || year) && (
//                     <Button
//                       variant="contained"
//                       onClick={clearFilters}
//                       sx={{ borderRadius: 3, px: 4 }}
//                     >
//                       Clear All Filters
//                     </Button>
//                   )}
//                 </Paper>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </TabPanel>
//       </Box>
//     </Box>
//   );
// };

// export default EmployeePayroll;


import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Refresh,
  CalendarMonth,
  FilterList,
  AccountBalanceWallet,
  TrendingUp,
  Savings,
  ReceiptLong,
  Analytics,
  Download,
  Clear,
  Check,
} from "@mui/icons-material";

import { motion, AnimatePresence } from "framer-motion";

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

/* -------------------------------------------------------
   Types
--------------------------------------------------------- */
interface Payroll {
  designation: string;
  join_date: string;
  basic_salary: string;
  bonus: string;
  deduction: string;
  total: string;
  status: "PAID" | "PENDING" | "PROCESSING" | "CANCELLED";
  payroll_month: string;
}

interface PayrollSummary {
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  ytdEarnings: number;
  averageSalary: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payroll-tabpanel-${index}`}
      aria-labelledby={`payroll-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

/* -------------------------------------------------------
   Component Start
--------------------------------------------------------- */
const EmployeePayroll: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /* -------------------------------------------------------
     Year + Month Arrays
  --------------------------------------------------------- */
  const years = useMemo(
    () =>
      Array.from(
        { length: new Date().getFullYear() - 2019 },
        (_, i) => 2020 + i
      ).reverse(),
    []
  );

  const months = useMemo(
    () => [
      { value: "1", label: "January", short: "Jan" },
      { value: "2", label: "February", short: "Feb" },
      { value: "3", label: "March", short: "Mar" },
      { value: "4", label: "April", short: "Apr" },
      { value: "5", label: "May", short: "May" },
      { value: "6", label: "June", short: "Jun" },
      { value: "7", label: "July", short: "Jul" },
      { value: "8", label: "August", short: "Aug" },
      { value: "9", label: "September", short: "Sep" },
      { value: "10", label: "October", short: "Oct" },
      { value: "11", label: "November", short: "Nov" },
      { value: "12", label: "December", short: "Dec" },
    ],
    []
  );

  /* -------------------------------------------------------
     Summary Calculation
  --------------------------------------------------------- */
  const calculateSummary = useCallback((list: Payroll[]) => {
    const totalEarnings = list.reduce(
      (sum, p) => sum + Number(p.basic_salary) + Number(p.bonus),
      0
    );
    const totalDeductions = list.reduce(
      (sum, p) => sum + Number(p.deduction),
      0
    );
    const netSalary = list.reduce((sum, p) => sum + Number(p.total), 0);
    const ytdEarnings = list
      .filter(
        (p) =>
          new Date(p.payroll_month).getFullYear() === new Date().getFullYear()
      )
      .reduce((sum, p) => sum + Number(p.total), 0);

    const averageSalary = list.length > 0 ? netSalary / list.length : 0;

    setSummary({
      totalEarnings,
      totalDeductions,
      netSalary,
      ytdEarnings,
      averageSalary,
    });
  }, []);

  /* -------------------------------------------------------
     Fetch Payroll
  --------------------------------------------------------- */
  const fetchPayrolls = useCallback(
    async (filters?: { month?: string; year?: string }) => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please login again.");
          return;
        }

        let url = "http://localhost:5000/api/employee/payroll";
        const params = new URLSearchParams();

        if (filters?.month) params.append("month", filters.month);
        if (filters?.year) params.append("year", filters.year);

        if (params.toString()) url += `?${params}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          return;
        }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch payroll data");
        }

        const data = await res.json();

        if (data.success && data.payroll) {
          setPayrolls(data.payroll);
          calculateSummary(data.payroll);
          setSuccessMessage('Payroll data loaded successfully');
        } else {
          setPayrolls([]);
          setSummary(null);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [calculateSummary]
  );

  /* -------------------------------------------------------
     Download Payslip
  --------------------------------------------------------- */
  const downloadPayslip = async (payroll: Payroll) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const d = new Date(payroll.payroll_month);
      const month = (d.getMonth() + 1).toString();
      const year = d.getFullYear().toString();

      let url = "http://localhost:5000/api/employee/payroll/payslip";
      const params = new URLSearchParams();
      params.append("month", month);
      params.append("year", year);
      url += `?${params}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to download payslip");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `payslip_${d.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMessage("Payslip downloaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* -------------------------------------------------------
     Init
  --------------------------------------------------------- */
  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleTabChange = (_: any, v: number) => setTabValue(v);

  const handleFilter = () => {
    fetchPayrolls({ month, year });
    setSuccessMessage('Filters applied successfully');
  };

  const clearFilters = () => {
    setMonth("");
    setYear("");
    fetchPayrolls();
    setSuccessMessage('Filters cleared successfully');
  };

  /* -------------------------------------------------------
     Helpers
  --------------------------------------------------------- */
  const getStatusInfo = (status: string) => {
    const data = {
      PAID: { color: "success", label: "Paid", icon: "💳" },
      PENDING: { color: "warning", label: "Pending", icon: "⏳" },
      PROCESSING: { color: "info", label: "Processing", icon: "⚙️" },
      CANCELLED: { color: "error", label: "Cancelled", icon: "❌" },
    };
    return data[status as keyof typeof data];
  };

  const formatCurrency = (n: number | string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(Number(n));

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  // const getProgressColor = (status: string) => {
  //   if (status === "PAID") return "success";
  //   if (status === "PROCESSING") return "info";
  //   if (status === "PENDING") return "warning";
  //   return "error";
  // };

  /* -------------------------------------------------------
     Loading Screen
  --------------------------------------------------------- */
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
              Employee Payroll
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage and analyze your compensation details
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
              onClick={() => fetchPayrolls({ month, year })}
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
                Filter Payroll
              </Typography>
            </Box>
            <Chip
              label={`${payrolls.length} records`}
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
                  value={month}
                  label="Month"
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  value={year}
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value="">All Years</MenuItem>
                  {years.map((y) => (
                    <MenuItem key={y} value={y.toString()}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                <MotionButton
                  variant="contained"
                  startIcon={<Check />}
                  onClick={handleFilter}
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
          {(month || year) && (
            <Fade in>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Active Filters:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {month && (
                    <Chip
                      label={`Month: ${months.find(m => m.value === month)?.label}`}
                      size="small"
                      onDelete={() => setMonth('')}
                      color="primary"
                    />
                  )}
                  {year && (
                    <Chip
                      label={`Year: ${year}`}
                      size="small"
                      onDelete={() => setYear('')}
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
            </Fade>
          )}
        </MotionPaper>
      </Collapse>

      {/* Summary Cards */}
      {summary && payrolls.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              label: "Total Earnings",
              value: summary.totalEarnings,
              icon: <TrendingUp />,
              color: "success" as const,
              description: "Gross earnings including bonuses",
            },
            {
              label: "Total Deductions",
              value: summary.totalDeductions,
              icon: <Savings />,
              color: "error" as const,
              description: "Taxes and other deductions",
            },
            {
              label: "Net Salary",
              value: summary.netSalary,
              icon: <AccountBalanceWallet />,
              color: "primary" as const,
              description: "Amount credited to your account",
            },
            {
              label: "YTD Earnings",
              value: summary.ytdEarnings,
              icon: <Analytics />,
              color: "info" as const,
              description: "Year-to-date total earnings",
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.label}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  color: "white",
                  boxShadow: "0 8px 20px rgba(0,0,0,.1)",
                  background: (theme) => 
                    `linear-gradient(135deg, ${theme.palette[item.color].light}, ${theme.palette[item.color].main})`,
                }}
              >
                <CardContent sx={{ p: '0 !important' }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      width: 60,
                      height: 60,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography variant="h4" fontWeight="800">
                    {formatCurrency(item.value)}
                  </Typography>

                  <Typography variant="h6" fontWeight="600">
                    {item.label}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Main Content */}
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
        <CardContent sx={{ p: 3 }}>
          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                '& .MuiTab-root': {
                  py: 2,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                },
              }}
            >
              <Tab label="Payroll History" icon={<ReceiptLong />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Payroll List */}
          <TabPanel value={tabValue} index={0}>
            <AnimatePresence>
              {payrolls.length > 0 ? (
                <Stack spacing={3}>
                  {payrolls.map((payroll, index) => {
                    const statusInfo = getStatusInfo(payroll.status);
                    const dateObj = new Date(payroll.payroll_month);

                    const monthYear = dateObj.toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    });

                    return (
                      <MotionCard
                        key={`${payroll.payroll_month}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        sx={{
                          borderRadius: 3,
                          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                          border: `1px solid rgba(102,126,234,0.1)`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Header */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h5" fontWeight="700" gutterBottom>
                                <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                                Payroll for {monthYear}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Processed on {formatDate(payroll.payroll_month)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                icon={<span>{statusInfo.icon}</span>}
                                label={statusInfo.label}
                                color={statusInfo.color as any}
                                sx={{ fontWeight: 'bold', borderRadius: 1 }}
                              />
                              <MotionButton
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={() => downloadPayslip(payroll)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                              >
                                Download
                              </MotionButton>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 3 }} />

                          {/* Content Grid */}
                          <Grid container spacing={3}>
                            {/* Employee Information */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Card sx={{ p: 2, backgroundColor: 'rgba(102,126,234,0.1)', borderRadius: 2 }}>
                                <CardContent sx={{ p: '0 !important' }}>
                                  <Typography variant="h6" fontWeight="600" color="primary.main" gutterBottom>
                                    Employee Information
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }}>
                                          💼
                                        </Avatar>
                                      </ListItemIcon>
                                      <ListItemText
                                        primary="Designation"
                                        secondary={payroll.designation}
                                        secondaryTypographyProps={{ fontWeight: 500 }}
                                      />
                                    </ListItem>
                                    <ListItem>
                                      <ListItemIcon>
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'success.light' }}>
                                          📅
                                        </Avatar>
                                      </ListItemIcon>
                                      <ListItemText
                                        primary="Join Date"
                                        secondary={formatDate(payroll.join_date)}
                                        secondaryTypographyProps={{ fontWeight: 500 }}
                                      />
                                    </ListItem>
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>

                            {/* Salary Breakdown */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Card sx={{ p: 2, backgroundColor: 'rgba(118,75,162,0.1)', borderRadius: 2 }}>
                                <CardContent sx={{ p: '0 !important' }}>
                                  <Typography variant="h6" fontWeight="600" color="primary.main" gutterBottom>
                                    Salary Breakdown
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemText primary="Basic Salary" />
                                      <Typography fontWeight="700">{formatCurrency(payroll.basic_salary)}</Typography>
                                    </ListItem>
                                    <ListItem sx={{ color: 'success.main' }}>
                                      <ListItemText primary="Bonus & Allowances" />
                                      <Typography fontWeight="700">+{formatCurrency(payroll.bonus)}</Typography>
                                    </ListItem>
                                    <ListItem sx={{ color: 'error.main' }}>
                                      <ListItemText primary="Deductions" />
                                      <Typography fontWeight="700">-{formatCurrency(payroll.deduction)}</Typography>
                                    </ListItem>
                                    <Divider sx={{ my: 1 }} />
                                    <ListItem>
                                      <ListItemText primary={<Typography variant="h6" fontWeight="800">Net Salary</Typography>} />
                                      <Typography variant="h6" fontWeight="800" color="primary.main">
                                        {formatCurrency(payroll.total)}
                                      </Typography>
                                    </ListItem>
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </MotionCard>
                    );
                  })}
                </Stack>
              ) : (
                <MotionCard
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}
                >
                  <CalendarMonth sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h4" fontWeight="300" color="text.secondary" gutterBottom>
                    No Payroll Records Found
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {month || year
                      ? "No payroll data matches your filters. Try clearing them."
                      : "You don't have any payroll records yet."}
                  </Typography>
                  {(month || year) && (
                    <Button variant="contained" onClick={clearFilters} sx={{ borderRadius: 2 }}>
                      Clear All Filters
                    </Button>
                  )}
                </MotionCard>
              )}
            </AnimatePresence>
          </TabPanel>
        </CardContent>
      </MotionPaper>
    </Box>
  );
};

export default EmployeePayroll;