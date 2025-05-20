import styles from './SuccessModal.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ open, close }) {
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const funCloce = () => {
    close(false);
    navigate('/account/profile');
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.SuccessModal_blur}
          >
            <motion.div
              className={styles.SuccessModal}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className={styles.title}>{t('par8')}</p>
              <img className={styles.galka} src={circleGalka} alt="img" />
              <button onClick={() => funCloce()} className={styles.btnred}>
                {t('par11')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SuccessModal;
