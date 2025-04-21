import styles from './ModalCompleteConference.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';

function ModalCompleteConference({ open, close, funSave }) {
  const funCloce = () => {
    close(false);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.ModalCompleteConference_blur}
          >
            <motion.div
              className={styles.ModalCompleteConference}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className={styles.title}>Вы уверены что хотите завершить конференцию!</p>
              {/* <img className={styles.galka} src={circleGalka} alt="img" /> */}
              <div className={styles.buttons}>
                <button onClick={() => funCloce()} className={styles.btnred}>
                  Назад
                </button>
                <button onClick={() => funSave()} className={styles.btngreen}>
                  Завершить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalCompleteConference;
