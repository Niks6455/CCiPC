import React, { useEffect, useState } from 'react';
import styles from './DocumentsLk.module.scss';
import { useNavigate } from 'react-router-dom';
import document from './../../../assets/img/document.svg';
import plus from './../../../assets/img/UI/plusLigth.svg';
import { useDispatch, useSelector } from 'react-redux';
import { disSetResetReport } from '../../../store/reportCreateSlice/reportCreateSlice';
import { convertDateTire } from '../../../utils/functions/funcions';
import { useTranslation } from 'react-i18next';

function DocumentsLk() {
  const { t } = useTranslation('documentsLk');
  const conferense = useSelector(state => state.conferences?.data[0]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reports = useSelector(state => state.reportsSlice.data);
  const [length, setLength] = useState(reports.length);

  useEffect(() => {
    setLength(reports.length);
  }, [reports]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //! при клике на создать доклад
  const creatReaport = () => {
    navigate('/account/createreport');
    dispatch(disSetResetReport(length + 1));
  };

  return (
    <section className={styles.DocumentsLk}>
      <div className={styles.notDocument}>
        <div className={styles.notDocumentInner}>
          <div className={styles.notDocumentInnerImg}>
            <img src={document} alt="Документ" />
          </div>
          <div className={styles.notDocumentTitle}>
            <p>{length > 0 ? t('addReport') : t('createReport')}</p>
          </div>
          <div className={styles.notDocumentSubTitle}>
            {length === 0 && <p>{t('noReports')}</p>}
          </div>

          <div className={styles.notDocumentButton}>
            {new Date(convertDateTire(conferense?.dedlineReport2)) > new Date() ? (
              <button onClick={creatReaport}>
                <img src={plus} alt="+" /> <span>{t('buttonCreate')}</span>
              </button>
            ) : (
              <span className={styles.dedline}>{t('deadlineClosed')}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocumentsLk;
