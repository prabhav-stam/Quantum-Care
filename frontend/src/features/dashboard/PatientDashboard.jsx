import { useAuth } from '../../hooks/useAuth';

const PatientDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Patient Dashboard</h2>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
};

export default PatientDashboard;
