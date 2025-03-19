import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import LogoHomePage from './../../assets/img/logo.png';
// import arrow from './../../assets/img/arrow.svg';
import footerLogo from './../../assets/img/Headernumber.png';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';

function Header() {
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const conference = useSelector(state => state.conferences.data[0]);
  console.log('conference', conference);

  console.log('autorisation', autorisation);
  const navigate = useNavigate();
  return (
    <header>
      <div className={styles.HeaderContainer} id="top">
        <div className={styles.logo}>
          <img src={LogoHomePage} alt="logo" onClick={() => navigate('/')} />
        </div>
        <div className={styles.logoInner}>
          <img
            src={`${server}/${conference?.logo?.FOOTER}`}
            alt="logo"
            onError={e => (e.target.display = 'none')}
          />
          <p>
            Всероссийская научная конференция
            <br /> "Системный синтез и прикладная синергетика"
          </p>
        </div>
      </div>
      <div className={styles.HeaderMenuContainer}>
        <div className={styles.HeaderMenu}>
          <ul>
            <li onClick={() => navigate('/author')}>
              Автору{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate('/participants')}>
              Участники{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate('/organizationcomite')}>
              Оргкомитет{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() =>
                autorisation ? navigate('/account/profile') : navigate('/authorization')
              }
            >
              {autorisation ? 'Личный кабинет' : 'Вход/Регистрация'}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
