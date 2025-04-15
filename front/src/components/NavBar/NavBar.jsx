import { useContext, useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from './../../assets/img/closeImg.png';
import { useLocation, useNavigate } from 'react-router-dom';
import DataContext from '../../context';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import logo from '@assets/img/logo.png';
import { convertDate } from '../../utils/functions/funcions';
import profile from '@assets/img/headPhoneIcon/profile.svg';
import documents from '@assets/img/headPhoneIcon/documents.svg';
import archive from '@assets/img/headPhoneIcon/archive.svg';
import setting from '@assets/img/headPhoneIcon/setting.svg';
import logout from '@assets/img/headPhoneIcon/logout.svg';
import deleteImg from '@assets/img/headPhoneIcon/delete.svg';
import arrow from '@assets/img/arrow.svg';
import { AnimatePresence, motion } from 'framer-motion';

function NavBar(props) {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const stages = useSelector(state => state.conferences.data[0]?.stages);
  const location = useLocation();
  const [islks, setIslks] = useState(false);
  const [isSattings, setIsSattings] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const reports = useSelector(state => state.reportsSlice.data);
  const user = useSelector(state => state.user.user.data);
  const naviList = [
    {
      name: 'Личный кабинет',
      action: () => setIslks(!islks),
      state: islks,
      list: [
        {
          name: user.email ? 'Профиль' : 'Вход/Регистрация',
          icon: profile,
          link: user.email ? '/account/profile' : '/login/authorization',
        },
        {
          name: 'Мои доклады',
          icon: documents,
        },
        {
          name: 'Архив фото',
          icon: archive,
          link: '/account/archivephoto',
        },
      ],
    },
    {
      name: 'Настройки',
      icon: setting,
      action: () => setIsSattings(!isSattings),
      state: isSattings,
      list: [
        {
          name: 'Изменить профиль',
          link: '/account/settings/profile',
        },
        {
          name: 'Сменить пароль',
          link: '/account/settings/changepassword',
        },
      ],
    },
    {
      name: 'Выйти из аккаунта',
      link: '/account/exitaccount',
      icon: logout,
    },
    {
      name: 'Удалить аккаунт',
      icon: deleteImg,
      link: '/account/deleteaccount',
    },
    {
      name: user.email ? 'Личный кабинет' : 'Вход/Регистрация',
      link: user.email ? '/account/profile' : '/login/authorization',
      pk: true,
    },
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Автору',
      link: '/author',
    },
    {
      name: 'Новости',
      link: '/news',
    },
    {
      name: 'Участники',
      link: '/participants',
    },
    {
      name: 'Оргкомитет',
      link: '/organizationcomite',
    },
  ];

  return (
    <>
      <>
        {!location.pathname.includes('/account') && (
          <div className={`${styles.logo} ${props.login ? styles.loginLogo : ''}`}>
            <img src={logo} alt="logo" onClick={() => navigate('/')} />
          </div>
        )}
      </>
      <section className={styles.NavBar}>
        <button className={styles.NavBarButton} onClick={() => context.setActiveMenu(true)}>
          <p>Меню</p>
          <div className={styles.NavBarMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className={`${styles.menu} ${context.activeMenu ? styles.active : styles.disable}`}>
          <div className={styles.menuInner}>
            <button onClick={() => context.setActiveMenu(false)}>
              Скрыть <img src={closeImg} alt="Close" />
            </button>
            <ul>
              {naviList.map((item, index) => (
                <>
                  <li
                    className={item.pk ? styles.pk : ''}
                    key={index}
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
                    {/* фото справа */}
                    {item.list && (
                      <div className={styles.rigthImg}>
                        <img src={arrow} alt="arrow" className={item.state ? styles.rotate : ''} />
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
                                if (item.name === 'Мои доклады') {
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
                              {item.name === 'Мои доклады' && (
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
                              {item.name === 'Мои доклады' && isReports && (
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
                                    <span>+ Добавить доклад</span>
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
                                      <span>{item.name}</span>
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
                  }}
                >
                  Админ панель{' '}
                  <span className={styles.arowLi}>
                    <img src={ArrowMenu} alt="Arrow" />
                  </span>
                </li>
              )}
            </ul>
            <div className={styles.RightMenuText}>
              {stages?.length > 0 &&
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
    </>
  );
}

export default NavBar;
