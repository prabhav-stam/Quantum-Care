import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientByUserId } from '../../api/patientApi';
import { getMedicalRecordsByPatientId } from '../../api/medicalRecordApi';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';

const MedicalRecordList = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        let patientId;
        if (user.role === 'PATIENT') {
          const pat = await getPatientByUserId(user.id);
          patientId = pat.id;
        } else {
          // If this is viewed by a doctor, they might see it nested in a patient detail view
          // For now, if no specific patient is selected, this might just error or we handle it
          // Wait, this page is mainly for Patient view right now, or doctor viewing a specific patient.
          setLoading(false);
          return;
        }
        
        const data = await getMedicalRecordsByPatientId(patientId);
        setRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user]);

  const columns = [
    { key: 'visitDate', label: 'Visit Date' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'treatmentNotes', label: 'Treatment Notes' },
  ];

  if (error) return <div style={{color: 'var(--color-critical)'}}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Medical Records</h1>
      
      <Card>
        <DataTable
          columns={columns}
          data={records}
          loading={loading}
          emptyMessage="No medical records found."
        />
      </Card>
    </div>
  );
};

export default MedicalRecordList;
