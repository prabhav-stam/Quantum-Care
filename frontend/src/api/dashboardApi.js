import axiosInstance from './axios';

export const getAdminDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard/admin');
  return response.data;
};
