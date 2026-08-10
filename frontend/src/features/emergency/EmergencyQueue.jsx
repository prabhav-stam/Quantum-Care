import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveQueue, getActiveQueueForDoctor, updateQueueStatus } from '../../api/emergencyQueueApi';
import { getDoctorByUserId } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import styles from './EmergencyQueue.module.css';

const EmergencyQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const navigate = useNavigate();

  const fetchQueue = async () => {
    try {
      let data = [];
      if (user.role === 'DOCTOR') {
        let doc = doctorProfile;
        if (!doc) {
          doc = await getDoctorByUserId(user.id);
          setDoctorProfile(doc);
        }
        data = await getActiveQueueForDoctor(doc.id);
      } else {
        data = await getActiveQueue();
      }
      setQueue(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load emergency queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQueue();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchQueue, 30000);
      return () => clearInterval(interval);
    }
  }, [user, doctorProfile]);

  const handleStatusChange = async (id, status) => {
    try {
      let doctorId = null;
      let doctorName = null;
      if (user.role === 'DOCTOR' && status === 'IN_PROGRESS' && doctorProfile) {
        doctorId = doctorProfile.id;
        doctorName = `Dr. ${doctorProfile.firstName} ${doctorProfile.lastName}`;
      }
      await updateQueueStatus(id, status, doctorId, doctorName);
      await fetchQueue();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL': return <Badge variant="danger">CRITICAL</Badge>;
      case 'URGENT': return <Badge variant="warning">URGENT</Badge>;
      case 'NORMAL': return <Badge variant="info">NORMAL</Badge>;
      default: return <Badge variant="default">{priority}</Badge>;
    }
  };

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'symptoms', label: 'Symptoms' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val) => getPriorityBadge(val)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => <Badge variant={val === 'IN_PROGRESS' ? 'warning' : 'default'}>{val}</Badge>
    },
    { 
      key: 'checkedInAt', 
      label: 'Checked In',
      render: (val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    { key: 'assignedDoctorName', label: 'Doctor' }
  ];

  if (user.role === 'DOCTOR' || user.role === 'ADMIN') {
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className={styles.actions}>
          {row.status === 'WAITING' && user.role === 'DOCTOR' && (
            <Button size="small" onClick={(e) => { e.stopPropagation(); handleStatusChange(row.id, 'IN_PROGRESS'); }}>
              Start Treatment
            </Button>
          )}
          {row.status === 'IN_PROGRESS' && user.role === 'DOCTOR' && (
            <Button size="small" variant="success" onClick={(e) => { e.stopPropagation(); handleStatusChange(row.id, 'COMPLETED'); }}>
              Complete
            </Button>
          )}
        </div>
      )
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Emergency Queue</h1>
        {(user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && (
          <Button onClick={() => navigate('/receptionist/emergency-triage')}>
            Add to Queue (Triage)
          </Button>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Card>
        <DataTable
          columns={columns}
          data={queue}
          loading={loading}
          emptyMessage="No active patients in emergency queue."
          onRowClick={(entry) => console.log('Entry clicked', entry)}
        />
      </Card>
    </div>
  );
};

export default EmergencyQueue;
