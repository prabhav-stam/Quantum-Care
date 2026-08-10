import axiosInstance from './axios';

export const getMedicalRecordsByPatientId = async (patientId) => {
  const response = await axiosInstance.get(`/medical-records/patient/${patientId}`);
  return response.data;
};

export const createMedicalRecord = async (recordData) => {
  const response = await axiosInstance.post('/medical-records', recordData);
  return response.data;
};
