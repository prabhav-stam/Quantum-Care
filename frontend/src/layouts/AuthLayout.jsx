import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.logoIcon}>+</div>
          <h1 className={styles.logoText}>Quantum Care</h1>
          <p className={styles.subtitle}>Hospital Management System</p>
        </div>
        <div className={styles.card}>
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
