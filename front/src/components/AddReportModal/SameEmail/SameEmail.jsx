import { useDispatch } from 'react-redux';
import styles from './SameEmail.module.scss';
import { setOpenPopUpName } from '../../../store/reportCreateSlice/reportCreateSlice';

function SameEmail() {
  const dispatch = useDispatch();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: '' }));
  };
  return (
    <div className={styles.SameEmail}>
      <p className={styles.title}>
        Вы добавили соавторов с одинаковой почтой!
        <br /> Удалите либо замените повторяющееся поле и сохраните данные повторно.
      </p>
      <button onClick={funCloseModal} className={styles.btnred}>
        Вернуться к соавторам
      </button>
    </div>
  );
}

export default SameEmail;
