import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, updatePatient } from '../../api/patientApi';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import styles from './PatientDetail.module.css';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatient(id);
        setPatient(data);
        setFormData({
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          address: data.address || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    try {
      const updated = await updatePatient(id, formData);
      setPatient(updated);
      setIsEditing(false);
      setSuccessMessage('Patient details updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update patient details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading patient details...</div>;
  if (!patient) return <div className={styles.error}>{error || 'Patient not found'}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{patient.firstName} {patient.lastName}</h1>
          <p className={styles.subtitle}>{patient.email} | {patient.phone}</p>
        </div>
        <div>
          <Button variant="secondary" onClick={() => navigate('/patients')} style={{ marginRight: '8px' }}>Back</Button>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      <Card>
        {!isEditing ? (
          <div className={styles.grid}>
            <div className={styles.infoSection}>
              <h3>Personal Information</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Date of Birth:</span>
                <span className={styles.infoValue}>{patient.dateOfBirth || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Gender:</span>
                <span className={styles.infoValue}>{patient.gender || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Blood Group:</span>
                <span className={styles.infoValue}>{patient.bloodGroup || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Address:</span>
                <span className={styles.infoValue}>{patient.address || 'Not provided'}</span>
              </div>
            </div>
            <div className={styles.infoSection}>
              <h3>Emergency Contact</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Name:</span>
                <span className={styles.infoValue}>{patient.emergencyContactName || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{patient.emergencyContactPhone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.formGrid}>
            <FormField label="Date of Birth">
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </FormField>
            
            <FormField label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </FormField>

            <FormField label="Blood Group">
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+, A-" />
            </FormField>

            <FormField label="Address">
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </FormField>

            <FormField label="Emergency Contact Name">
              <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
            </FormField>

            <FormField label="Emergency Contact Phone">
              <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />
            </FormField>

            <div className={styles.formActions}>
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientDetail;
