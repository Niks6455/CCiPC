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
  const navigate = useNavigate();
  return (
    <header>
      <div className={styles.HeaderContainer} id="top">
        <div className={styles.logo}>
          <img src={LogoHomePage} alt="logo" onClick={() => navigate('/')} />
        </div>
        <div className={styles.logoInner}>
          {conference?.logo?.HEADER && (
            <img src={`${server}/${conference?.logo?.HEADER}`} alt="logo" />
          )}

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
                autorisation ? navigate('/account/profile') : navigate('/login/authorization')
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
