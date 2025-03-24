import styles from './SuccessModal.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';

function SuccessModal({ open, close }) {
  return open ? (
    <div className={styles.SuccessModal_blur}>
      <div className={styles.SuccessModal}>
        <p className={styles.title}>Данные успешно сохранены.</p>
        <img className={styles.galka} src={circleGalka} alt="img" />
        <button onClick={() => close(false)} className={styles.btnred}>
          Закрыть
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default SuccessModal;
