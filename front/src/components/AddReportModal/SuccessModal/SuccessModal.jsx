import { useDispatch } from 'react-redux';
import styles from './SuccessModal.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  disSetResetReport,
  setOpenPopUpName,
} from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/circleGalka.svg';
import { useTranslation } from 'react-i18next';

function SuccessModal({ name }) {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
    dispatch(disSetResetReport());
  };
  return (
    <div className={styles.SuccessModal}>
      <p className={styles.title}>
        {' '}
        {i18n.language === 'en'
          ? 'You successfully submitted the report'
          : 'Вы успешно подали доклад'}{' '}
        {name && `"${name}"`}.
      </p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        {i18n.language === 'en' ? 'Go to profile' : 'Перейти в профиль'}
      </button>
    </div>
  );
}

export default SuccessModal;
