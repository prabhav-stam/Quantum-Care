import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card/Card';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
        Welcome, {user.firstName} {user.lastName}
      </h1>
      
      <Card>
        <h2>Your Dashboard</h2>
        <p>Use the sidebar to view your appointments, prescriptions, and medical records.</p>
      </Card>
    </div>
  );
};

export default PatientDashboard;
