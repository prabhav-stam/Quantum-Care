import React from 'react';
import styles from './StatCard.module.css';

export const StatCard = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
    </div>
  );
};
