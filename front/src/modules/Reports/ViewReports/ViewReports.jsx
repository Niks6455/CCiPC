import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Импортируем хук для работы с query params
import styles from './ViewReports.module.scss';
import BlockFile from './../../../assets/img/UI/blackFile.svg';
import DOC from './../../../assets/img/UI/DOC.svg';
import { ReactComponent as Trash } from './../../../assets/img/UI/trash.svg';
import { apiDeleteReport, apiGetReportId, server } from '../../../apirequests/apirequests';
import { disDeleteReport } from '../../../store/reportsSlice/reportsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { convertDateTire } from '../../../utils/functions/funcions';
import { disSetResetReport } from '../../../store/reportCreateSlice/reportCreateSlice';
import CircleLoader from '../../../components/CircleLoader/CircleLoader';
import { useTranslation } from 'react-i18next';

function ViewReports() {
  const { t } = useTranslation('viewReports');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user.data);

  const report = useSelector(state => state.reportsSlice.data);
  const [searchParams] = useSearchParams(); // Получаем query параметры
  const [reportData, setReportData] = useState(null);
  const [number, setNumber] = useState('');
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idReport, setIdReport] = useState(null);
  const conferense = useSelector(state => state.conferences?.data[0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    isPending: isLoading,
    data: reportQery,
    refetch,
  } = useQuery({
    queryKey: [`${idReport}`, idReport],
    queryFn: () => apiGetReportId(idReport),
    enabled: !!idReport,
  });

  useEffect(() => {
    if (idReport) {
      refetch();
    }
  }, []);

  useEffect(() => {
    setReportData(reportQery?.data?.report);
  }, [reportQery]);

  useEffect(() => {
    const idReport = searchParams.get('idReport'); // Получаем idReport из query параметров
    if (idReport) {
      setIdReport(idReport);
    }
    setNumber(searchParams.get('number')); // Получаем number из query параметров
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов

  //! функция удаления доклада
  const deleteReportOpenModal = () => {
    //! открываем попап удаления доклада
    setIsModalDelete(true);
  };

  const funDeleteReport = () => {
    //! удаляем доклад
    const id = idReport;
    apiDeleteReport(id).then(res => {
      if (res?.status === 200) {
        dispatch(disDeleteReport({ id }));
        setIsModalDelete(false);
        navigate('/account/profile');
      }
    });
  };

  const funOpenFile = file => {
    //открытие файла по ссылке
    if (file) {
      window.open(`${server}/${file?.url}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <>
        <CircleLoader />
      </>
    );
  }

  return (
    <section className={styles.ViewReports}>
      {isLoading === false && (
        <>
          <AnimatePresence>
            {isModalDelete && (
              <div className={styles.modal_container}>
                <motion.div
                  className={styles.modal_delete_report}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                >
                  <h2>{t('confirmDeleteTitle', { name: reportData?.name })}</h2>
                  <div className={styles.button_container}>
                    <button className={styles.cancle} onClick={() => setIsModalDelete(false)}>
                      {t('back')}
                    </button>
                    <button className={styles.delete} onClick={funDeleteReport}>
                      {t('deleteConfirm')}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className={styles.ViewReportsInner}>
            <div className={styles.ViewReportsInnerFirst}>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('author')}:</p>
                <p>{reportData?.author?.fio}</p>
              </div>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('reportTitle', { number })}:</p>
                <p>{reportData?.name}</p>
              </div>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('direction')}:</p>
                <p>{reportData?.direction?.name}</p>
              </div>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('form')}:</p>
                <p>{reportData?.author?.form}</p>
              </div>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('status')}:</p>
                <p>{reportData?.author?.status}</p>
              </div>
              <div className={styles.ViewReportsBlock}>
                <p className={styles.ViewReportsTitle}>{t('comment')}:</p>
                <p>{reportData?.comment}</p>
              </div>
            </div>

            <div className={styles.ViewReportsInnerSecond}>
              <div className={styles.ViewReportsSoauthors}>
                <p className={styles.ViewReportsTitle}>{t('coauthors')}:</p>

                {Array.from(
                  { length: reportData?.cacheCoAuthors },
                  (_, index) => index + reportData?.cacheCoAuthors,
                ).map((_, index) => (
                  <div key={index}>
                    <p className={styles.name}>
                      {t('coauthorNotRegistered', { index: index + 1 })}
                    </p>
                  </div>
                ))}

                {reportData?.coAuthors?.map((item, index) => (
                  <div key={index + 'coAuthors'}>
                    <p className={styles.name}>{`${
                      index + 1 + reportData?.cacheCoAuthors
                    }. ${item.fio}`}</p>
                    <ul>
                      <li>
                        <span>{t('organization')}:</span>
                        <p>{item?.organization || t('noCoauthors')}</p>
                      </li>
                      <li>
                        <span>{t('email')}:</span>
                        <p>{item?.email || t('noCoauthors')}</p>
                      </li>
                      <li>
                        <span>{t('phone')}:</span>
                        <p>{item?.phone || t('noCoauthors')}</p>
                      </li>
                      <li>
                        <span>{t('participationStatus')}:</span>
                        <p>{item?.status || t('noCoauthors')}</p>
                      </li>
                      <li>
                        <span>{t('participationForm')}:</span>
                        <p>{item?.form || t('noCoauthors')}</p>
                      </li>
                    </ul>
                  </div>
                ))}
                {reportData?.coAuthors?.length === 0 && reportData?.cacheCoAuthors === 0 && (
                  <p className={styles.name}>{t('noCoauthors')}</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.fileLouders}>
            <div className={styles.fileContur}>
              <p className={styles.fileLoudersTitle}>{t('reportFile')}:</p>
              <div
                className={`${styles.blockFile} ${reportData?.reportFile ? '' : styles.blockFileNoFile}`}
                onClick={() => funOpenFile(reportData?.reportFile)}
              >
                <img src={DOC} alt="img" />
                <div className={styles.fileName}>
                  <span>{reportData?.reportFile?.name || `${t('doc')}.docx`}</span>
                </div>
              </div>
            </div>
            <div className={styles.fileContur}>
              <p className={styles.fileLoudersTitle}>{t('conclusionFile')}:</p>
              <div
                className={`${styles.blockFile} ${reportData?.conclusion ? '' : styles.blockFileNoFile}`}
                onClick={() => funOpenFile(reportData?.conclusion)}
              >
                <img src={BlockFile} alt="img" />

                <div className={styles.fileName}>
                  <span>{reportData?.conclusion?.name || `${t('doc')}.pdf`}</span>
                </div>
              </div>
            </div>
          </div>
          {new Date(convertDateTire(conferense?.dedlineReport2)) > new Date() && (
            <div
              className={styles.EditDataReport}
              style={reportData?.author?.email !== user?.email ? { justifyContent: 'center' } : {}}
            >
              <button
                className={styles.button_edit}
                onClick={() => {
                  dispatch(disSetResetReport());
                  navigate(`/account/editreport?idReport=${idReport}&number=${number}`);
                }}
              >
                {t('edit')}
              </button>
              {reportData?.author?.email === user?.email && (
                <button className={styles.button_delete} onClick={deleteReportOpenModal}>
                  <span>{t('delete')}</span>
                  <Trash />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ViewReports;
