import { useContext, useEffect, useRef, useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from './../../assets/img/closeImg.png';
import { useLocation, useNavigate } from 'react-router-dom';
import DataContext from '../../context';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import logo from '@assets/img/logo.png';
import profile from '@assets/img/headPhoneIcon/profile.svg';
import documents from '@assets/img/headPhoneIcon/documents.svg';
import archive from '@assets/img/headPhoneIcon/archive2.svg';
import setting from '@assets/img/headPhoneIcon/setting.svg';
import logout from '@assets/img/headPhoneIcon/logout.svg';
import deleteImg from '@assets/img/headPhoneIcon/delete.svg';
import arrow from '@assets/img/arrow.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { convertDate } from '../../utils/functions/funcions';
import { useTranslation } from 'react-i18next';

function NavBar(props) {
  const { t } = useTranslation('navbar');
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const stages = useSelector(state => state.conferences.data[0]?.stages);
  const location = useLocation();
  const [islks, setIslks] = useState(false);
  const [isSattings, setIsSattings] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const reports = useSelector(state => state.reportsSlice.data);
  const user = useSelector(state => state.user.user.data);

  const listRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        context.setActiveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const naviList = [
    {
      name: t('lk'),
      action: () => {
        setIslks(!islks);
      },
      state: islks,
      display: user.email && context.userRole !== 1,

      list: [
        {
          name: t('profile'),
          icon: profile,
          link: '/account/profile',
        },
        {
          name: t('myReports'),
          icon: documents,
        },
        {
          name: t('archivPhoto'),
          icon: archive,
          link: '/account/archivephoto',
        },
      ],
    },
    {
      name: t('settings'),
      icon: setting,
      action: () => setIsSattings(!isSattings),
      state: isSattings,
      display: user.email && context.userRole !== 1,
      list: [
        {
          name: t('editProfile'),
          link: '/account/settings/profile',
        },
        {
          name: t('changePassword'),
          link: '/account/settings/changepassword',
        },
      ],
    },
    {
      name: t('exitAccount'),
      link: '/account/exitaccount',
      icon: logout,
      display: user.email,
    },
    {
      name: t('deleteAccount'),
      icon: deleteImg,
      link: '/account/deleteaccount',
      display: user.email && context.userRole !== 1,
    },
    {
      name: user.email ? t('lk') : t('authorization'),
      link: user.email ? '/account/profile' : '/login/authorization',
      pk: true,
      display: !location.pathname.includes('login') && !location.pathname.includes('account'),
    },

    {
      name: t('home'),
      link: '/',
      display: true,
    },
    {
      name: t('author'),
      link: '/author',
      display: true,
    },
    {
      name: t('news'),
      link: '/news',
      display: true,
    },
    {
      name: t('participants'),
      link: '/participants',
      display: true,
    },
    {
      name: t('committee'),
      link: '/committee',
      display: true,
    },
  ];
  return (
    <>
      {context.activeMenu && <div className={styles.PageBlur} />}
      <div ref={listRef}>
        <>
          <div
            style={props?.admine ? { display: 'none' } : {}}
            className={`${styles.logo} ${props.login ? styles.loginLogo : ''} ${location.pathname.includes('/account') ? styles.visibleLogo : ''}`}
          >
            <img src={logo} alt="logo" onClick={() => navigate('/')} />
          </div>
        </>
        <section className={styles.NavBar}>
          <button className={styles.NavBarButton} onClick={() => context.setActiveMenu(true)}>
            <div className={styles.NavBarMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          <div className={`${styles.menu} ${context.activeMenu ? styles.active : styles.disable}`}>
            <div className={styles.menuInner}>
              <button onClick={() => context.setActiveMenu(false)}>
                {t('hide')} <img src={closeImg} alt="Close" />
              </button>
              <ul>
                {naviList.map((item, index) => (
                  <>
                    <li
                      className={item.pk ? styles.pk : ''}
                      key={index}
                      style={item.display ? {} : { display: 'none' }}
                      onClick={() => {
                        if (item.link) {
                          navigate(item.link);
                          context.setActiveMenu(false);
                        }
                        if (item.action) {
                          item.action();
                        }
                      }}
                    >
                      {/* фото слева */}
                      {item.icon && (
                        <div className={styles.leftImg}>
                          <img src={item.icon} alt="item.icon" />
                        </div>
                      )}
                      {/* текст ли */}
                      <span>{item.name}</span>
                      {/* стрелка при ховере */}
                      {!item.list && (
                        <span className={styles.arowLi}>
                          <img src={ArrowMenu} alt="Arrow" />
                        </span>
                      )}

                      {/* фото справа */}
                      {item.list && (
                        <div className={styles.rigthImg}>
                          <img
                            src={arrow}
                            alt="arrow"
                            className={item.state ? styles.rotate : ''}
                          />
                        </div>
                      )}
                    </li>
                    {/* списки */}
                    <AnimatePresence>
                      {item.state && (
                        <motion.div
                          className={styles.list}
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                        >
                          {item.list?.map((item, index) => (
                            <>
                              <li
                                key={index}
                                onClick={() => {
                                  if (item.link) {
                                    navigate(item.link);
                                    context.setActiveMenu(false);
                                  }
                                  if (item.name === t('myReports')) {
                                    setIsReports(!isReports);
                                  }
                                }}
                              >
                                {item.icon && (
                                  <div className={styles.leftImg}>
                                    <img src={item.icon} alt="item.icon" />
                                  </div>
                                )}

                                <span>{item.name}</span>
                                {item.name === t('myReports') && (
                                  <div className={styles.rigthImg}>
                                    <img
                                      src={arrow}
                                      alt="arrow"
                                      className={isReports ? styles.rotate : ''}
                                    />
                                  </div>
                                )}
                              </li>
                              {/* лист докладов */}
                              <AnimatePresence>
                                {item.name === t('myReports') && isReports && (
                                  <motion.ul
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className={styles.reports}
                                  >
                                    <li
                                      onClick={() => {
                                        navigate('/account/documents');
                                        context.setActiveMenu(false);
                                      }}
                                    >
                                      <span>{t('addReport')}</span>
                                    </li>
                                    {reports.map((item, index) => (
                                      <li
                                        key={index}
                                        onClick={() => {
                                          navigate(
                                            `/account/viewreports?idReport=${item.id}&number=${index + 1}`,
                                          );
                                          context.setActiveMenu(false);
                                        }}
                                      >
                                        <span>
                                          <span>
                                            {t('numberReport')}
                                            {index + 1}
                                          </span>
                                        </span>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ))}

                {context.userRole === 1 && !props.admine && (
                  <li
                    onClick={() => {
                      navigate('/adminPage/news');
                      context.setActiveMenu(false);
                    }}
                  >
                    {t('adminPanel')}{' '}
                    <span className={styles.arowLi}>
                      <img src={ArrowMenu} alt="Arrow" />
                    </span>
                  </li>
                )}
              </ul>
              <div className={styles.RightMenuText}>
                {stages?.length > 0 &&
                  // stages.map(item => item.name).join(', ').length < 300 &&
                  stages.map((item, index) => (
                    <div key={index} className={styles.RightMenuTextCont}>
                      <p className={styles.RightMenuTextGroup}>{convertDate(item.date)}</p>
                      <p>{item.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default NavBar;
