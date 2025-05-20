import styles from './HeaderSecond.module.scss';
import logo from './../../assets/img/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
function HeaderSecond() {
  const { t } = useTranslation('global');

  const navigate = useNavigate();
  return (
    <header className={styles.HeaderSecond}>
      <div className={styles.HeaderSecondInner}>
        <div>
          <img src={logo} onClick={() => navigate('/')} />
        </div>
        <div className={styles.HeaderMenu}>
          <ul>
            <li>
              {t('par1')}{' '}
              <span className={styles.arowLi}>
                <img src="/img/ArrowBotGreen.svg" alt="Arrow" />
              </span>
            </li>
            <li>
              {t('par2')}{' '}
              <span className={styles.arowLi}>
                <img src="/img/ArrowBotGreen.svg" alt="Arrow" />
              </span>
            </li>
            <li>
              {t('par3')}{' '}
              <span className={styles.arowLi}>
                <img src="/img/ArrowBotGreen.svg" alt="Arrow" />
              </span>
            </li>
            <li>
              {t('par4')}{' '}
              <span className={styles.arowLi}>
                <img src="/img/ArrowBotGreen.svg" alt="Arrow" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default HeaderSecond;
