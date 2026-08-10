import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctor, updateDoctor } from '../../api/doctorApi';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import { Badge } from '../../components/Badge/Badge';
import styles from './DoctorDetail.module.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctor(id);
        setDoctor(data);
        setFormData({
          specialization: data.specialization || '',
          qualification: data.qualification || '',
          licenseNumber: data.licenseNumber || '',
          consultationFee: data.consultationFee || 0,
          yearsOfExperience: data.yearsOfExperience || 0,
          isActive: data.active !== false
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    try {
      const updated = await updateDoctor(id, formData);
      setDoctor(updated);
      setIsEditing(false);
      setSuccessMessage('Doctor details updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update doctor details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading doctor details...</div>;
  if (!doctor) return <div className={styles.error}>{error || 'Doctor not found'}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Dr. {doctor.firstName} {doctor.lastName}
            <span style={{ marginLeft: '12px', verticalAlign: 'middle' }}>
              <Badge variant={doctor.active ? 'success' : 'default'}>
                {doctor.active ? 'Active' : 'Inactive'}
              </Badge>
            </span>
          </h1>
          <p className={styles.subtitle}>{doctor.email} | {doctor.specialization}</p>
        </div>
        <div>
          <Button variant="secondary" onClick={() => navigate('/doctors')} style={{ marginRight: '8px' }}>Back</Button>
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
              <h3>Professional Information</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Specialization:</span>
                <span className={styles.infoValue}>{doctor.specialization || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Qualification:</span>
                <span className={styles.infoValue}>{doctor.qualification || 'Not provided'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>License No:</span>
                <span className={styles.infoValue}>{doctor.licenseNumber || 'Not provided'}</span>
              </div>
            </div>
            <div className={styles.infoSection}>
              <h3>Practice Details</h3>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Experience (Yrs):</span>
                <span className={styles.infoValue}>{doctor.yearsOfExperience || '0'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Consultation Fee:</span>
                <span className={styles.infoValue}>${doctor.consultationFee?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.formGrid}>
            <FormField label="Specialization">
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
            </FormField>
            
            <FormField label="Qualification">
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
            </FormField>

            <FormField label="License Number">
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
            </FormField>

            <FormField label="Years of Experience">
              <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} min="0" />
            </FormField>

            <FormField label="Consultation Fee ($)">
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} min="0" step="0.01" />
            </FormField>

            <FormField label="Active Status">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  style={{ width: 'auto' }}
                />
                Doctor is currently active
              </label>
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

export default DoctorDetail;
