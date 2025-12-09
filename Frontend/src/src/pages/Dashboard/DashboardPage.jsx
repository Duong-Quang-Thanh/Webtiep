import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  
  // Nếu là Admin hoặc HR -> Render AdminDashboard
  // Nếu là Staff -> Render EmployeeDashboard
  
  if (user?.role === 'admin' || user?.role === 'hr') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
};

export default DashboardPage;