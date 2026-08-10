import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientByUserId, getPatients } from '../../api/patientApi';
import { getBillsByPatientId, getAllBills, updatePaymentStatus, generateBill } from '../../api/billApi';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { FormField } from '../../components/FormField/FormField';

const BillList = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [patients, setPatients] = useState([]);
  const [creating, setCreating] = useState(false);

  // New Bill Form State
  const [formData, setFormData] = useState({
    patientId: '',
    totalAmount: '',
    imageBase64: ''
  });

  const fetchBills = async () => {
    try {
      setLoading(true);
      let data = [];
      if (user.role === 'PATIENT') {
        const pat = await getPatientByUserId(user.id);
        data = await getBillsByPatientId(pat.id);
      } else {
        // RECEPTIONIST or ADMIN
        data = await getAllBills();
        if (user.role === 'RECEPTIONIST' || user.role === 'ADMIN') {
          const allPatients = await getPatients();
          setPatients(allPatients);
        }
      }
      setBills(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [user]);

  const handlePayment = async (id) => {
    try {
      await updatePaymentStatus(id, 'PAID');
      await fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    }
  };

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

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      
      const newBill = {
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        billDate: new Date().toISOString().split('T')[0],
        totalAmount: parseFloat(formData.totalAmount),
        netAmount: parseFloat(formData.totalAmount), // Assuming no discount/tax for simple entry
        billImageBase64: formData.imageBase64,
        items: [] 
      };

      await generateBill(newBill);
      setIsCreateModalOpen(false);
      setFormData({ patientId: '', totalAmount: '', imageBase64: '' });
      fetchBills();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: 'billDate', label: 'Date' },
    { key: 'patientName', label: 'Patient Name' },
    { 
      key: 'netAmount', 
      label: 'Amount',
      render: (val) => `$${val?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'paymentStatus', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'PAID' ? 'success' : val === 'PENDING' ? 'warning' : 'default'}>
          {val}
        </Badge>
      )
    },
    { 
      key: 'billImageBase64', 
      label: 'Attachment',
      render: (val) => val ? (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(val);
            setIsImageModalOpen(true);
          }}
        >
          View Bill
        </Button>
      ) : (
        <span style={{ color: 'var(--color-text-muted)' }}>None</span>
      )
    }
  ];

  if (user.role === 'RECEPTIONIST' || user.role === 'ADMIN') {
    columns.push({
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        row.paymentStatus === 'PENDING' ? (
          <Button size="small" onClick={(e) => { e.stopPropagation(); handlePayment(row.id); }}>
            Mark as Paid
          </Button>
        ) : null
      )
    });
  }

  if (error) return <div style={{color: 'var(--color-critical)'}}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Billing</h1>
        {(user.role === 'RECEPTIONIST' || user.role === 'ADMIN') && (
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Bill</Button>
        )}
      </div>
      
      <Card>
        <DataTable
          columns={columns}
          data={bills}
          loading={loading}
          emptyMessage="No bills found."
        />
      </Card>

      {/* Create Bill Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => !creating && setIsCreateModalOpen(false)}
        title="Create New Bill"
      >
        <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          <FormField label="Total Amount ($)" required>
            <input 
              type="number"
              step="0.01"
              value={formData.totalAmount} 
              onChange={e => setFormData({...formData, totalAmount: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </FormField>

          <FormField label="Upload Physical Bill Image">
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
            <Button type="submit" loading={creating} disabled={!formData.patientId || !formData.totalAmount}>
              Save Bill
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Bill Image"
      >
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Bill" 
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} 
          />
        )}
      </Modal>
    </div>
  );
};

export default BillList;
