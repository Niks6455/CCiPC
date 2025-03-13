import styles from './ReqError.module.scss';
import { ReactComponent as ExitIcon } from '@assets/img/UI/x.svg';
import { AnimatePresence, motion } from 'framer-motion';

function ReqError({ errors, setErrors }) {
  const funExit = index => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };
  return (
    <div className={styles.ReqError}>
      <div className={styles.list}>
        <AnimatePresence>
          {errors.map((item, index) => (
            <motion.div
              key={index}
              className={styles.item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button onClick={() => funExit(index)}>
                <ExitIcon />
              </button>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReqError;
