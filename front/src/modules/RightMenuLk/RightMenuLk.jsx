import React, { useContext, useEffect, useRef } from 'react';
import styles from './RightMenuLk.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import { useSelector } from 'react-redux';
import { convertDate } from '../../utils/functions/funcions';
import DataContext from '../../context';
import { useLocation } from 'react-router-dom';
function RightMenuLk(props) {
  const stages = useSelector(state => state.conferences.data[0]?.stages);
  const checkPathName = () => {
    return window.location.pathname.includes('/adminPage');
  };
  const refMenu = useRef(null);
  const context = useContext(DataContext);
  useEffect(() => {
    const handleClickOutside = event => {
      if (refMenu.current && !refMenu.current.contains(event.target)) {
        context.setActiveMenu(false);
        console.log('event.target', event.target);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className={`${styles.RightMenuLk} ${checkPathName() ? styles.RightMenuLkhide : ''}`}>
      <div className={styles.RightMenuLkContainer} ref={refMenu}>
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
