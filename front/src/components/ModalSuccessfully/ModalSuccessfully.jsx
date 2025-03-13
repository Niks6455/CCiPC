import styles from './ModalSuccessfully.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';

function ModalSuccessfully({ open, setOpen }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.ModalSuccessfully}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <h2 className={styles.title}>Изменения успешно сохранены!</h2>
            <img src={circleGalka} alt="img" />
            <button onClick={() => setOpen(false)}>Закрыть</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModalSuccessfully;
