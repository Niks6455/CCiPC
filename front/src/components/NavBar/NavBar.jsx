import { useContext, useEffect, useRef, useState } from 'react';
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

function NavBar(props) {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const stages = useSelector(state => state.conferences.data[0]?.stages);
  const location = useLocation();

  const [islks, setIslks] = useState(false);

  useEffect(() => {
    context.setActiveMenu(false);
    setIslks(location.pathname.includes('/account'));
  }, [location.pathname]);

  const naviList = [
    {
      name: 'Личный кабинет',
      list: [
        {
          name: autorisation ? 'Профиль' : 'Вход/Регистрация',
          icon: profile,
          link: autorisation ? '/account/profile' : '/login/authorization',
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
        <div
          className={`${styles.logo} ${islks ? styles.absluteLogo : ''} ${props.login ? styles.loginLogo : ''}`}
        >
          <img src={logo} alt="logo" onClick={() => navigate('/')} />
        </div>
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
                <li
                  key={index}
                  onClick={() => {
                    if (item.link) {
                      navigate(item.link);
                    }
                  }}
                >
                  {item.icon && (
                    <div className={styles.leftImg}>
                      <img src={item.icon} alt="item.icon" />
                    </div>
                  )}
                  <span>{item.name}</span>
                  {item.list && (
                    <div className={styles.rigthImg}>
                      <img src={arrow} alt="arrow" />
                    </div>
                  )}
                </li>
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
