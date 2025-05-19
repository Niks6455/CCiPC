import styles from './ModalNal.module.scss';
import greenGalkaIcon from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function ModalNal(props) {
  const { t } = useTranslation('profile');
  return (
    <div className={styles.ModalNal}>
      <AnimatePresence>
        {props.openModal && (
          <motion.div
            className={styles.bacgraund}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.container}
              initial={{
                opacity: 0,
                transform: ' scale(0)',
              }}
              animate={{
                opacity: 1,
                transform: ' scale(1)',
              }}
              exit={{
                opacity: 0,
                transform: 'scale(0)',
              }}
            >
              <h2>{t('m6')}</h2>
              <img src={greenGalkaIcon} alt="✅" />
              <button onClick={() => props.setOpenModal(false)}>{t('goToProfile')}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalNal;
