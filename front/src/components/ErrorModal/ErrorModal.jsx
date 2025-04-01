import styles from './ErrorModal.module.scss';
import error from '@assets/img/UI/error.svg';
import { AnimatePresence, motion } from 'framer-motion';

function ErrorModal({ title, open, close }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.ErrorModal_blur}
          >
            <motion.div
              className={styles.ErrorModal}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className={styles.title}>{title}</p>
              <img className={styles.galka} src={error} alt="img" />
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

export default ErrorModal;
