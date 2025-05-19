import { useDispatch } from 'react-redux';
import styles from './SameEmail.module.scss';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';
import { useTranslation } from 'react-i18next';

function SameEmail() {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
  };
  return (
    <div className={styles.SameEmail}>
      {i18n.language === 'en' ? (
        <p className={styles.title}>
          You added co-authors with the same email!
          <br /> Remove or replace the repeating field and save the data again.
        </p>
      ) : (
        <p className={styles.title}>
          Вы добавили соавторов с одинаковой почтой!
          <br /> Удалите либо замените повторяющееся поле и сохраните данные повторно.
        </p>
      )}

      <button onClick={funCloseModal} className={styles.btnred}>
        {i18n.language === 'en' ? 'Return to co-authors' : 'Вернуться к соавторам'}
      </button>
    </div>
  );
}

export default SameEmail;
