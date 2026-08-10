import { useAuth } from '../../hooks/useAuth';

const DoctorDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <p>Welcome, Dr. {user?.lastName}!</p>
    </div>
  );
};

export default DoctorDashboard;
