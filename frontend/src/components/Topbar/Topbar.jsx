import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import styles from './Topbar.module.css';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Simple way to get a title from the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === `/${user?.role?.toLowerCase()}`) return 'Dashboard';
    const segment = path.split('/').pop();
    if (!segment) return 'Dashboard';
    return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!user) return null;

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{getPageTitle()}</h1>
      <div className={styles.actions}>
        <div className={styles.userInfo}>
          <span className={styles.name}>{user.firstName} {user.lastName}</span>
          <Badge variant="info">{user.role}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
};
