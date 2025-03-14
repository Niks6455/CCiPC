import React, { useState } from 'react';
import styles from './RightMenuLk.module.scss';
import NavBar from '../../components/NavBar/NavBar';
function RightMenuLk() {
  const checkPathName = () => {
    return window.location.pathname.includes('/adminPage');
  };

  return (
    <section className={`${styles.RightMenuLk} ${checkPathName() ? styles.RightMenuLkhide : ''}`}>
      <div className={styles.RightMenuLkContainer}>
        <NavBar />
      </div>
    </section>
  );
}

export default RightMenuLk;
