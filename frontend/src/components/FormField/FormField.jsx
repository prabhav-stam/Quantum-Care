import PropTypes from 'prop-types';
import styles from './FormField.module.css';

export const FormField = ({ label, error, required = false, children }) => {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {children}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired
};
