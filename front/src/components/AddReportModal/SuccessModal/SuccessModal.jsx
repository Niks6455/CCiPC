import { useDispatch } from 'react-redux';
import styles from './SuccessModal.module.scss';
import { useNavigate } from 'react-router-dom';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/circleGalka.svg';

function SuccessModal({ name }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
  };
  return (
    <div className={styles.SuccessModal}>
      <p className={styles.title}>Вы успешно подали доклад {name && `"${name}"`}.</p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        Перейти в профиль
      </button>
    </div>
  );
}

export default SuccessModal;
