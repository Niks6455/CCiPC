import { useDispatch } from 'react-redux';
import styles from './NotFullyFilled.module.scss';
import { useNavigate } from 'react-router-dom';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/circleGalka.svg';

function NotFullyFilled() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
  };
  return (
    <div className={styles.NotFullyFilled}>
      <p className={styles.title}>
        Вы успешно подали доклад “Название доклада”.
        <br />
        Не забудьте внести оставшиеся данные в срок до ХХ.ХХ.ХХХХ.
      </p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        Перейти в профиль
      </button>
    </div>
  );
}

export default NotFullyFilled;
