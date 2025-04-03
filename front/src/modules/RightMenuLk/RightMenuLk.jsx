import React from 'react';
import styles from './RightMenuLk.module.scss';
import NavBar from '../../components/NavBar/NavBar';
function RightMenuLk(props) {
  const checkPathName = () => {
    return window.location.pathname.includes('/adminPage');
  };

  return (
    <section className={`${styles.RightMenuLk} ${checkPathName() ? styles.RightMenuLkhide : ''}`}>
      <div className={styles.RightMenuLkContainer}>
        <NavBar userRole={props.userRole} admine={props.admine} />
      </div>
    </section>
  );
}

export default RightMenuLk;
