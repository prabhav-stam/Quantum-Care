import React, { useEffect, useState } from 'react';
import { getAdminDashboardStats } from '../../api/dashboardApi';
import { StatCard } from '../../components/StatCard/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'var(--color-critical)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard title="Total Patients" value={stats.totalPatients} />
        <StatCard title="Total Doctors" value={stats.totalDoctors} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} />
        <StatCard title="Total Bills Generated" value={stats.totalBills} />
      </div>
    </div>
  );
};

export default AdminDashboard;
