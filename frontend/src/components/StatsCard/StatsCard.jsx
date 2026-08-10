import PropTypes from 'prop-types';
import styles from './StatsCard.module.css';

export const StatsCard = ({ icon, value, label, trend }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {trend && (
          <div className={`${styles.trend} ${trend.startsWith('+') ? styles.up : styles.down}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.string
};
