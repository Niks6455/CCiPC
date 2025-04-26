import styles from './ScrollHeader.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function ScrollHeader({ userRole }) {
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navi = [
    {
      name: 'Панель администратора',
      path: '/adminPage/news',
      active: userRole === 1,
    },
    {
      name: 'Автору',
      path: '/author',
      active: true,
    },
    {
      name: 'Участники',
      path: '/participants',
      active: true,
    },
    {
      name: 'Оргкомитет',
      path: '/organizationcomite',
      active: true,
    },
    {
      name: autorisation ? 'Личный кабинет' : 'Вход',
      path: autorisation ? '/account/profile' : '/login/authorization',
      active: true,
    },
  ];

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 500) {
      if (currentScrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
    } else {
      setShow(false);
    }

    setLastScrollY(currentScrollY);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.ScrollHeader}
          initial={{ y: -500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -500, opacity: 0 }}
        >
          <ul>
            {navi.map(
              (el, index) =>
                el.active && (
                  <li key={index} onClick={() => navigate(el.path)}>
                    {el.name}
                  </li>
                ),
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollHeader;
