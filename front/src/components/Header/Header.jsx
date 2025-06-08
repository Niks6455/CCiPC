import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import LogoHomePage from './../../assets/img/logo.png';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
import { Trans, useTranslation } from 'react-i18next';

function Header({ userRole }) {
  const { t } = useTranslation('homePage');

  const autorisation = useSelector(state => state.user.user.data.email);
  const conference = useSelector(state => state.conferences.data[0]);
  const navigate = useNavigate();
  console.log('autorisation', autorisation);
  return (
    <header className={styles.HeaderContainerBlock}>
      <div className={styles.HeaderContainer} id="top">
        <div className={styles.logo}>
          <img src={LogoHomePage} alt="logo" onClick={() => navigate('/')} />
        </div>
        <div className={styles.logoInner}>
          {conference?.files?.HEADER?.[0]?.url ? (
            <img
              src={`${server}/${conference?.files?.HEADER?.[0]?.url}`}
              alt="logo"
              onError={e => (e.target.style.display = 'none')}
            />
          ) : (
            <img
              src={`${server}/${conference?.files?.FOOTER?.[0]?.url}`}
              alt="logo"
              onError={e => (e.target.style.display = 'none')}
            />
          )}

          <p>
            <Trans
              i18nKey={'homePage:par24'}
              components={{
                1: <br />,
              }}
            />
          </p>
        </div>
      </div>
      <div className={styles.HeaderMenuContainer}>
        <div className={styles.HeaderMenu}>
          <ul>
            {userRole === 1 && (
              <li onClick={() => navigate('/adminPage/news')}>
                {t('par25')}{' '}
                <span className={styles.arowLi}>
                  <img src={ArrowMenu} alt="Arrow" />
                </span>
              </li>
            )}

            <li onClick={() => navigate('/author')}>
              {t('par6')}{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate('/participants')}>
              {t('par7')}{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate('/committee')}>
              {t('par8')}{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() =>
                !!autorisation ? navigate('/account/profile') : navigate('/login/authorization')
              }
            >
              {!!autorisation ? t('par9') : t('par11')}
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
