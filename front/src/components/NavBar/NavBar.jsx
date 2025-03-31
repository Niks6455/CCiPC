import { useContext, useEffect, useRef, useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from './../../assets/img/closeImg.png';
import { useNavigate } from 'react-router-dom';
import DataContext from '../../context';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
function NavBar(props) {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const refMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (refMenu.current && !refMenu.current.contains(event.target)) {
        context.setActiveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context]);

  return (
    <section className={styles.NavBar}>
      <button className={styles.NavBarButton} onClick={() => context.setActiveMenu(true)}>
        <p>Меню</p>
        <div className={styles.NavBarMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div
        className={`${styles.menu} ${context.activeMenu ? styles.active : styles.disable}`}
        ref={refMenu}
      >
        <div className={styles.menuInner}>
          <button onClick={() => context.setActiveMenu(false)}>
            Скрыть <img src={closeImg} alt="Close" />
          </button>
          <ul>
            {!props.login && (
              <li
                onClick={() => {
                  navigate(autorisation ? '/account/profile' : '/login/authorization');
                  context.setActiveMenu(false);
                }}
              >
                {autorisation ? 'Личный кабинет' : 'Вход/Регистрация'}
                <span className={styles.arowLi}>
                  <img src={ArrowMenu} alt="Arrow" />
                </span>
              </li>
            )}

            <li
              onClick={() => {
                navigate('/');
                context.setActiveMenu(false);
              }}
            >
              Главная
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() => {
                navigate('/author');
                context.setActiveMenu(false);
              }}
            >
              Автору{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() => {
                navigate('/news');
                context.setActiveMenu(false);
              }}
            >
              Новости{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() => {
                navigate('/participants');
                context.setActiveMenu(false);
              }}
            >
              Участники{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li
              onClick={() => {
                navigate('/organizationcomite');
                context.setActiveMenu(false);
              }}
            >
              Оргкомитет{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            {context.userRole === 1 && (
              <li
                onClick={() => {
                  navigate('/adminPage/news');
                  context.setActiveMenu(false);
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
            <div className={styles.RightMenuTextCont}>
              <p className={styles.RightMenuTextGroup}>01.09.2024</p>
              <p>Представление текстов докладов и регистрационных форм</p>
            </div>
            <div className={styles.RightMenuTextCont}>
              <p className={styles.RightMenuTextGroup}>08.09.2024</p>
              <p>Информирование авторов о результатах экспертизы докладов</p>
            </div>
            <div className={styles.RightMenuTextCont}>
              <p className={styles.RightMenuTextGroup}>15.09.2024</p>
              <p>Оплата оргвзноса за опубликование принятых докладов</p>
            </div>
            <div className={styles.RightMenuTextCont}>
              <p className={styles.RightMenuTextGroup}>23.09.2024</p>
              <p>Начало работы конференции</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NavBar;
