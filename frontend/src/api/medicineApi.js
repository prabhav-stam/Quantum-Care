import axiosInstance from './axios';

export const getAllMedicines = async () => {
  const response = await axiosInstance.get('/inventory/medicines');
  return response.data;
};

export const getLowStockMedicines = async () => {
  const response = await axiosInstance.get('/inventory/medicines/low-stock');
  return response.data;
};

export const addMedicine = async (data) => {
  const response = await axiosInstance.post('/inventory/medicines', data);
  return response.data;
};

export const addStock = async (id, quantity, userId) => {
  const response = await axiosInstance.post(`/inventory/medicines/${id}/add-stock`, null, {
    params: { quantity, userId }
  });
  return response.data;
};

export const dispenseStock = async (id, quantity, userId, notes) => {
  const response = await axiosInstance.post(`/inventory/medicines/${id}/dispense`, null, {
    params: { quantity, userId, notes }
  });
  return response.data;
};
