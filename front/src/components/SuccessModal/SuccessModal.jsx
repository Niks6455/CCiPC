import styles from './SuccessModal.module.scss';
import circleGalka from '@assets/img/UI/circleGalka.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ open, close }) {
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
              <p className={styles.title}>Изменения успешно сохранены!</p>
              <img className={styles.galka} src={circleGalka} alt="img" />
              <button onClick={() => funCloce()} className={styles.btnred}>
                Назад
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SuccessModal;
