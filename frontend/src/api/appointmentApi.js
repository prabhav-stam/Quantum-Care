import axiosInstance from './axios';

export const getAppointments = async () => {
  const response = await axiosInstance.get('/appointments');
  return response.data;
};

export const getAppointmentsByPatient = async (patientId) => {
  const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
  return response.data;
};

export const getAppointmentsByDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

export const getAppointmentsByDoctorAndDate = async (doctorId, date) => {
  const response = await axiosInstance.get(`/appointments/doctor/${doctorId}/date`, {
    params: { date }
  });
  return response.data;
};

export const getAppointment = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}`);
  return response.data;
};

export const bookAppointment = async (appointmentData) => {
  const response = await axiosInstance.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id, status, notes) => {
  const response = await axiosInstance.put(`/appointments/${id}/status`, null, {
    params: { status, notes }
  });
  return response.data;
};
