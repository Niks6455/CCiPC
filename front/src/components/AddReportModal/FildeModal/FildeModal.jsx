import { useDispatch } from 'react-redux';
import styles from './FildeModal.module.scss';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/error.svg';
import { useTranslation } from 'react-i18next';

function FildeModal({ name, text }) {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
  };
  return (
    <div className={styles.FildeModal}>
      <p className={styles.title}>
        {i18n.language === 'en' ? 'Error adding a report' : 'Ошибка добавления доклада:'}{' '}
        {name && `"${name}"`}.
      </p>
      {text && <p className={styles.text}>{text}</p>}
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        {i18n.language === 'en' ? 'Close' : 'Закрыть'}
      </button>
    </div>
  );
}

export default FildeModal;
