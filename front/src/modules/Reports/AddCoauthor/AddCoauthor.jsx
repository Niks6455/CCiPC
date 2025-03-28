import styles from './AddCoauthor.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import leftArrow from './../../../assets/img/UI/leftArrow.svg';
import plus from './../../../assets/img/UI/plus.svg';
import errorList from './../../../assets/img/UI/errorZnak.svg';
import {
  addSoauthors,
  deleteCoauthor,
  disSetResetReport,
  funSaveDataState,
  setCoauthorAutocompletion,
  setCoauthorDataApi,
  setOpenPopUpName,
  setValueCoauthors,
} from '../../../store/reportCreateSlice/reportCreateSlice';
import InputLabel from '../../../ui/InputLabel/InputLabel';
import trash from './../../../assets/img/UI/trash.svg';
import {
  capitalizeFirstLetter,
  formatPhoneNumber,
  validateEmail,
} from '../../../utils/functions/Validations';
import { inpustType, inpustTypeEmail } from './data';
import SameEmail from '../../../components/AddReportModal/SameEmail/SameEmail';
import SuccessModal from '../../../components/AddReportModal/SuccessModal/SuccessModal';
import NotFullyFilled from '../../../components/AddReportModal/NotFullyFilled/NotFullyFilled';
import NotFullyFilledCoauthors from '../../../components/AddReportModal/NotFullyFilledCoauthors/NotFullyFilledCoauthors';
import {
  apiCreateReport,
  apiEditReport,
  getUserEmail,
  uploadPhoto,
} from '../../../apirequests/apirequests';
import { fetchUserData } from '../../../store/userSlice/user.Slice';
import { fetchReports } from '../../../store/reportsSlice/reportsSlice';
import FildeModal from '../../../components/AddReportModal/FildeModal/FildeModal';
import { useEffect } from 'react';

