import axiosInstance from './axios';

export const getDoctors = async () => {
  const response = await axiosInstance.get('/doctors');
  return response.data;
};

export const getDoctor = async (id) => {
  const response = await axiosInstance.get(`/doctors/${id}`);
  return response.data;
};

export const getDoctorByUserId = async (userId) => {
  const response = await axiosInstance.get(`/doctors/user/${userId}`);
  return response.data;
};

export const updateDoctor = async (id, data) => {
  const response = await axiosInstance.put(`/doctors/${id}`, data);
  return response.data;
};

export const getActiveDoctors = async () => {
  const response = await axiosInstance.get('/doctors/active');
  return response.data;
};
