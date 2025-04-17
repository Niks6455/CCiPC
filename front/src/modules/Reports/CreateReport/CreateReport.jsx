import { useEffect, useState } from 'react';
import styles from './CreateReport.module.scss';
import { formParticipationList, participationStatus } from '../../../utils/Lists/List';
import errorList from './../../../assets/img/UI/errorZnak.svg';
import { useDispatch, useSelector } from 'react-redux';
import { disSeteEditData, setValue } from '../../../store/reportCreateSlice/reportCreateSlice';
import InputListForma from '../../../components/InputListForma/InputListForma';
import { useNavigate } from 'react-router-dom';
import FileComponent from '../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { server } from '../../../apirequests/apirequests';
import { decodeText } from '../../../utils/functions/funcions';
import { funGetError, funValidateAll } from './functions';

function CreateReport({ edit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector(state => state.reportCreateSlice);
  const conference = useSelector(state => state.conferences.data[0]);
  const [errors, setErrors] = useState([]);

  //! функция скачивания шаблока
  const funDownloadShablon = async () => {
    try {
      const response = await fetch(`${server}/${conference?.files?.SAMPLE?.[0].url}`);
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      const blob = await response.blob();
      const name = decodeText(conference?.files?.SAMPLE?.[0].name);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const funChangeFile = (value, key) => {
    dispatch(setValue({ key: key, value: value }));
  };

  //! функция onClange на InputListForm
  const handleChangeForm = (name, text) => {
    dispatch(setValue({ key: name, value: text }));
    setErrors(prev => prev.filter(item => item.key !== name));
    if (edit) {
      dispatch(disSeteEditData({ key: name, value: text }));
    }
  };

  //! изменение названия доклада с валидацией
  const funChangeNameReport = value => {
    setErrors(prev => prev.filter(item => item.key !== 'name'));
    dispatch(setValue({ key: 'name', value: value }));
    if (edit) {
      dispatch(disSeteEditData({ key: 'name', value: value }));
    }
  };

  const funNextStep = () => {
    setErrors(funValidateAll(report.data));
    if (funValidateAll(report.data).length === 0) {
      navigate('/account/addcoauthor');
    }
  };

  const [file1Url, setFile1Url] = useState(null);
  const [file2Url, setFile2Url] = useState(null);
  useEffect(() => {
    if (report.data.fileArticle instanceof Blob) {
      const url1 = window.URL.createObjectURL(report.data.fileArticle);
      setFile1Url(url1);
    } else {
      console.error('fileArticle is not a valid Blob or File');
    }

    if (report.data.fileExpertOpinion instanceof Blob) {
      const url2 = window.URL.createObjectURL(report.data.fileExpertOpinion);
      setFile2Url(url2);
    } else {
      console.error('fileExpertOpinion is not a valid Blob or File');
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (file1Url) window.URL.revokeObjectURL(file1Url);
      if (file2Url) window.URL.revokeObjectURL(file2Url);
    };
  }, [report.data.fileArticle, report.data.fileExpertOpinion]);

  return (
    <div className={styles.CreateReport}>
      <h2 className={styles.title}>Доклад №{report.data.number}</h2>
      {!edit && (
        <div className={styles.slider}>
          <div
            className={styles.sliderInner}
            style={{
              width: `${report.sliderState}%`,
              transition: 'all 0.15s linear',
            }}
          ></div>
        </div>
      )}

      <p className={styles.nameReport}>Полное название доклада</p>

      <div className={styles.name_report_container}>
        {funGetError(errors, 'name') && (
          <div className={styles.error_name}>
            <span>{funGetError(errors, 'name')}</span>
          </div>
        )}
        <textarea
          type="text"
          className={`${funGetError(errors, 'name') ? styles.error_input_name : ''} ${styles.nameReportInput}`}
          value={report.data.name}
          onChange={event => funChangeNameReport(event.target.value)}
        />
      </div>

      <div className={styles.inputsContainer}>
        <InputListForma
          name={'Направление конференции'}
          list={conference?.directions.map(el => ({ text: el.name, id: el.id }))}
          itemKey={'directionConference'}
          value={report.data.directionConference}
          handleChangeForm={handleChangeForm}
          error={funGetError(errors, 'directionConference')}
        />
        <InputListForma
          name={'Форма участия'}
          list={formParticipationList}
          itemKey={'formParticipation'}
          value={report.data.formParticipation}
          handleChangeForm={handleChangeForm}
          error={funGetError(errors, 'formParticipation')}
        />
        <div className={`${styles.input_organization} ${styles.organization_mobile}`}>
          <span>Организация</span>
          <input
            type="text"
            value={report.data.organization}
            onChange={e => handleChangeForm('organization', e.target.value)}
            placeholder="Ваша организация"
            onFocus={e => (e.target.placeholder = '')}
            onBlur={e => (e.target.placeholder = 'Ваша организация')}
          />
        </div>
        <InputListForma
          name={'Статус участия'}
          list={participationStatus}
          itemKey={'participationStatus'}
          value={report.data.participationStatus}
          handleChangeForm={handleChangeForm}
          error={funGetError(errors, 'participationStatus')}
        />
      </div>
      <div className={styles.inputsContainer}>
        <div className={`${styles.input_organization} ${styles.organization_pc}`}>
          <span>Организация</span>
          <div className={styles.input_organization_block}>
            {funGetError(errors, 'organization') && (
              <span className={styles.error}>{funGetError(errors, 'organization')}</span>
            )}
            <input
              className={funGetError(errors, 'organization') ? styles.error_input : ''}
              type="text"
              value={report.data.organization}
              onChange={e => handleChangeForm('organization', e.target.value)}
              placeholder="Ваша организация"
              onFocus={e => (e.target.placeholder = '')}
              onBlur={e => (e.target.placeholder = 'Ваша организация')}
            />
          </div>
        </div>
      </div>

      <div className={styles.fileContainer}>
        <div className={styles.box}>
          <p>Добавить файл со статьёй</p>
          <div className={styles.fileContur}>
            <div className={styles.file_block}>
              <FileComponent
                logoHeader={
                  edit && report.data.fileArticle?.url && !file1Url
                    ? `${server}/${report.data.fileArticle?.url}`
                    : file1Url
                }
                data={report.data.fileArticle}
                setData={value => funChangeFile(value, 'fileArticle')}
                typeFile={['application/pdf']}
                accept={'.pdf'}
                name={'fileArticle'}
                icon={'pdf'}
                itemKey={'fileArticle'}
                fileSize={20} // размер файла
                text={'Необходимо загрузить<br/>файл в формате PDF'}
                fileName={
                  edit && report.data.fileArticle?.name
                    ? decodeText(report.data.fileArticle?.name)
                    : null
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <p>Добавить файл с экспертным заключением</p>
          <div className={styles.fileContur}>
            <div className={styles.file_block}>
              <FileComponent
                logoHeader={
                  edit && report.data.fileExpertOpinion && !file2Url
                    ? `${server}/${report.data.fileExpertOpinion?.url}`
                    : file2Url
                }
                data={report.data.fileExpertOpinion}
                setData={value => funChangeFile(value, 'fileExpertOpinion')}
                typeFile={['application/pdf']}
                accept={'.pdf'}
                name={'fileExpertOpinion'}
                icon={'pdf'}
                itemKey={'fileExpertOpinion'}
                fileSize={20} // размер файла
                text={'Необходимо загрузить<br/>файл в формате PDF'}
                fileName={
                  edit && report.data.fileExpertOpinion?.name
                    ? decodeText(report.data.fileExpertOpinion?.name)
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.context}>
        <p>Комментарий (пожелания по прибытию, по расселению; свободное текстовое поле)</p>
        <div className={styles.input_comments_block}>
          {funGetError(errors, 'comments') && (
            <span className={styles.error}>{funGetError(errors, 'comments')}</span>
          )}
          <textarea
            className={funGetError(errors, 'comments') ? styles.error_textarea : ''}
            type="text"
            placeholder="Ваш комментарий"
            onFocus={e => (e.target.placeholder = '')}
            onBlur={e => (e.target.placeholder = 'Ваш комментарий')}
            value={report.data.comments}
            onChange={event => {
              dispatch(setValue({ key: 'comments', value: event.target.value }));
              setErrors(prev => prev.filter(item => item.key !== 'comments'));
              if (edit) {
                dispatch(disSeteEditData({ key: 'comments', value: event.target.value }));
              }
            }}
          />
        </div>
      </div>
      {!edit && (
        <div className={styles.srokContainer}>
          <div className={styles.text}>
            <img src={errorList} alt="img" />
            <span>
              В срок до {conference?.dedlineReport1} необходимо прислать заявку на доклад, а в срок
              до {conference?.dedlineReport2} загрузить статью и экспертное заключение.
            </span>
          </div>
          <button onClick={() => funNextStep()}>Следующий шаг</button>
        </div>
      )}
    </div>
  );
}

export default CreateReport;
