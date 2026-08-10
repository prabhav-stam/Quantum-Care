import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'PATIENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <div className={styles.row}>
          <FormField label="First Name" required>
            <input 
              name="firstName"
              type="text" 
              value={formData.firstName} 
              onChange={handleChange}
              required
            />
          </FormField>
          
          <FormField label="Last Name" required>
            <input 
              name="lastName"
              type="text" 
              value={formData.lastName} 
              onChange={handleChange}
              required
            />
          </FormField>
        </div>

        <FormField label="Email Address" required>
          <input 
            name="email"
            type="email" 
            value={formData.email} 
            onChange={handleChange}
            required
          />
        </FormField>
        
        <FormField label="Phone Number" required>
          <input 
            name="phone"
            type="tel" 
            value={formData.phone} 
            onChange={handleChange}
            required
          />
        </FormField>
        
        <FormField label="Password" required>
          <input 
            name="password"
            type="password" 
            value={formData.password} 
            onChange={handleChange}
            required
          />
        </FormField>
        
        <FormField label="Role" required>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </FormField>
        
        <div className={styles.actions}>
          <Button type="submit" fullWidth loading={loading}>
            Register
          </Button>
        </div>
      </form>
      
      <div className={styles.footer}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
