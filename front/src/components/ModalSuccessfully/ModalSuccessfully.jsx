import styles from './ModalSuccessfully.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import redX from '@assets/img/UI/redX.svg';
import { AnimatePresence, motion } from 'framer-motion';

function ModalSuccessfully({ open, setOpen }) {
  const funExit = () => {
    setOpen(null);
  };
  return (
    <AnimatePresence>
      {open !== null && (
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
            {open ? (
              <>
                <h2 className={styles.title}>Изменения успешно сохранены!</h2>
                <img src={circleGalka} alt="img" />
              </>
            ) : (
              <>
                <h2 className={styles.title}>Ошибка при сохранении данных!</h2>
                <img src={redX} alt="img" />
              </>
            )}

            <button onClick={funExit}>Закрыть</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModalSuccessfully;
