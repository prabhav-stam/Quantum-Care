import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllMedicines } from '../../api/medicineApi';
import { DataTable } from '../../components/DataTable/DataTable';
import { Card } from '../../components/Card/Card';
import { Badge } from '../../components/Badge/Badge';

const MedicineList = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await getAllMedicines();
        setMedicines(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const columns = [
    { key: 'name', label: 'Medicine Name' },
    { key: 'category', label: 'Category' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { 
      key: 'stockQuantity', 
      label: 'Stock',
      render: (val, row) => (
        <Badge variant={val <= row.reorderLevel ? 'danger' : 'success'}>
          {val}
        </Badge>
      )
    },
    { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val.toFixed(2)}` },
  ];

  if (error) return <div style={{color: 'var(--color-critical)'}}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>Pharmacy Inventory</h1>
      </div>
      
      <Card>
        <DataTable
          columns={columns}
          data={medicines}
          loading={loading}
          emptyMessage="No medicines found in inventory."
        />
      </Card>
    </div>
  );
};

export default MedicineList;
