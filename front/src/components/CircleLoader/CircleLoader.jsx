import React from 'react';
import styles from './CircleLoader.module.scss';

const CircleLoader = () => {
  return (
    <div className={styles.CircleLoader}>
      <div className={styles.CircleLoader__circle}></div>
    </div>
  );
};

export default CircleLoader;
