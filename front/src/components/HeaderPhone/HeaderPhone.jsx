import styles from './HeaderPhone.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import arrow from '@assets/img/arrow.svg';
import archive from '@assets/img/headPhoneIcon/archive2.svg';
import setting from '@assets/img/headPhoneIcon/setting.svg';
import logout from '@assets/img/headPhoneIcon/logout.svg';
import profile from '@assets/img/headPhoneIcon/profile.svg';
import documents from '@assets/img/headPhoneIcon/documents.svg';
import deleteImg from '@assets/img/headPhoneIcon/delete.svg';
import DataContext from '../../context';
import { useTranslation } from 'react-i18next';

function HeaderPhone(props) {
  const { t } = useTranslation('homePage');

  const context = useContext(DataContext);

  const [activeMenu, setActiveMenu] = useState(false);
  const navigate = useNavigate();
  const [activeMenuListFirst, setActiveMenuListFirst] = useState(false);
  const [activeMenuListSecond, setActiveMenuListSecond] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  const user = useSelector(state => state.user.user.data);
  const reports = useSelector(state => state.reportsSlice.data);
  const [isReports, setIsReports] = useState(false);

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigateTo = path => {
    navigate(path);
    closeMenuActive();
  };

  const closeMenuActive = () => {
    setActiveMenu(false);
    setActiveMenuListFirst(false);
    setActiveMenuListSecond(false);
  };
  const location = useLocation();

  const updateVisibility = () => {};

  useEffect(() => {
    updateVisibility(); // Initial check
    window.addEventListener('resize', updateVisibility); // Update on resize
    return () => window.removeEventListener('resize', updateVisibility); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div className={`${styles.HeaderPhoneContainer} ${isVisible ? styles.fixedPosition : ''}`}>
        <button className={styles.NavBarMenuButton} onClick={() => setActiveMenu(!activeMenu)}>
          <div className={styles.NavBarMenu}>
            <span></span>
            <span></span>
          </div>
        </button>

        {activeMenu && (
          <div className={`${styles.NavBarMenuContainer} ${styles.open}`}>
            <div className={styles.NavBarMenuContainerInner} ref={menuRef}>
              <button className={styles.NavBarMenuButton} onClick={() => setActiveMenu(false)}>
                <div className={styles.NavBarMenu}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
              <ul className={styles.NavBarMenuList}>
                {user?.email ? (
                  <li
                    onClick={() => {
                      setActiveMenuListFirst(!activeMenuListFirst);
                      setActiveMenuListSecond(false);
                    }}
                  >
                    <div className={styles.NavBarMenuListInnerLi}>
                      <span>{t('par9')}</span>
                      <img
                        style={activeMenuListFirst ? { transform: 'rotate(180deg)' } : {}}
                        src={arrow}
                        alt="arrow"
                      />
                    </div>
                  </li>
                ) : location.pathname !== '/login/authorization' &&
                  location.pathname !== '/login/registration' ? (
                  <li
                    onClick={() => {
                      navigate('/login/authorization');
                      closeMenuActive();
                    }}
                  >
                    <div className={styles.NavBarMenuListInnerLi}>
                      <span>{t('par11')}</span>
                    </div>
                  </li>
                ) : (
                  <></>
                )}

                {activeMenuListFirst && user?.email && (
                  <div className={styles.NavBarMenuListOpener}>
                    <li
                      onClick={() => {
                        navigate('/account/profile');
                        closeMenuActive();
                      }}
                    >
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={profile} />
                        </span>
                        <p>{user?.email ? t('par12') : t('par11')}</p>
                      </div>
                    </li>

                    <li
                      onClick={() => {
                        setIsReports(!isReports);
                      }}
                    >
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={documents} />
                        </span>
                        <p>{t('par13')}</p>
                        <img
                          className={styles.arrow_rep}
                          style={isReports ? { transform: 'rotate(180deg)' } : {}}
                          src={arrow}
                          alt="arrow"
                        />
                      </div>
                    </li>
                    {isReports && (
                      <ul className={styles.reports}>
                        <li
                          onClick={() => {
                            navigate('/account/documents');
                            closeMenuActive();
                          }}
                        >
                          {t('par14')}
                        </li>
                        {reports.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              navigate(
                                `/account/viewreports?idReport=${item.id}&number=${index + 1}`,
                              );
                              closeMenuActive();
                            }}
                          >
                            <span>
                              {t('par15')}
                              {index + 1}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <li
                      onClick={() => {
                        navigate('/account/archivephoto');
                        closeMenuActive();
                      }}
                    >
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={archive} />
                        </span>
                        <p>{t('par16')}</p>
                      </div>
                    </li>

                    <li onClick={() => setActiveMenuListSecond(!activeMenuListSecond)}>
                      <div className={styles.NavBarMenuListInnerLi}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={setting} style={{ marginRight: '5px' }} />
                          {t('par17')}
                        </span>
                        <img
                          style={activeMenuListSecond ? { transform: 'rotate(180deg)' } : {}}
                          src={arrow}
                          alt="arrow"
                        />
                      </div>
                    </li>
                    {activeMenuListSecond && (
                      <div className={styles.NavBarMenuListOpener}>
                        <li
                          onClick={() => {
                            navigate('/account/settings/profile');
                            closeMenuActive();
                          }}
                        >
                          <div className={styles.NavBarMenuListInnerLiImg}>
                            <span></span>
                            <p>{t('par18')}</p>
                          </div>
                        </li>
                        <li
                          onClick={() => {
                            navigate('/account/settings/changepassword');
                            closeMenuActive();
                          }}
                        >
                          <div className={styles.NavBarMenuListInnerLiImg}>
                            <span></span>
                            <p>{t('par19')}</p>
                          </div>
                        </li>
                      </div>
                    )}
                    <li
                      onClick={() => {
                        navigate('/account/exitaccount');
                        closeMenuActive();
                      }}
                    >
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={logout} />
                        </span>
                        <p>{t('par20')}</p>
                      </div>
                    </li>

                    {context.userRole !== 1 && (
                      <li
                        onClick={() => {
                          navigate('/account/deleteaccount');
                          closeMenuActive();
                        }}
                      >
                        <div className={styles.NavBarMenuListInnerLiImg}>
                          <span>
                            <img src={deleteImg} />
                          </span>
                          <p>{t('par21')}</p>
                        </div>
                      </li>
                    )}
                  </div>
                )}

                <li onClick={() => navigateTo('/')}>{t('par22')}</li>
                <li onClick={() => navigateTo('/author')}>{t('par6')}</li>
                <li onClick={() => navigateTo('/news')}>{t('par23')}</li>
                <li onClick={() => navigateTo('/participants')}>{t('par7')}</li>
                <li onClick={() => navigateTo('/committee')}>{t('par8')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderPhone;
