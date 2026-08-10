import axiosInstance from './axios';

export const generateBill = async (data) => {
  const response = await axiosInstance.post('/bills', data);
  return response.data;
};

export const getAllBills = async () => {
  const response = await axiosInstance.get('/bills');
  return response.data;
};

export const getBillsByPatientId = async (patientId) => {
  const response = await axiosInstance.get(`/bills/patient/${patientId}`);
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await axiosInstance.put(`/bills/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};
