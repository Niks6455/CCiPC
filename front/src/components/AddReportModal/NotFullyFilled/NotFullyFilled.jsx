import { useDispatch, useSelector } from 'react-redux';
import styles from './NotFullyFilled.module.scss';
import { useNavigate } from 'react-router-dom';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/circleGalka.svg';

function NotFullyFilled({ name }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const conference = useSelector(state => state.conferences.data[0]);
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
  };
  return (
    <div className={styles.NotFullyFilled}>
      <p className={styles.title}>
        Вы успешно подали доклад “{name}”.
        <br />
        Не забудьте внести оставшиеся данные в срок до {conference?.date[1]?.value}.
      </p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        Перейти в профиль
      </button>
    </div>
  );
}

export default NotFullyFilled;
