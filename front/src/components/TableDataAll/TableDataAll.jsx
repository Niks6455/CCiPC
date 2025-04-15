import { useRef, useEffect } from 'react';
import styles from './TableDataAll.module.scss';
import closeBack from '@assets/img/closeBack.svg';
import gsap from 'gsap';
import { useDispatch } from 'react-redux';
import { clearDataParticipants } from '../../store/participantsSlice/participantsSlice';

function TableDataAll(props) {
  const refForm = useRef(null);
  const refBackdrop = useRef(null);
  const dispatch = useDispatch();

  const splitFio = fio => {
    return fio?.map((name, index) => (
      <span key={index}>
        {name}
        <br />
      </span>
    ));
  };

  useEffect(() => {
    const element = refForm.current;
    const backdrop = refBackdrop.current;

    // Анимация затемнения фона
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });

    // Анимация всплывания окна
    gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
    );

    return () => {
      gsap.to(backdrop, { opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to(element, { y: 100, opacity: 0, duration: 0.4, ease: 'power2.in' });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (refForm.current && !refForm.current.contains(event.target)) {
        dispatch(clearDataParticipants());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className={styles.TableDataAll} ref={refBackdrop}>
      <div className={styles.TableDataAllInner} ref={refForm}>
        <div className={styles.TableDataAllFirstBlock}>
          <div className={styles.TableDataAllFIO}>{splitFio(props?.data?.fio)}</div>
          <button>
            <img
              src={closeBack}
              alt="Close"
              onClick={() => {
                dispatch(clearDataParticipants());
              }}
            />
          </button>
        </div>
        <div className={styles.textCont}>
          <div className={styles.textContTitle}>
            <p>Организация</p>
          </div>
          <div className={styles.textContSubtitle}>
            <p>{props?.data?.organization}</p>
          </div>
        </div>
        <div className={styles.textCont}>
          <div className={styles.textContTitle}>
            <p>Направление</p>
          </div>
          <div className={styles.textContSubtitle}>
            <p>{props?.data?.direction}</p>
          </div>
        </div>
        <div className={styles.textCont}>
          <div className={styles.textContTitle}>
            <p>Доклад</p>
          </div>
          <div className={styles.textContSubtitle}>
            <p>{props?.data?.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableDataAll;
