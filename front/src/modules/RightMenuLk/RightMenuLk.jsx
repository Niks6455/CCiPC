import React from 'react';
import styles from './RightMenuLk.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import { useSelector } from 'react-redux';
import { convertDate } from '../../utils/functions/funcions';
function RightMenuLk(props) {
  const stages = useSelector(state => state.conferences.data[0]?.stages);
  const checkPathName = () => {
    return window.location.pathname.includes('/adminPage');
  };

  return (
    <section className={`${styles.RightMenuLk} ${checkPathName() ? styles.RightMenuLkhide : ''}`}>
      <div className={styles.RightMenuLkContainer}>
        <NavBar userRole={props.userRole} admine={props.admine} />
      </div>
      {!checkPathName() && (
        <div className={styles.stages}>
          {stages?.length > 0 &&
            stages.map((item, index) => (
              <div key={index}>
                <div className={styles.date}>{convertDate(item.date)}</div>
                <div className={styles.name}>{item.name}</div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

export default RightMenuLk;
