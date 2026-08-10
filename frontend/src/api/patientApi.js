import axiosInstance from './axios';

export const getPatients = async () => {
  const response = await axiosInstance.get('/patients');
  return response.data;
};

export const getPatient = async (id) => {
  const response = await axiosInstance.get(`/patients/${id}`);
  return response.data;
};

export const getPatientByUserId = async (userId) => {
  const response = await axiosInstance.get(`/patients/user/${userId}`);
  return response.data;
};

export const updatePatient = async (id, data) => {
  const response = await axiosInstance.put(`/patients/${id}`, data);
  return response.data;
};
