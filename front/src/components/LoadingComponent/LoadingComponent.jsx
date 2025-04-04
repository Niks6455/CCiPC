import styles from './LoadingComponent.module.scss';
import LogoHomePage from '@assets/img/logo.png';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function LoadingComponent({ setLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setLoading(false);
          return 10;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  return (
    <div className={styles.LoadingComponent}>
      <div className={styles.container}>
        <motion.div
          className={styles.logo}
          animate={{ scaleX: [1, -1, 1] }} // Анимация от 1 к -1 и обратно к 1
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} // Плавное повторение
        >
          <img src={LogoHomePage} alt="LogoHomePage" />
        </motion.div>
      </div>
      <div className={styles.loadingBar}>
        <div
          className={styles.progress}
          style={{ width: `${loadingProgress * 10}%` }} // Dynamic width based on loading progress
        />
      </div>
      <div className={styles.percentage}>{loadingProgress * 10}%</div>
    </div>
  );
}

export default LoadingComponent;
