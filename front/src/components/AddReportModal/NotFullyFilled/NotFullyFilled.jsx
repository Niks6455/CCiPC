import { useDispatch, useSelector } from 'react-redux';
import styles from './NotFullyFilled.module.scss';
import { useNavigate } from 'react-router-dom';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import circleGalka from './../../../assets/img/UI/circleGalka.svg';
import { useTranslation } from 'react-i18next';

function NotFullyFilled({ name }) {
  const { i18n } = useTranslation();

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
        {i18n.language === 'en'
          ? 'You successfully submitted the report'
          : 'Вы успешно подали доклад'}{' '}
        “{name}”.
        <br />
        {i18n.language === 'en'
          ? "Don't forget to enter the remaining data by the deadline"
          : 'Не забудьте внести оставшиеся данные в срок до'}{' '}
        {conference?.dedlineReport2}.
      </p>
      <img className={styles.galka} src={circleGalka} alt="img" />
      <button onClick={funCloseModal} className={styles.btnred}>
        {i18n.language === 'en' ? 'Go to profile' : 'Перейти в профиль'}
      </button>
    </div>
  );
}

export default NotFullyFilled;
