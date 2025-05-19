import styles from './ModalBeznal.module.scss';
import docIcon from '@assets/img/AdminPanel/docImport.svg';
import loadIcon from '@assets/img/AdminPanel/load.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { apiUpdateUser } from '../../../../apirequests/apirequests';
import { fetchUserData } from '../../../../store/userSlice/user.Slice';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../../../../apirequests/apirequests';
import { useTranslation } from 'react-i18next';
function ModalBeznal({ openModalBeznal, setOpenModalBeznal }) {
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();
  const funPutApiSelf = () => {
    apiUpdateUser({ formPay: 'Безналичный' }).then(res => {
      if (res?.status === 200) {
        setOpenModalBeznal(false);
        dispatch(fetchUserData());
      }
    });
  };
  const conference = useSelector(state => state?.conferences?.data[0]);
  const funDownloadShablon = async docName => {
    try {
      const response = await fetch(`${server}/${conference?.files?.[docName]?.[0]?.url}`);
      if (!response.ok) throw new Error(t('m7'));
      const blob = await response.blob();
      const name = conference?.files?.[docName]?.[0]?.name;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name || 'default_filename.ext'; // Файл точно сохранится с этим именем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Освобождаем память
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  };

  return (
    <div className={styles.ModalBeznal}>
      <AnimatePresence>
        {openModalBeznal && (
          <motion.div
            className={styles.bacground}
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
              <h2 className={styles.title}>
                {t('m8')} <span>{t('m9')}</span> {t('m10')}
              </h2>
              <div className={styles.file_container}>
                <button className={styles.inner} onClick={() => funDownloadShablon('INDIVIDUAL')}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>{t('m11')}</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
                <button className={styles.inner} onClick={() => funDownloadShablon('LEGAL')}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>{t('m12')}</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
              </div>
              <div className={styles.buttons}>
                <button onClick={() => setOpenModalBeznal(false)}>{t('changeFormPay')}</button>
                <button onClick={funPutApiSelf}>{t('m13')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalBeznal;
