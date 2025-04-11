import styles from './ScrollHeader.module.scss';
import { useNavigate } from 'react-router-dom';
import ArrowMenu from './../../assets/img/ArrowMenu.png';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function ScrollHeader({ userRole }) {
  const autorisation = useSelector(state => state.user.status) === 'succeeded';
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navi = [
    {
      name: 'Админ панель',
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

    // Show header only if scrolled down more than 500 pixels
    if (currentScrollY > 500) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShow(false);
      } else {
        // Scrolling up
        setShow(true);
      }
    } else {
      // Hide header if less than 500 pixels
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
