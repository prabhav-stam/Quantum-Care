import PropTypes from 'prop-types';
import styles from './PriorityDot.module.css';

export const PriorityDot = ({ priority }) => {
  return (
    <div className={styles.wrapper}>
      <span className={`${styles.dot} ${styles[priority.toLowerCase()]}`} />
      <span className={styles.label}>{priority}</span>
    </div>
  );
};

PriorityDot.propTypes = {
  priority: PropTypes.oneOf(['CRITICAL', 'URGENT', 'NORMAL']).isRequired
};
