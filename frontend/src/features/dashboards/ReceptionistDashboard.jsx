import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card/Card';

const ReceptionistDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
        Welcome, {user.firstName} (Receptionist)
      </h1>
      
      <Card>
        <h2>Quick Actions</h2>
        <p>Use the sidebar to register patients, book appointments, or add patients to the emergency triage.</p>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;
