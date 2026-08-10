import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';
import { Button } from '../Button/Button';

export const EmptyState = ({ icon = '⊘', message, actionText, onAction }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <p className={styles.message}>{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  message: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func
};
