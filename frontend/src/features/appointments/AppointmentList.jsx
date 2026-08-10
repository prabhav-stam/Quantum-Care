import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAppointments, 
  getAppointmentsByPatient, 
  getAppointmentsByDoctor 
} from '../../api/appointmentApi';
import { getPatientByUserId } from '../../api/patientApi';
import { getDoctorByUserId } from '../../api/doctorApi';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import styles from './AppointmentList.module.css';

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        let data = [];
        if (user.role === 'PATIENT') {
          const patient = await getPatientByUserId(user.id);
          data = await getAppointmentsByPatient(patient.id);
        } else if (user.role === 'DOCTOR') {
          const doctor = await getDoctorByUserId(user.id);
          data = await getAppointmentsByDoctor(doctor.id);
        } else {
          // ADMIN or RECEPTIONIST
          data = await getAppointments();
        }
        
        // Sort by date and time descending
        data.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
          return dateB - dateA; // Newest first
        });
        
        setAppointments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED': return <Badge variant="info">Scheduled</Badge>;
      case 'CHECKED_IN': return <Badge variant="warning">Checked In</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">In Progress</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const columns = [
    { key: 'appointmentDate', label: 'Date' },
    { key: 'appointmentTime', label: 'Time' },
    { 
      key: 'patientName', 
      label: 'Patient',
      // Only show patient name if not logged in as that patient
      render: (val) => user.role === 'PATIENT' ? 'You' : val
    },
    { 
      key: 'doctorName', 
      label: 'Doctor',
      // Only show doctor name if not logged in as that doctor
      render: (val) => user.role === 'DOCTOR' ? 'You' : val
    },
    { key: 'reason', label: 'Reason' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => getStatusBadge(val)
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        {(user.role === 'PATIENT' || user.role === 'RECEPTIONIST') && (
          <Button onClick={() => navigate(user.role === 'PATIENT' ? '/patient/book-appointment' : '/receptionist/book-appointment')}>
            Book Appointment
          </Button>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Card>
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          emptyMessage="No appointments found."
          onRowClick={(appointment) => {
            // For now, no detail page, just log it. You could navigate to an appointment detail page if it existed.
            console.log('Clicked appointment:', appointment);
          }}
        />
      </Card>
    </div>
  );
};

export default AppointmentList;
