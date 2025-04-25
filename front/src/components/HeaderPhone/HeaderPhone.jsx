import styles from './HeaderPhone.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import arrow from '@assets/img/arrow.svg';
import archive from '@assets/img/headPhoneIcon/archive2.svg';
import setting from '@assets/img/headPhoneIcon/setting.svg';
import logout from '@assets/img/headPhoneIcon/logout.svg';
import profile from '@assets/img/headPhoneIcon/profile.svg';
import documents from '@assets/img/headPhoneIcon/documents.svg';
import deleteImg from '@assets/img/headPhoneIcon/delete.svg';

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
        className={`${styles.HeaderPhoneContainer} ${isVisible ? styles.fixedPosition : ''}`}
      >
        <button className={styles.NavBarMenuButton} onClick={() => setActiveMenu(!activeMenu)}>
          <div className={styles.NavBarMenu}>
            <span></span>
            <span></span>
          </div>
        </button>

        {activeMenu && (
          <div className={`${styles.NavBarMenuContainer} ${styles.open}`} ref={menuRef}>
            <div className={styles.NavBarMenuContainerInner}>
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
                    <div className={styles.NavBarMenuListInnerLi}>
                      <span>Вход/Регистрация</span>
                    </div>
                  </li>
                )}

                {activeMenuListFirst && user?.email && (
                  <div className={styles.NavBarMenuListOpener}>
                    <li onClick={() => navigate('/account/profile')}>
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={profile} />
                        </span>
                        <p>{user?.email ? 'Профиль' : 'Вход/Регистрация'}</p>
                      </div>
                    </li>

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
                    {isReports && (
                      <ul className={styles.reports}>
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
                            <span>
                              {item.name.length < 20
                                ? item.name
                                : item.name.slice(0, 20) + '...'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <li onClick={() => navigate('/account/archivephoto')}>
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={archive} />
                        </span>
                        <p>Архив фото</p>
                      </div>
                    </li>

                    <li onClick={() => setActiveMenuListSecond(!activeMenuListSecond)}>
                      <div className={styles.NavBarMenuListInnerLi}>
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
                    {activeMenuListSecond && (
                      <div className={styles.NavBarMenuListOpener}>
                        <li onClick={() => navigate('/account/settings/profile')}>
                          <div className={styles.NavBarMenuListInnerLiImg}>
                            <span></span>
                            <p>Изменить профиль</p>
                          </div>
                        </li>
                        <li onClick={() => navigate('/account/settings/changepassword')}>
                          <div className={styles.NavBarMenuListInnerLiImg}>
                            <span></span>
                            <p>Сменить пароль</p>
                          </div>
                        </li>
                      </div>
                    )}
                    <li onClick={() => navigate('/account/exitaccount')}>
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={logout} />
                        </span>
                        <p>Выйти из аккаунта</p>
                      </div>
                    </li>

                    <li onClick={() => navigate('/account/deleteaccount')}>
                      <div className={styles.NavBarMenuListInnerLiImg}>
                        <span>
                          <img src={deleteImg} />
                        </span>
                        <p>Удалить аккаунт</p>
                      </div>
                    </li>
                  </div>
                )}

                <li onClick={() => navigateTo('/')}>Главная</li>
                <li onClick={() => navigateTo('/author')}>Автору</li>
                <li onClick={() => navigateTo('/news')}>Новости</li>
                <li onClick={() => navigateTo('/participants')}>Участники</li>
                <li onClick={() => navigateTo('/organizationcomite')}>Оргкомитет</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderPhone;
