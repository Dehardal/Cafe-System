import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import DashboardLayout from '@/layouts/DashboardLayout';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import OwnerDashboard from '@/pages/OwnerDashboard';
import PrintQueue from '@/pages/PrintQueue';
import HistoryPage from '@/pages/HistoryPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';
import CustomerUpload from '@/pages/CustomerUpload';
import ProtectedRoute from '@/components/ProtectedRoute';

import type { RootState } from '@/redux/store';
import { connectSocket, disconnectSocket } from '@/services/socket';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      connectSocket(user._id);
    } else {
      disconnectSocket();
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />

        {/* Protected Dashboard Area */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/queue" element={<PrintQueue />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Customer Facing Pages */}
        <Route path="/upload/:ownerId" element={<CustomerUpload />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass text-sm font-medium',
          duration: 4000,
        }}
      />
    </Router>
  );
}

export default App;
