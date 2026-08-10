import PropTypes from 'prop-types';
import styles from './Badge.module.css';

export const Badge = ({ variant = 'default', children }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default']),
  children: PropTypes.node.isRequired
};
