import styles from './HeaderPhone.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import arrow from '@assets/img/arrow.svg';
import archive from '@assets/img/headPhoneIcon/archive.svg';
import setting from '@assets/img/headPhoneIcon/setting.svg';
import logout from '@assets/img/headPhoneIcon/logout.svg';
import profile from '@assets/img/headPhoneIcon/profile.svg';
import documents from '@assets/img/headPhoneIcon/documents.svg';
import deleteImg from '@assets/img/headPhoneIcon/delete.svg';
import { AnimatePresence, motion } from 'framer-motion';

function HeaderPhone(props) {
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
    setActiveMenu(false);
    setActiveMenuListFirst(false);
    setActiveMenuListSecond(false);
  };

  const updateVisibility = () => {};

  useEffect(() => {
    updateVisibility(); // Initial check
    window.addEventListener('resize', updateVisibility); // Update on resize
    return () => window.removeEventListener('resize', updateVisibility); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div
        className={styles.HeaderPhoneContainer}
        style={{
          display: isVisible ? 'flex' : 'none',
          position: isVisible ? 'fixed' : 'absolute',
        }}
      >
        <button className={styles.NavBarMenuButton} onClick={() => setActiveMenu(!activeMenu)}>
          <div className={styles.NavBarMenu}>
            <span></span>
            <span></span>
          </div>
        </button>

        <AnimatePresence>
          {activeMenu && (
            <motion.section
              className={styles.NavBarMenuContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={styles.NavBarMenuContainerInner}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                ref={menuRef}
              >
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
                      <div
                        className={styles.NavBarMenuListInnerLi}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
                      >
                        <span> Личный кабинет</span>
                        <img
                          style={activeMenuListFirst ? { transform: 'rotate(180deg)' } : {}}
                          src={arrow}
                          alt="arrow"
                        />
                      </div>
                    </li>
                  ) : (
                    <li
                      onClick={() => {
                        navigate('/login/authorization');
                        setActiveMenu(false);
                      }}
                    >
                      <div
                        className={styles.NavBarMenuListInnerLi}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}
                      >
                        <span>Вход/Регистрация</span>
                      </div>
                    </li>
                  )}

                  <motion.div className={styles.NavBarMenuListOpener}>
                    <AnimatePresence>
                      {activeMenuListFirst && user?.email && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          {!props.login && (
                            <li
                              onClick={() =>
                                user?.email
                                  ? navigate('/account/profile')
                                  : navigate('/login/authorization')
                              }
                            >
                              <div className={styles.NavBarMenuListInnerLiImg}>
                                <span>
                                  <img src={profile} />
                                </span>
                                <p>{user?.email ? 'Профиль' : 'Вход/Регистрация'}</p>
                              </div>
                            </li>
                          )}

                          <li onClick={() => setIsReports(!isReports)}>
                            <div className={styles.NavBarMenuListInnerLiImg}>
                              <span>
                                <img src={documents} />
                              </span>
                              <p>Мои доклады</p>
                              <img
                                className={styles.arrow_rep}
                                style={isReports ? { transform: 'rotate(180deg)' } : {}}
                                src={arrow}
                                alt="arrow"
                              />
                            </div>
                          </li>
                          {/* лист докладов */}
                          <AnimatePresence>
                            {isReports && (
                              <motion.ul
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className={styles.reports}
                              >
                                <li
                                  onClick={() => {
                                    navigate('/account/documents');
                                    setActiveMenu(false);
                                  }}
                                >
                                  + Добавить доклад
                                </li>
                                {reports.map((item, index) => (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      navigate(
                                        `/account/viewreports?idReport=${item.id}&number=${index + 1}`,
                                      );
                                      setActiveMenu(false);
                                    }}
                                  >
                                    <span>{item.name}</span>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                          <li onClick={() => navigateTo('/account/archivephoto')}>
                            <div className={styles.NavBarMenuListInnerLiImg}>
                              <span>
                                <img src={archive} />
                              </span>
                              <p>Архив фото</p>
                            </div>
                          </li>
                          <li onClick={() => setActiveMenuListSecond(!activeMenuListSecond)}>
                            <div
                              className={styles.NavBarMenuListInnerLi}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'end',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={setting} style={{ marginRight: '5px' }} />
                                Настройки
                              </span>
                              <img
                                style={activeMenuListSecond ? { transform: 'rotate(180deg)' } : {}}
                                src={arrow}
                                alt="arrow"
                              />
                            </div>
                          </li>
                          <AnimatePresence>
                            {activeMenuListSecond && (
                              <motion.div
                                className={styles.NavBarMenuListOpener}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <li onClick={() => navigateTo('/account/settings/profile')}>
                                  <div className={styles.NavBarMenuListInnerLiImg}>
                                    <span>{/* <img src={deleteImg} /> */}</span>
                                    <p>Изменить профиль</p>
                                  </div>
                                </li>
                                <li onClick={() => navigateTo('/account/settings/changepassword')}>
                                  <div className={styles.NavBarMenuListInnerLiImg}>
                                    <span>{/* <img src={deleteImg} /> */}</span>
                                    <p>Сменить пароль</p>
                                  </div>
                                </li>
                              </motion.div>
                            )}
                            <li onClick={() => navigateTo('/account/exitaccount')}>
                              <div className={styles.NavBarMenuListInnerLiImg}>
                                <span>
                                  <img src={logout} />
                                </span>
                                <p>Выйти из аккаунта</p>
                              </div>
                            </li>

                            <li onClick={() => navigateTo('/account/deleteaccount')}>
                              <div className={styles.NavBarMenuListInnerLiImg}>
                                <span>
                                  <img src={deleteImg} />
                                </span>
                                <p>Удалить аккаунт</p>
                              </div>
                            </li>
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <li onClick={() => navigateTo('/')}>Главная</li>
                  <li onClick={() => navigateTo('/author')}>Автору</li>
                  <li onClick={() => navigateTo('/news')}>Новости</li>
                  <li onClick={() => navigateTo('/participants')}>Участники</li>
                  <li onClick={() => navigateTo('/organizationcomite')}>Оргкомитет</li>
                </ul>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HeaderPhone;
