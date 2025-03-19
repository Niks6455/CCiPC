import { useDispatch } from 'react-redux';
import styles from './FildeModal.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  disSetResetReport,
  setOpenPopUpName,
} from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/error.svg';

function FildeModal({ name }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
    dispatch(disSetResetReport());
  };
  return (
    <div className={styles.FildeModal}>
      <p className={styles.title}>Ошибка добавления доклада: {name && `"${name}"`}.</p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        Перейти в профиль
      </button>
    </div>
  );
}

export default FildeModal;
