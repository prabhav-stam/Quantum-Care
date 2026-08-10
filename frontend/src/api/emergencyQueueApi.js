import axiosInstance from './axios';

export const addToEmergencyQueue = async (entryData) => {
  const response = await axiosInstance.post('/emergency-queue', entryData);
  return response.data;
};

export const getActiveQueue = async () => {
  const response = await axiosInstance.get('/emergency-queue');
  return response.data;
};

export const getActiveQueueForDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/emergency-queue/doctor/${doctorId}`);
  return response.data;
};

export const updateQueueStatus = async (id, status, doctorId, doctorName) => {
  const response = await axiosInstance.put(`/emergency-queue/${id}/status`, null, {
    params: { status, doctorId, doctorName }
  });
  return response.data;
};
