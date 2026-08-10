import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToEmergencyQueue } from '../../api/emergencyQueueApi';
import { getPatients } from '../../api/patientApi';
import { getDoctors } from '../../api/doctorApi';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import styles from './EmergencyTriage.module.css';

const EmergencyTriage = () => {
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '', // Could be filled manually if patient is not registered
    symptoms: '',
    priority: 'NORMAL',
    triageNotes: '',
    assignedDoctorId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pats, docs] = await Promise.all([
          getPatients(),
          getDoctors()
        ]);
        setPatients(pats);
        setDoctors(docs.filter(d => d.active));
      } catch (err) {
        setError('Failed to load required data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If patient is selected from list, auto-fill name
    if (name === 'patientId' && value) {
      const pat = patients.find(p => p.id === value);
      if (pat) {
        setFormData({ ...formData, [name]: value, patientName: `${pat.firstName} ${pat.lastName}` });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      let docName = null;
      if (formData.assignedDoctorId) {
        const doc = doctors.find(d => d.id === formData.assignedDoctorId);
        if (doc) docName = `Dr. ${doc.firstName} ${doc.lastName}`;
      }
      
      const payload = {
        patientId: formData.patientId || null,
        patientName: formData.patientName,
        symptoms: formData.symptoms,
        priority: formData.priority,
        triageNotes: formData.triageNotes,
        assignedDoctorId: formData.assignedDoctorId || null,
        assignedDoctorName: docName
      };
      
      await addToEmergencyQueue(payload);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to emergency queue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Emergency Triage</h1>
        <p className={styles.subtitle}>Add a patient to the emergency queue</p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Card>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <FormField label="Registered Patient (Optional)">
              <select name="patientId" value={formData.patientId} onChange={handleChange}>
                <option value="">-- Unregistered Patient / Emergency Walk-in --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.phone}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Patient Name" required>
            <input 
              type="text" 
              name="patientName" 
              value={formData.patientName} 
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </FormField>

          <FormField label="Priority Level" required>
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="NORMAL">Normal (Non-Life Threatening)</option>
              <option value="URGENT">Urgent (Requires Prompt Attention)</option>
              <option value="CRITICAL">Critical (Life Threatening)</option>
            </select>
          </FormField>

          <div className={styles.fullWidth}>
            <FormField label="Primary Symptoms" required>
              <input 
                type="text" 
                name="symptoms" 
                value={formData.symptoms} 
                onChange={handleChange}
                placeholder="e.g. Chest pain, difficulty breathing"
                required
              />
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField label="Triage Notes">
              <textarea 
                name="triageNotes" 
                value={formData.triageNotes} 
                onChange={handleChange}
                placeholder="Vitals, initial assessment details"
                rows={3}
              />
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField label="Assign Doctor (Optional)">
              <select name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleChange}>
                <option value="">-- Unassigned (Next Available) --</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization})</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className={styles.formActions}>
            <Button variant="ghost" type="button" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Add to Queue
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmergencyTriage;
