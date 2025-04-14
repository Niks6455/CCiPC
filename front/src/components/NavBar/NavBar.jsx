import { useContext, useEffect, useRef, useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from './../../assets/img/closeImg.png';
import { useLocation, useNavigate } from 'react-router-dom';
import DataContext from '../../context';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import logo from '@assets/img/logo.png';
import { convertDate } from '../../utils/functions/funcions';

function NavBar(props) {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const stages = useSelector(state => state.conferences.data[0]?.stages);

  const location = useLocation();

  useEffect(() => {
    context.setActiveMenu(false);
  }, [location.pathname]);
  return (
    <section className={styles.NavBar}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" onClick={() => navigate('/')} />
      </div>
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
            {!props.login && (
              <li
                onClick={() => {
                  navigate(autorisation ? '/account/profile' : '/login/authorization');
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
              }}
            >
              Оргкомитет{' '}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
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
  );
}

export default NavBar;
