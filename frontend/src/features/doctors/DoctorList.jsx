import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../../api/doctorApi';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import styles from './DoctorList.module.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val ? 'success' : 'default'}>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Doctors Directory</h1>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Card>
        <DataTable
          columns={columns}
          data={doctors}
          loading={loading}
          emptyMessage="No doctors found in the system."
          onRowClick={(doctor) => navigate(`/doctors/${doctor.id}`)}
        />
      </Card>
    </div>
  );
};

export default DoctorList;
