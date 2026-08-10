import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientByUserId, getPatients } from '../../api/patientApi';
import { getDoctorByUserId } from '../../api/doctorApi';
import { getPrescriptionsByPatientId, getPrescriptionsByDoctor, createPrescription } from '../../api/prescriptionApi';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { FormField } from '../../components/FormField/FormField';

const PrescriptionList = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [creating, setCreating] = useState(false);
  
  // New Prescription Form State
  const [formData, setFormData] = useState({
    patientId: '',
    notes: '',
    imageBase64: ''
  });

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      let data = [];
      if (user.role === 'PATIENT') {
        const pat = await getPatientByUserId(user.id);
        data = await getPrescriptionsByPatientId(pat.id);
      } else if (user.role === 'DOCTOR') {
        const doc = await getDoctorByUserId(user.id);
        data = await getPrescriptionsByDoctor(doc.id);
        
        // Also fetch patients for the dropdown
        const allPatients = await getPatients();
        setPatients(allPatients);
      } else {
        // Fallback for Admin/Receptionist if they view this page
        setLoading(false);
        return;
      }
      setPrescriptions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const doc = await getDoctorByUserId(user.id);
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      
      const newPrescription = {
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        doctorId: doc.id,
        doctorName: `Dr. ${doc.lastName}`,
        notes: formData.notes,
        prescriptionImageBase64: formData.imageBase64,
        items: [] // Can be expanded later for digital items
      };

      await createPrescription(newPrescription);
      setIsCreateModalOpen(false);
      setFormData({ patientId: '', notes: '', imageBase64: '' });
      fetchPrescriptions(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: 'prescriptionDate', label: 'Date' },
    { 
      key: user.role === 'PATIENT' ? 'doctorName' : 'patientName', 
      label: user.role === 'PATIENT' ? 'Doctor' : 'Patient' 
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'ACTIVE' ? 'success' : val === 'CANCELLED' ? 'danger' : 'default'}>
          {val}
        </Badge>
      )
    },
    { key: 'notes', label: 'Notes' },
    { 
      key: 'prescriptionImageBase64', 
      label: 'Attachment',
      render: (val) => val ? (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => {
            setSelectedImage(val);
            setIsImageModalOpen(true);
          }}
        >
          View Image
        </Button>
      ) : (
        <span style={{ color: 'var(--color-text-muted)' }}>None</span>
      )
    }
  ];

  if (error) return <div style={{color: 'var(--color-critical)'}}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Prescriptions</h1>
        {user.role === 'DOCTOR' && (
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Prescription</Button>
        )}
      </div>
      
      <Card>
        <DataTable
          columns={columns}
          data={prescriptions}
          loading={loading}
          emptyMessage="No prescriptions found."
        />
      </Card>

      {/* Create Prescription Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => !creating && setIsCreateModalOpen(false)}
        title="Create New Prescription"
      >
        <form onSubmit={handleCreatePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Select Patient" required>
            <select 
              value={formData.patientId} 
              onChange={e => setFormData({...formData, patientId: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            >
              <option value="">-- Choose a Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Notes / Diagnosis">
            <textarea 
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})}
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </FormField>

          <FormField label="Upload Physical Prescription Image">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ width: '100%', padding: '8px', border: '1px dashed var(--color-border)', borderRadius: '4px' }}
            />
            {formData.imageBase64 && (
              <img src={formData.imageBase64} alt="Preview" style={{ marginTop: '10px', maxHeight: '150px', objectFit: 'contain' }} />
            )}
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" loading={creating} disabled={!formData.patientId}>
              Save Prescription
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Prescription Image"
      >
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Prescription" 
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} 
          />
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionList;
