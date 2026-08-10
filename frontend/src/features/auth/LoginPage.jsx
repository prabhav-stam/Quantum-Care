import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(email, password);
      // Redirect to the correct dashboard based on user role
      const rolePath = data.role.toLowerCase(); // ADMIN -> admin, DOCTOR -> doctor, etc.
      navigate(`/${rolePath}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    
    try {
      const data = await login(demoEmail, demoPassword);
      const rolePath = data.role.toLowerCase();
      navigate(`/${rolePath}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Sign In</h2>
      <form id="loginForm" onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <FormField label="Email Address" required>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormField>
        
        <FormField label="Password" required>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormField>
        
        <div className={styles.actions}>
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </div>
      </form>
      
      <div className={styles.demoSection}>
        <div className={styles.demoTitle}>Quick Login (Demo Accounts)</div>
        <div className={styles.demoButtons}>
          <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('admin@vitalcore.com', 'admin123')}>Admin</Button>
          <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('dr.smith@vitalcore.com', 'doctor123')}>Doctor</Button>
          <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('john.doe@vitalcore.com', 'patient123')}>Patient</Button>
          <Button variant="secondary" size="sm" onClick={() => handleDemoLogin('reception@vitalcore.com', 'reception123')}>Receptionist</Button>
        </div>
      </div>

      <div className={styles.footer}>
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