function AddCoauthor({ edit, number }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector(state => state.reportCreateSlice);
  const conferenceId = useSelector(state => state.conferences?.data[0]?.id);
  const conference = useSelector(state => state.conferences.data[0]);
  const directions = useSelector(state => state.conferences.data[0]?.directions);

  // useEffect(() => {
  //   if (!report.data?.name) {
  //     navigate('/account/createreport');
  //   }
  // }, []);

  const funDeleteCoauthor = (index, id) => {
    console.log('id', id);
    dispatch(deleteCoauthor({ index, id }));
  };

  const funNoEmail = (index, readOnly) => {
    if (readOnly) {
      dispatch(setCoauthorAutocompletion({ index, autocompletion: 'readOnly' }));
    } else {
      dispatch(setCoauthorAutocompletion({ index, autocompletion: 'true' }));
    }
  };

  const funChangeInput = (index, key, value) => {
    if (key === 'email') {
      if (validateEmail(value) && value) {
        getUserEmail(value).then(res => {
          console.log('res', res);
          if (res?.status === 200) {
            if (res?.data?.participant?.name) {
              dispatch(
                setCoauthorAutocompletion({
                  index,
                  autocompletion: 'emailhave',
                }),
              );
              dispatch(setCoauthorDataApi({ index, data: res.data.participant }));
            } else {
              dispatch(setCoauthorAutocompletion({ index, autocompletion: 'noemail' }));
              dispatch(setCoauthorDataApi({ index, data: null }));
            }
          } else {
            dispatch(setCoauthorAutocompletion({ index, autocompletion: 'noemail' }));
            dispatch(setCoauthorDataApi({ index, data: null }));
          }
        });
      }
      if (!validateEmail(value)) {
        dispatch(setCoauthorAutocompletion({ index, autocompletion: '' }));
      }
    }
    let newValue = value;
    const item = inpustType.find(el => el.key === key);
    if (key === 'phone') {
      newValue = formatPhoneNumber(value);
    }
    //! делаем букву заглавной
    if (item?.capitalLetter) {
      newValue = capitalizeFirstLetter(value);
    }
    //! применяем валидацию из списка
    if (item?.valdate) {
      if (!item.valdate(newValue)) {
        return;
      }
    }

    dispatch(setValueCoauthors({ index, key, value: newValue }));
  };

  //! сохранение данных
  const funSaveData = () => {
    console.log('report', report);
    if (edit) {
      //! редактирование доклада
      const temp = {
        coAuthors: report.data?.soauthors
          .filter(el => report.data.originSoauthors.map(soauthor => soauthor.id).includes(el.id))
          ?.map(soauthor => ({
            name: soauthor?.data?.name || '',
            surname: soauthor?.data?.surname || '',
            patronymic: soauthor?.data?.patronymic || '',
            email: soauthor?.data?.email || '',
          })),
        coAuthorsIds: report.data?.coAuthorsIds,
        comment: report.data.comments || '',
        conclusion: report.data.fileExpertOpinion || '',
        directionId: directions.find(el => el.name === report.data.directionConference).id || '',
        form: report.data.formParticipation || '',
        status: report.data.participationStatus || '',
        name: report.data.name || '',
        reportFile: report.data.fileArticle || '',
        organization: report.data.organization || '',
      };
      apiEditReport(report.data.id, temp).then(res => {
        console.log('res', res);
        if (res?.status === 200) {
          dispatch(fetchReports());
          const uploadPromises = [];
          // Если fileArticle — файл, добавляем загрузку в массив промисов
          if (typeof report.data.fileArticle !== 'string') {
            const formDataReport = new FormData();
            formDataReport.append('file', report.data.fileArticle);
            formDataReport.append('reportId', res?.data?.report?.id);
            uploadPromises.push(uploadPhoto(formDataReport, 'REPORT'));
          }
          // Если fileExpertOpinion — файл, добавляем загрузку в массив промисов
          if (typeof report.data.fileExpertOpinion !== 'string') {
            const formDataConcl = new FormData();
            formDataConcl.append('file', report.data.fileExpertOpinion);
            formDataConcl.append('reportId', res?.data?.report?.id);
            uploadPromises.push(uploadPhoto(formDataConcl, 'CONCLUSION'));
          }
          // Ждем выполнения всех загрузок
          Promise.all(uploadPromises)
            .then(results => {
              // Проверяем, что все запросы успешны
              if (results.every(res => res?.status === 200)) {
                dispatch(fetchReports());
              }
            })
            .finally(() => {
              // Навигация после всех запросов (даже если что-то не загрузилось)
              navigate(`./../viewreports?idReport=${report.data.id}&number=${number}`);
              dispatch(disSetResetReport());
            });
        }
      });

      return;
    } else {
      //! создание доклада
      const data = {
        name: report.data.name,
        form: report.data.formParticipation,
        directionId: conference?.directions.find(el => el.name === report.data.directionConference)
          .id,
        comment: report.data.comments,
        organization: report.data.organization,
        status: report.data.participationStatus || '',
        coAuthors: report.data.soauthors.map(el => ({
          name: el.data.name,
          surname: el.data.surname,
          patronymic: el.data.patronymic,
          email: el.data.email,
        })),
        conferenceId: conferenceId,
      };
      apiCreateReport(data).then(res => {
        console.log('res', res);
        if (res?.status === 200) {
          // создаем формдату для файла
          const formDataReport = new FormData();
          formDataReport.append('file', report.data.fileArticle);
          formDataReport.append('reportId', res?.data?.report?.id);
          const formDataConcl = new FormData();
          formDataConcl.append('file', report.data.fileExpertOpinion);
          formDataConcl.append('reportId', res?.data?.report?.id);
          uploadPhoto(formDataReport, 'REPORT'); // файл с докладом
          uploadPhoto(formDataConcl, 'CONCLUSION'); // файл с заключением
          dispatch(fetchUserData());
          dispatch(fetchReports());
          dispatch(funSaveDataState());
        } else {
          dispatch(setOpenPopUpName({ name: 'FildeModal' }));
        }
      });
    }
  };

  return (
    <div className={styles.AddCoauthor}>
      {report?.openPopUpName && (
        <div className={styles.popups}>
          {report?.openPopUpName === 'SameEmail' && <SameEmail />}
          {report?.openPopUpName === 'SuccessModal' && <SuccessModal name={report?.data?.name} />}
          {report?.openPopUpName === 'FildeModal' && <FildeModal name={report?.data?.name} />}
          {report?.openPopUpName === 'NotFullyFilled' && (
            <NotFullyFilled name={report?.data?.name} />
          )}
          {report?.openPopUpName === 'NotFullyFilledCoauthors' && <NotFullyFilledCoauthors />}
        </div>
      )}

      <div className={styles.head}>
        <h2 className={styles.title}>Соавторы</h2>
        {!edit && (
          <div className={styles.backImg}>
            <img src={leftArrow} alt="назад" draggable="false" onClick={() => navigate(-1)} />
          </div>
        )}
      </div>

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

      {report?.data.soauthors?.map((soauthtor, index) => (
        <div key={index} className={styles.inputContainer}>
          <div className={styles.deletecoauthor}>
            <button onClick={() => funDeleteCoauthor(index, soauthtor.data.id)}>
              <span>Удалить соавтора №{index + 1}</span>
              <img src={trash} alt="удалить" />
            </button>
          </div>
          {inpustTypeEmail.map(inp => (
            <div className={styles.inputbox} key={inp.id}>
              <InputLabel
                label={inp.label}
                type={inp.type}
                index={index}
                itemKey={inp.key}
                value={soauthtor.data?.[inp.key]}
                funChange={funChangeInput}
                placeholder={inp.placeholder}
                error={inp.error}
              />
              {soauthtor.autocompletion === 'noemail' && (
                <div className={styles.modalEmail}>
                  <p>
                    Пользователь с такой почтой не найден на платформе. Необходимо внести данные о
                    соавторе вручную.
                  </p>
                  <button onClick={() => funNoEmail(index, false)}>Продолжить</button>
                </div>
              )}
              {soauthtor.autocompletion === 'emailhave' && (
                <div className={styles.modalEmail}>
                  <p>
                    Пользователь с такой почтой найден на платформе. Данные о соавторе заполнятся
                    автоматически, кроме его формы участия.
                  </p>
                  <button onClick={() => funNoEmail(index, true)}>Продолжить</button>
                </div>
              )}
            </div>
          ))}

          {(soauthtor.autocompletion === 'true' || soauthtor.autocompletion === 'readOnly') && (
            <>
              {inpustType.map(inp =>
                inp.key === 'patronymic' &&
                !soauthtor.data[inp.key] &&
                soauthtor.autocompletion === 'readOnly' ? (
                  <></>
                ) : (
                  <div className={styles.inputbox} key={inp.id}>
                    <InputLabel
                      label={inp.label}
                      type={inp.type}
                      index={index}
                      itemKey={inp.key}
                      value={soauthtor.data[inp.key]}
                      funChange={funChangeInput}
                      placeholder={inp.placeholder}
                      error={inp.error}
                      readOnly={soauthtor.autocompletion === 'readOnly'}
                    />
                  </div>
                ),
              )}
            </>
          )}
        </div>
      ))}
      <button className={styles.addsoaftor} onClick={() => dispatch(addSoauthors())}>
        <span>Добавить соавтора</span>
        <img src={plus} alt="+" />
      </button>

      <div className={styles.srokContainer}>
        <div className={styles.text}>
          <img src={errorList} alt="img" />
          <span>
            В срок до {conference?.dedlineReport1} необходимо прислать заявку на доклад, а в срок до{' '}
            {conference?.dedlineReport2} загрузить статью и экспертное заключение.
          </span>
        </div>
        <button onClick={funSaveData}>{edit ? 'Сохранить изменения' : 'Сохранить'}</button>
      </div>
    </div>
  );
}

export default AddCoauthor;
