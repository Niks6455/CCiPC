import { useDispatch } from 'react-redux';
import styles from './NotFullyFilledCoauthors.module.scss';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFullyFilledCoauthors() {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
  };

  const funSaveData = () => {
    dispatch(setOpenPopUpName({ name: '' }));
    navigate('/account/profile');
  };

  return (
    <div className={styles.NotFullyFilledCoauthors}>
      <p className={styles.title}>
        {i18n.language === 'en'
          ? 'You added co-authors, but did not fill in the necessary information!'
          : 'Вы добавили соавтора(ов), но не заполнили необходимую информацию!'}
      </p>
      <div className={styles.btn}>
        <button onClick={funCloseModal} className={styles.btnred}>
          {i18n.language === 'en' ? 'Return to co-authors' : 'Вернуться к соавторам'}
        </button>
        <button className={styles.btnLight} onClick={funSaveData}>
          {i18n.language === 'en' ? 'Save without co-authors' : 'Сохранить без соавторов'}
        </button>
      </div>
    </div>
  );
}

export default NotFullyFilledCoauthors;
