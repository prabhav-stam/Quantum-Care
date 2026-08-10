import { useAuth } from '../../hooks/useAuth';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Receptionist Dashboard</h2>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
};

export default ReceptionistDashboard;
