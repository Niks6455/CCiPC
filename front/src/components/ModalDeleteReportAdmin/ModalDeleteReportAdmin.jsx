import styles from './ModalDeleteReportAdmin.module.scss';
import error from '@assets/img/UI/error.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { apiDeleteReport } from '../../apirequests/apirequests';

function ModalDeleteReportAdmin({ data, setData, setOriginalData, originalData }) {
  const funDelete = () => {
    apiDeleteReport(data.id).then(res => {
      if (res?.status === 200) {
        setData(null);
        setOriginalData(originalData.filter(item => item.id !== data.id));
      }
    });
  };
  return (
    <>
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.ModalDeleteReportAdmin_blur}
          >
            <motion.div
              className={styles.ModalDeleteReportAdmin}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <p className={styles.title}>Вы уверены что хотите удалить доклад?</p>
              <img className={styles.galka} src={error} alt="img" />
              <div className={styles.btns}>
                <button onClick={() => setData(null)} className={styles.btnred}>
                  Отмена
                </button>
                <button onClick={() => funDelete()} className={styles.btnred}>
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalDeleteReportAdmin;
