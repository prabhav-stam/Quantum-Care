import axiosInstance from './axios';

export const getPrescriptionsByPatientId = async (patientId) => {
  const response = await axiosInstance.get(`/prescriptions/patient/${patientId}`);
  return response.data;
};

export const getPrescriptionsByDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/prescriptions/doctor/${doctorId}`);
  return response.data;
};

export const createPrescription = async (data) => {
  const response = await axiosInstance.post('/prescriptions', data);
  return response.data;
};

export const updatePrescriptionStatus = async (id, status) => {
  const response = await axiosInstance.put(`/prescriptions/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};
