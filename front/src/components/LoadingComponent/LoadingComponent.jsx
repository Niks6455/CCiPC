import styles from './LoadingComponent.module.scss';
import LogoHomePage from '@assets/img/logo.png';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function LoadingComponent({ setLoading, status }) {
  const conferences = useSelector(state => state.conferences.data);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (status === 'succeeded') setLoading(false);
            if (conferences?.data?.[0]?.id) setLoading(false);
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className={styles.LoadingComponent}>
      <div className={styles.container}>
        <motion.div
          className={styles.logo}
          // animate={{ scaleX: [1, -1, 1] }}
          // transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className={styles.imageWrapper}
            style={{
              filter: `grayscale(${100 - loadingProgress}%)`,
              maskImage: `linear-gradient(to top, #000 ${loadingProgress}%, transparent ${loadingProgress}%)`,
              WebkitMaskImage: `linear-gradient(to top, #000 ${loadingProgress}%, transparent ${loadingProgress}%)`,
              transition:
                'filter 0.3s ease-in-out, mask-image 0.3s ease-in-out, -webkit-mask-image 0.3s ease-in-out',
            }}
          >
            <img src={LogoHomePage} alt="LogoHomePage" />
          </div>
        </motion.div>
      </div>
      <div className={styles.loadingBar}>
        <div className={styles.progress} style={{ width: `${loadingProgress}%` }} />
      </div>
      <div className={styles.percentage}>{loadingProgress}%</div>
    </div>
  );
}

export default LoadingComponent;
