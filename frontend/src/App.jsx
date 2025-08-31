
// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ No Router here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from "./Components/Auth/LoginPage";
import SignupPage from "./Components/Auth/SignupPage";
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import MinimalLoginTest from "./Components/Auth/MinimalLoginTest "

import Dashboard from './Pages/App/Dashboard';
import HabitsPage from './Pages/App/HabitsPage';
import GoalsPage from './Pages/App/GoalsPage';

import SettingsPage from './Pages/App/SettingsPage';

import AppLayout from './Components/Layouts/AppLayout';

import { AuthProvider } from './Components/Auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
         {/* <Route path="/login" element={<MinimalLoginTest />} />  */}

        {/* Protected routes with layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="goals" element={<GoalsPage />} />
        
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import LoginPage from "./Components/Auth/LoginPage";
// import SignupPage from "./Components/Auth/SignupPage";


// import Dashboard from './Pages/App/Dashboard';
// import HabitsPage from './Pages/App/HabitsPage';
// import GoalsPage from './Pages/App/GoalsPage';
// import AnalyticsPage from './Pages/App/AnalyticsPage';
// import SettingsPage from './Pages/App/SettingsPage';

// import ProtectedRoute from './Components/Auth/ProtectedRoute';

// function App() {
  
//   // Example usage of toast
//   const notifySuccess = (msg) => toast.success(msg);
//   const notifyError = (msg) => toast.error(msg);

//   // You can call these notify functions anywhere, e.g., after API success/error

//   return (
//     <Router>
//       <ToastContainer 
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <Routes>
//         {/* Public routes */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* Protected routes */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/habits" 
//           element={
//             <ProtectedRoute>
//               <HabitsPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/goals" 
//           element={
//             <ProtectedRoute>
//               <GoalsPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/analytics" 
//           element={
//             <ProtectedRoute>
//               <AnalyticsPage />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/settings" 
//           element={
//             <ProtectedRoute>
//               <SettingsPage />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Redirect root to dashboard */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         {/* Redirect all unknown routes to login */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


//  :// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import LoginPage from './Components/Auth/LoginPage';
// import SignupPage from './Components/Auth/SignupPage';
// import Dashboard from '../src/Pages/App/Dashboard';
// import ProtectedRoute from './Components/Auth/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

