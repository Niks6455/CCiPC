import styles from './ModalBeznal.module.scss';
import docIcon from '@assets/img/AdminPanel/docImport.svg';
import loadIcon from '@assets/img/AdminPanel/load.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { apiUpdateUser } from '../../../../apirequests/apirequests';
import { fetchUserData } from '../../../../store/userSlice/user.Slice';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../../../../apirequests/apirequests';
import { decodeFileName } from '../../../../utils/functions/funcions';
function ModalBeznal({ openModalBeznal, setOpenModalBeznal }) {
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
      console.log('response', response);
      if (!response.ok) throw new Error('Ошибка загрузки файла');
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
                Просим вас скачать шаблон договора, заполнить поля и{' '}
                <span>загрузить подписанный скан договора и скан квитанции</span> об оплате в личный
                кабинет
              </h2>
              <div className={styles.file_container}>
                <button className={styles.inner} onClick={() => funDownloadShablon('INDIVIDUAL')}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>Для ФИЗИЧЕСКОГО лица</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
                <button className={styles.inner} onClick={() => funDownloadShablon('LEGAL')}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>Для ЮРИДИЧЕСКОГО лица</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
              </div>
              <div className={styles.buttons}>
                <button onClick={() => setOpenModalBeznal(false)}>Сменить способ оплаты</button>
                <button onClick={funPutApiSelf}>Продолжить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalBeznal;
