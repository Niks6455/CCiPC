import { useNavigate } from 'react-router-dom';
import deleteImg from './../../assets/img/delete.png';
import style from './DeleteAccount.module.scss';
import { useContext } from 'react';
import DataContext from '../../context';
import { apiDeleteAccount } from '../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import { convertDateTire } from '../../utils/functions/funcions';
import circleRed from '@assets/img/circleRed.svg';

function DeleteAccount() {
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
          <p>
            Все данные будут утеряны навсегда. <br />
            Вы уверены, что хотите удалить аккаунт?
          </p>
          <div className={style.DeleteAccountButton}>
            <button
              onClick={() => {
                navigate('/account/profile');
                context.setSelectFrameLks('profile');
              }}
            >
              Нет
            </button>
            <button onClick={funDeleteAccaunt}>Да</button>
          </div>
        </div>
      ) : (
        <div>
          <p className={style.nodelete}>
            Удалить аккаунт можно после <br /> завершения конференции!
          </p>
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
              Перейти в профиль
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DeleteAccount;
