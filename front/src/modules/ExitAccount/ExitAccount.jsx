import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExitAccount.module.scss';
import DataContext from '../../context';
import ExitImg from './../../assets/img/exit.png';
import { useTranslation } from 'react-i18next';

function ExitAccount(props) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const context = useContext(DataContext);

  const funExcit = () => {
    navigate('/login/authorization');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    props.funResetAllApi();
  };

  return (
    <section className={styles.ExitAccount}>
      <div>
        <div className={styles.ExitAccountImg}>
          <img src={ExitImg} />
        </div>
        <p>{i18n.language === 'ru' ? 'Выйти из аккаунта?' : 'Exit from the account?'} </p>
        <div className={styles.ExitAccountButton}>
          {context.userRole === 1 ? (
            <>
              <button
                onClick={() => {
                  navigate(-1);
                }}
              >
                {i18n.language === 'ru' ? 'Назад' : 'Back'}
              </button>
              <button onClick={funExcit}>Да</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/account/profile');
                  context.setSelectFrameLks('profile');
                }}
              >
                {i18n.language === 'ru' ? 'В профиль' : 'To profile'}
              </button>
              <button onClick={funExcit}>{i18n.language === 'ru' ? 'Да' : 'Yes'}</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ExitAccount;
