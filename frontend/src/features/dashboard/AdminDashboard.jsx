import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
};

export default AdminDashboard;
