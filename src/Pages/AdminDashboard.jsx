import React, { useState } from 'react';
import PropertyUpload from '../Components/Admin/PropertyUpload';
import RegistrationManagement from '../Components/Admin/RegistrationManagement';
import { FileSpreadsheet, Users, Home } from 'lucide-react';
import api from '../Utils/axios';
import { useEffect } from 'react';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b mb-6">
      <TabButton
        icon={<Home />}
        label="Dashboard"
        isActive={activeTab === 'dashboard'}
        onClick={() => setActiveTab('dashboard')}
      />
      <TabButton
        icon={<FileSpreadsheet />}
        label="Property Upload"
        isActive={activeTab === 'properties'}
        onClick={() => setActiveTab('properties')}
      />
      <TabButton
        icon={<Users />}
        label="Registration Management"
        isActive={activeTab === 'registrations'}
        onClick={() => setActiveTab('registrations')}
      />
    </div>
  );

  // Tab button component
  const TabButton = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
        isActive 
          ? 'border-primary text-primary font-medium' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Dashboard content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview />;
      case 'properties':
        return <PropertyUpload />;
      case 'registrations':
        return <RegistrationManagement />;
      default:
        return <PropertyUpload />;
    }
  };

  // Simple placeholder for dashboard overview
 // Inside your AdminDashboard.jsx
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingRegistrations: 0,
    activeAuctions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard-stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard statistics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      {loading ? (
        <div className="flex justify-center p-4">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="Total Properties" value={stats.totalProperties} />
          <DashboardCard title="Pending Registrations" value={stats.pendingRegistrations} />
          <DashboardCard title="Active Auctions" value={stats.activeAuctions} />
        </div>
      )}
    </div>
  );
};

  // Dashboard card component
  const DashboardCard = ({ title, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <TabNavigation />
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;