import styles from './HeadBlock.module.scss';
import exportIcon from '@assets/img/AdminPanel/export.svg';
import lupa from '@assets/img/UI/lupa.svg';
import { apiExportArchiveState, apiExportReports } from '../../../../apirequests/apirequests';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import arrow from '@assets/img/ArrowBotGreen.svg';

function HeadBlock({ conferenceid, shearchParam, setShearchParam, funSaveTableData }) {
  const [loadingArhive, setLoadingArchive] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [openlist, setOpenList] = useState(false);

  const funExportArchive = async () => {
    if (!conferenceid) return;
    setLoadingArchive(true);
    try {
      const response = await apiExportArchiveState(conferenceid);
      console.log('response', response);
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

  const buttons = [
    {
      name: 'Экспорт архива статей',
      fun: funExportArchive,
      loading: loadingArhive,
      buttonClass: styles.export_staty,
    },
    {
      name: 'Экспорт докладов в Excel',
      fun: funExportRepots,
      loading: loadingDoc,
      buttonClass: styles.export_doklad,
    },
    // {
    //   name: 'Экспорт экспертных заключений',
    //   fun: funExportRepots,
    //   loading: loadingDoc,
    //   buttonClass: styles.export_doklad,
    // },
    // {
    //   name: 'Экспорт фотографий пользователей',
    //   fun: funExportRepots,
    //   loading: loadingDoc,
    //   buttonClass: styles.export_doklad,
    // },
  ];

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
        <div className={styles.container_list}>
          <button
            className={`${styles.open_list} ${openlist ? styles.open_list_open : ''}`}
            onClick={() => setOpenList(!openlist)}
          >
            <AnimatePresence>
              {buttons.find(el => el.loading)?.loading ? (
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
            <span>Экспорт</span>
            <img
              className={`${styles.arrow} ${openlist ? styles.open_arrow : ''}`}
              src={arrow}
              alt="arrow"
            />
          </button>
          <AnimatePresence>
            {openlist && (
              <motion.div
                className={styles.list}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                {buttons.map((button, index) => (
                  <button onClick={button.fun} key={index}>
                    {button.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default HeadBlock;
