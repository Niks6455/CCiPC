import styles from './ModalDeleteReportAdmin.module.scss';
import error from '@assets/img/UI/error.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { apiDeleteReport } from '../../apirequests/apirequests';
import { useTranslation } from 'react-i18next';

function ModalDeleteReportAdmin({ data, setData, setOriginalData, originalData }) {
  const { t } = useTranslation('global');
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
              <p className={styles.title}>{t('par5')}</p>
              <img className={styles.galka} src={error} alt="img" />
              <div className={styles.btns}>
                <button onClick={() => setData(null)} className={styles.btnred}>
                  {t('par6')}
                </button>
                <button onClick={() => funDelete()} className={styles.btnred}>
                  {t('par7')}
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
