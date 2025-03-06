import React, { useState } from 'react';
import styles from './RightMenuLk.module.scss';
import NavBar from '../../components/NavBar/NavBar';
function RightMenuLk() {
  const checkPathName = () => {
    return window.location.pathname.includes('/adminPage');
  };

  return (
    <section
      className={styles.RightMenuLk}
      style={{
        width: !checkPathName() ? '310px' : '0px',
        minWidth: !checkPathName() ? '310px' : '0px',
        borderLeft: !checkPathName() ? '1px solid #C8D0CE' : 'none',
      }}
    >
      <div className={styles.RightMenuLkContainer}>
        <NavBar />
      </div>
    </section>
  );
}

export default RightMenuLk;
