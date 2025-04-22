import styles from './ProfileCard.module.scss';
import imgHuman from '@assets/img/UI/notPhoto.svg';
import { server } from '../../apirequests/apirequests';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function ProfileCard({ data }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;

    // Анимация появления карточки
    gsap.fromTo(
      card,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );

    // Анимация появления изображения
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 },
    );
  }, [data]); // Запускаем анимацию при изменении данных

  return (
    <div ref={cardRef} className={styles.profileCard} key={data?.id}>
      <img
        ref={imgRef}
        onError={e => (e.target.src = imgHuman)}
        src={data?.img ? `${server}/${data.img?.url}` : imgHuman}
        alt="photo"
      />
      <p className={styles.name}>{data?.fio}</p>
      <p className={styles.university}>{data?.organization}</p>
    </div>
  );
}
