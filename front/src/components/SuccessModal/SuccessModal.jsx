import styles from './SuccessModal.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';

function SuccessModal({ open, close }) {
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
              <p className={styles.title}>Данные успешно сохранены!</p>
              <img className={styles.galka} src={circleGalka} alt="img" />
              <button onClick={() => close(false)} className={styles.btnred}>
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SuccessModal;
