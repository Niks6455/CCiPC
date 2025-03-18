import styles from './HeadBlock.module.scss';
import exportIcon from '@assets/img/AdminPanel/export.svg';
import lupa from '@assets/img/UI/lupa.svg';
import { apiExportArchiveState, apiExportReports } from '../../../../apirequests/apirequests';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function HeadBlock({ conferenceid, shearchParam, setShearchParam, funSaveTableData }) {
  const [loadingArhive, setLoadingArchive] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const funExportArchive = async () => {
    if (!conferenceid) return;
    setLoadingArchive(true);
    try {
      const response = await apiExportArchiveState(conferenceid);
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archive_${conferenceid}.zip`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setLoadingArchive(false);
    } catch (error) {
      console.error('Ошибка при скачивании архива:', error);
      setLoadingArchive(false);
    }
  };

  const funExportRepots = async () => {
    if (!conferenceid) return;
    setLoadingDoc(true);
    try {
      const response = await apiExportReports(conferenceid);
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archive_${conferenceid}.xlsx`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setLoadingDoc(false);
    } catch (error) {
      console.error('Ошибка при скачивании архива:', error);
      setLoadingDoc(false);
    }
  };
  return (
    <div className={styles.HeadBlock}>
      <div className={styles.left_block}>
        <img src={lupa} alt="🔍" />
        <input
          value={shearchParam}
          onChange={e => setShearchParam(e.target.value)}
          type="text"
          placeholder="Поиск"
        />
      </div>
      <div className={styles.right_block}>
        <button className={styles.save} onClick={funSaveTableData}>
          Сохранить
        </button>
        <button className={styles.export_staty} onClick={funExportArchive}>
          <AnimatePresence>
            {loadingArhive ? (
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className={styles.loading}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{
                  opacity: { duration: 1 }, // Плавное появление за 1 секунду
                  rotate: { repeat: Infinity, duration: 1, ease: 'linear' }, // Бесконечное вращение
                }}
              />
            ) : (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={exportIcon}
                alt="->"
              />
            )}
          </AnimatePresence>
          <span>Экспорт архива статей</span>
        </button>
        <button className={styles.export_doklad} onClick={funExportRepots}>
          <AnimatePresence>
            {loadingDoc ? (
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className={styles.loading}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{
                  opacity: { duration: 1 }, // Плавное появление за 1 секунду
                  rotate: { repeat: Infinity, duration: 1, ease: 'linear' }, // Бесконечное вращение
                }}
              />
            ) : (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={exportIcon}
                alt="->"
              />
            )}
          </AnimatePresence>
          <span>Экспорт докладов</span>
        </button>
      </div>
    </div>
  );
}

export default HeadBlock;
