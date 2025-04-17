import styles from './AddCoauthor.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import leftArrow from './../../../assets/img/UI/leftArrow.svg';
import plus from './../../../assets/img/UI/plus.svg';
import errorList from './../../../assets/img/UI/errorZnak.svg';
import {
  addSoauthors,
  deleteCoauthor,
  disSeteEditData,
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
import InputListForma from '../../../components/InputListForma/InputListForma';
import { formParticipationList, participationStatus } from '../../../utils/Lists/List';
import ErrorModal from '../../../components/ErrorModal/ErrorModal';
import { useEffect, useState } from 'react';

function AddCoauthor({ edit, number, soauthorEditing, setSoauthorEditing }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector(state => state.reportCreateSlice);
  const conferenceId = useSelector(state => state.conferences?.data[0]?.id);
  const conference = useSelector(state => state.conferences.data[0]);
  const directions = useSelector(state => state.conferences.data[0]?.directions);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const funSetSoauthorEditing = (key, value) => {
    console.log('key, value', key, value);
    setSoauthorEditing({ ...soauthorEditing, [key]: value });
  };

  const funDeleteCoauthor = (index, id) => {
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
    if (soauthorEditing) {
      const temp = {
        organization: soauthorEditing.organization || '',
        form: soauthorEditing.form || '',
        status: soauthorEditing.status || '',
      };
      apiEditReport(report.data.id, temp).then(res => {
        if (res?.status === 200) {
          dispatch(fetchReports());
          navigate(`./../viewreports?idReport=${report.data.id}&number=${number}`);
          dispatch(disSetResetReport());
          setSoauthorEditing(null);
        } else {
          if (res?.response?.data?.errNum === 204) {
            setErrorModal(true);
          }
        }
      });
      return;
    }
    if (edit) {
      //! редактирование доклада
      console.log('report.data', report.data);
      let temp = {
        ...report.editData,
        coAuthorsIds: report.data?.coAuthorsIds,
        conclusion: report.data.fileExpertOpinion || '',
        reportFile: report.data.fileArticle || '',
        coAuthors: report.data?.soauthors
          .filter(el => !report.data.originSoauthors.some(e => e === el?.data?.id))
          ?.map(soauthor => ({
            name: soauthor?.data?.name || '',
            surname: soauthor?.data?.surname || '',
            patronymic: soauthor?.data?.patronymic || '',
            email: soauthor?.data?.email || '',
          })),
      };
      if (report.editData?.directionConference) {
        temp = {
          ...temp,
          directionId:
            directions.find(el => el.name === report.editData?.directionConference)?.id || '',
        };
      }
      if (report.editData?.comments) {
        temp = {
          ...temp,
          comment: report.editData?.comments,
        };
      }
      if (report.editData?.formParticipation) {
        temp = {
          ...temp,
          form: report.editData?.formParticipation,
        };
      }
      if (report.editData?.participationStatus) {
        temp = {
          ...temp,
          status: report.editData?.participationStatus,
        };
      }
      apiEditReport(report.data.id, temp).then(res => {
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
          Promise.all(uploadPromises).finally(() => {
            // Навигация после всех запросов (даже если что-то не загрузилось)
            navigate(`./../viewreports?idReport=${report.data.id}&number=${number}`);
            dispatch(disSetResetReport());
            dispatch(fetchReports());
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
        if (res?.status === 200) {
          // создаем формдату для файла
          if (report.data.fileArticle) {
            const formDataReport = new FormData();
            formDataReport.append('file', report.data.fileArticle);
            formDataReport.append('reportId', res?.data?.report?.id);
            uploadPhoto(formDataReport, 'REPORT'); // файл с докладом
          }
          if (report.data.fileExpertOpinion) {
            const formDataConcl = new FormData();
            formDataConcl.append('file', report.data.fileExpertOpinion);
            formDataConcl.append('reportId', res?.data?.report?.id);
            uploadPhoto(formDataConcl, 'CONCLUSION'); // файл с заключением
          }

          dispatch(fetchUserData());
          dispatch(fetchReports());
          dispatch(funSaveDataState());
        } else {
          if (res?.status === 409) {
            dispatch(
              setOpenPopUpName({
                name: 'FildeModal',
                text: 'Доклад с таким названием уже существует!',
              }),
            );
          } else {
            if (res?.response?.data?.errNum === 204) {
              setErrorModal(true);
            } else {
              dispatch(setOpenPopUpName({ name: 'FildeModal' }));
            }
          }
        }
      });
    }
  };

  const handleChangeForm = (key, value) => {
    console.log('index, key, value', key, value);
    setSoauthorEditing({ ...soauthorEditing, [key]: value });
    // dispatch(setCoauthorDataApi({ index, data: { [key]: value } }));
  };

  return (
    <div className={styles.AddCoauthor}>
      <ErrorModal title="Срок подачи докладов истек!" open={errorModal} close={setErrorModal} />
      {report?.openPopUpName && (
        <div className={styles.popups}>
          {report?.openPopUpName === 'SameEmail' && <SameEmail />}
          {report?.openPopUpName === 'SuccessModal' && <SuccessModal name={report?.data?.name} />}
          {report?.openPopUpName === 'FildeModal' && (
            <FildeModal name={report?.data?.name} text={report?.popUpText} />
          )}
          {report?.openPopUpName === 'NotFullyFilled' && (
            <NotFullyFilled name={report?.data?.name} />
          )}
          {report?.openPopUpName === 'NotFullyFilledCoauthors' && <NotFullyFilledCoauthors />}
        </div>
      )}

      {!soauthorEditing && (
        <div className={styles.head}>
          <h2 className={styles.title}>Соавторы</h2>
          {!edit && (
            <div className={styles.backImg}>
              <img src={leftArrow} alt="назад" draggable="false" onClick={() => navigate(-1)} />
            </div>
          )}
        </div>
      )}

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

      {soauthorEditing ? (
        <div className={styles.soauthorEditing}>
          <div className={styles.inputbox}>
            <InputLabel
              label={'Имя соавтора*'}
              type={'text'}
              value={soauthorEditing.fio.split(' ')[1]}
              readOnly={true}
            />
          </div>
          <div className={styles.inputbox}>
            <InputLabel
              label={'Фамилия соавтора*'}
              type={'text'}
              value={soauthorEditing.fio.split(' ')[0]}
              readOnly={true}
            />
          </div>

          {soauthorEditing.fio.split(' ')[2] && (
            <div className={styles.inputbox}>
              <InputLabel
                label={'Отчество соавтора'}
                type={'text'}
                value={soauthorEditing.fio.split(' ')[2]}
                readOnly={true}
              />
            </div>
          )}
          <div className={styles.inputbox}>
            <InputListForma
              name={'Форма участия'}
              list={formParticipationList}
              itemKey={'form'}
              value={soauthorEditing?.form}
              handleChangeForm={funSetSoauthorEditing}
            />
          </div>
          <div className={styles.inputbox}>
            <InputListForma
              name={'Статус участия'}
              list={participationStatus}
              itemKey={'status'}
              value={soauthorEditing.status}
              handleChangeForm={handleChangeForm}
              // error={funGetError(errors, 'participationStatus')}
            />
          </div>
          <div className={`${styles.input_organization}`}>
            <span>Организация</span>
            <input
              type="text"
              value={soauthorEditing.organization}
              onChange={e => handleChangeForm('organization', e.target.value)}
              placeholder="Ваша организация"
              onFocus={e => (e.target.placeholder = '')}
              onBlur={e => (e.target.placeholder = 'Ваша организация')}
            />
          </div>
        </div>
      ) : (
        <>
          {report?.data.soauthors?.map((soauthtor, index) => (
            <div key={index} className={styles.inputContainer}>
              <div className={styles.deletecoauthor}>
                {!soauthorEditing && (
                  <button onClick={() => funDeleteCoauthor(index, soauthtor.data.id)}>
                    <span>Удалить соавтора №{index + 1}</span>
                    <img src={trash} alt="удалить" />
                  </button>
                )}
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
                    readOnly={soauthorEditing || edit}
                  />
                  {soauthtor.autocompletion === 'noemail' && (
                    <div className={styles.modalEmail}>
                      <p>
                        Пользователь с такой почтой не найден на платформе. Необходимо внести данные
                        о соавторе вручную.
                      </p>
                      <button onClick={() => funNoEmail(index, false)}>Продолжить</button>
                    </div>
                  )}
                  {soauthtor.autocompletion === 'emailhave' && (
                    <div className={styles.modalEmail}>
                      <p>
                        Пользователь с такой почтой найден на платформе. Данные о соавторе
                        заполнятся автоматически, кроме его формы участия.
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
                          readOnly={soauthtor.autocompletion === 'readOnly' || edit}
                        />
                      </div>
                    ),
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}

      {!soauthorEditing && (
        <button
          className={`${styles.addsoaftor} ${report?.data.soauthors.length === 0 ? styles.addsoaftorNone : ''}`}
          onClick={() => dispatch(addSoauthors())}
        >
          <span>Добавить соавтора</span>
          <img src={plus} alt="+" />
        </button>
      )}


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
