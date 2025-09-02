import React from 'react';
import styles from './LastBuilt.module.css';

interface LastBuiltProps {
  date: string;
}

export function LastBuilt({ date }: LastBuiltProps): JSX.Element {
  return (
    <div className={styles.lastBuilt}>
      <span className={styles.label}>Last Built:</span>
      <span className={styles.date}>{date}</span>
    </div>
  );
}
