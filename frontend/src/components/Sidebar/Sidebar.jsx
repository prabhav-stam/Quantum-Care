import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { roleRoutes } from '../../routes/roleRoutes';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user || !user.role) return null;
  
  const routes = roleRoutes[user.role] || [];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>+</div>
        <div className={styles.logoText}>Quantum Care</div>
      </div>
      <nav className={styles.nav}>
        {routes.map((route, idx) => (
          <NavLink 
            key={idx} 
            to={route.path} 
            end 
            className={({ isActive }) => 
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <span className={styles.icon}>{route.icon}</span>
            {route.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
