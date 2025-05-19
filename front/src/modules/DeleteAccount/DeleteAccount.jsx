import { useNavigate } from 'react-router-dom';
import deleteImg from './../../assets/img/delete.png';
import style from './DeleteAccount.module.scss';
import { useContext } from 'react';
import DataContext from '../../context';
import { apiDeleteAccount } from '../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import { convertDateTire } from '../../utils/functions/funcions';
import circleRed from '@assets/img/circleRed.svg';
import { useTranslation } from 'react-i18next';

function DeleteAccount() {
  const { i18n } = useTranslation();

  const dedlineReport2 = useSelector(state => state?.conferences?.data[0]?.dedlineReport2);
  const reports = useSelector(state => state?.reportsSlice?.data);
  const navigate = useNavigate();
  const context = useContext(DataContext);
  const funDeleteAccaunt = () => {
    apiDeleteAccount().then(res => {
      if (res?.status === 200) {
        navigate('/login/authorization');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    });
  };
  return (
    <section className={style.DeleteAccount}>
      {new Date(convertDateTire(dedlineReport2)) > new Date() && reports?.length === 0 ? (
        <div>
          <div className={style.DeleteAccountImg}>
            <img src={deleteImg} />
          </div>
          {i18n.language === 'ru' ? (
            <p>
              Все данные будут утеряны навсегда. <br />
              Вы уверены, что хотите удалить аккаунт?
            </p>
          ) : (
            <p>
              {' '}
              All data will be lost forever. <br /> Are you sure you want to delete your
              account?{' '}
            </p>
          )}

          <div className={style.DeleteAccountButton}>
            <button
              onClick={() => {
                navigate('/account/profile');
                context.setSelectFrameLks('profile');
              }}
            >
              {i18n.language === 'ru' ? 'Нет' : 'No'}
            </button>
            <button onClick={funDeleteAccaunt}>{i18n.language === 'ru' ? 'Да' : 'Yes'}</button>
          </div>
        </div>
      ) : (
        <div>
          {i18n.language === 'ru' ? (
            <p className={style.nodelete}>
              Удалить аккаунт можно после <br /> завершения конференции!
            </p>
          ) : (
            <p className={style.nodelete}>
              Delete the account can be done <br /> after the conference is over!
            </p>
          )}

          <div className={style.nodeleteImg}>
            <img src={circleRed} alt=":(" />
          </div>
          <div className={style.goProfile}>
            <button
              onClick={() => {
                navigate('/account/profile');
                context.setSelectFrameLks('profile');
              }}
            >
              {i18n.language === 'ru' ? 'Перейти в профиль' : 'Go to profile'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DeleteAccount;
