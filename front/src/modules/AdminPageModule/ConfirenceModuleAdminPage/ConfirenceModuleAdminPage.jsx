import { useEffect, useState } from 'react';
import styles from './ConfirenceModuleAdminPage.module.scss';
import StagesConference from './StagesConference/StagesConference';
import Logotips from './Logotips/Logotips';
import DocumentsModule from './DocumentsModule/DocumentsModule';
import AboutConference from './AboutConference/AboutConference';
import Directions from './Directions/Directions';
import DateAdsess from './DateAdsess/DateAdsess';
import Organizers from './Organizers/Organizers';
import {
  apiCreateConferences,
  apiDeleteMulti,
  apiFinishConfirm,
  apiGetConferencesById,
  apiPutConferencesById,
  uploadMulti,
} from '../../../apirequests/apirequests';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { convertDate, convertDateTire, hasDuplicates } from '../../../utils/functions/funcions';
import ModalSuccessfully from '../../../components/ModalSuccessfully/ModalSuccessfully';
import { conferenceDataNull, fileKeys } from './data';
import ReqError from '../../../components/ReqError/ReqError';
import {
  disResetConferences,
  fetchConferences,
} from '../../../store/conferencesSlice/conferences.Slice';
// import CircleLoader from '../../../components/CircleLoader/CircleLoader';
import ModalCompleteConference from '../../../components/ModalCompleteConference/ModalCompleteConference';
import ErrorModal from '../../../components/ErrorModal/ErrorModal';

function ConfirenceModuleAdminPage() {
  const dispatch = useDispatch();
  const [data, setData] = useState(conferenceDataNull);
  const conferenses = useSelector(state => state.conferences?.data);
  const [conferenseId, setConferenseId] = useState(null);
  const [deleteOrganizer, setDeleteOrganizer] = useState([]);
  const [deletePartners, setDeletePartners] = useState([]);
  const [modalSucces, setModalSucces] = useState(null);
  const [errors, setErrors] = useState([]);
  const [complate, setComplate] = useState(false);
  const [validateError, setValidateError] = useState(null);
  const [errorModalTitle, setErrorModalTitle] = useState(null);

  const {
    data: conferensetQery,
    isPending: isLoading,
    refetch: refetchConferense,
  } = useQuery({
    queryKey: [`${conferenseId}`, conferenseId],
    queryFn: () => apiGetConferencesById(conferenseId),
    enabled: !!conferenseId,
  });

  const funSetErrors = (key, value) => {
    setErrors(errors => [
      ...errors,
      {
        key: key,
        succes: value,
        text: fileKeys?.find(item => item.name === key)?.errorname,
      },
    ]);
  };

  //! запись id конференции
  useEffect(() => {
    if (conferenses?.[0]?.id) {
      setConferenseId(conferenses[0]?.id);
    }
  }, [conferenses]);

  const funUpdData = () => {
    const qery = conferensetQery?.data?.conference;
    if (qery) {
      let data = {
        stages: qery.stages.map(item => ({
          date: convertDate(item.date),
          name: item.name,
        })),
        logoHeader: qery.files?.HEADER?.[0],
        logoFooter: qery.files?.FOOTER?.[0],
        programConference: qery.files?.PROGRAM?.[0],
        informationLetter: qery.files?.LETTER?.[0],
        worksCollection: qery.files?.COLLECTION?.[0],
        аrticleTemplate: qery.files?.SAMPLE?.[0],
        cashlessIndividual: qery.files?.INDIVIDUAL?.[0],
        cashlessEntities: qery.files?.LEGAL?.[0],
        aboutConference: qery.description,
        directions: qery.directions,
        dateFirst: qery.date?.[0]?.value,
        dateSecond: qery.date?.[1]?.value,
        address: qery.address,
        organizers: qery.files?.ORGANIZATION || [],
        partners: qery.files?.PARTNER || [],
        deadlineUploadingReports: convertDate(qery.deadline),
        deleteIds: [],
        directionsIds: [],
      };
      setData(data);
    }
    setDeleteOrganizer([]);
    setDeletePartners([]);
  };
  //! получение конференции
  useEffect(() => {
    funUpdData();
  }, [conferensetQery?.data?.conference]);

  //! отправка файлов массивом организаторы и партнеры
  const funApiEditFileMulti = (files, keys, conferenseId) => {
    if (files) {
      const formData = new FormData();
      formData.append('conferenceId', conferenseId);
      keys.map(key => {
        if (files[key.key]) {
          if (!files[key.key].url) {
            const file = files[key.key]?.value || files[key.key];
            if (file.length > 0) {
              file.map(el => {
                formData.append(key.name, el.value);
              });
            } else {
              formData.append(key.name, file);
            }
          }
        } else {
          funSetErrors(key.name, true);
        }
      });
      if (formData) {
        uploadMulti(formData).then(res => {
          if (res?.status !== 200) {
            funSetErrors('main', false);
          } else {
            funSetErrors('main', true);
            dispatch(fetchConferences());
          }
        });
      }
    }
  };

  const validate = () => {
    if (hasDuplicates(data.stages, 'name')) {
      setErrorModalTitle('Повторяющиеся названия этапов!');
      return false;
    }
    if (hasDuplicates(data.directions, 'name')) {
      setErrorModalTitle('Повторяющиеся названия направлений!');
      return false;
    }
    return true;
  };

  //! отправляем измененные данные на бэк
  const funEditDataApi = () => {
    if (!validate()) {
      return;
    }
    setData({
      ...data,
      stages: data.stages.filter(item => item.date && item.name),
      directions: data.directions?.filter(item => item?.name),
    });
    console.log('data', data);

    const dat = {
      stages: data.stages
        ?.filter(item => item.date && item.name)
        .map(item => ({
          date: convertDateTire(item.date),
          name: item.name,
        })),
      description: data.aboutConference,
      directions: data.directions?.filter(item => item?.name)?.map(item => item?.name),
      directionsIds: data.directionsIds, //! удаление направлений
      date: [convertDateTire(data.dateFirst), convertDateTire(data.dateSecond)],
      deadline: convertDateTire(data.deadlineUploadingReports) || null,
      address: data.address,
      partner: deletePartners,
      organization: deleteOrganizer,
    };

    //! если конференция создана
    if (conferenseId) {
      apiPutConferencesById(dat, conferenseId).then(res => {
        if (res?.status === 200) {
          setDeleteOrganizer([]);
          setDeletePartners([]);
          funSetErrors('main', true);
          setModalSucces(true);
          dispatch(fetchConferences());
          //! загрузка файлов
          funApiEditFileMulti(data, fileKeys, conferenseId);
          //! удаление файлов
          if (data.deleteIds.length > 0) {
            apiDeleteMulti({ ids: data.deleteIds });
          }
          refetchConferense();
        } else {
          funSetErrors('main', false);
          setModalSucces(false);
        }
      });
    } else {
      //! если конференция еще не создана
      apiCreateConferences(dat).then(res => {
        if (res?.status === 200) {
          setDeleteOrganizer([]);
          setDeletePartners([]);
          funSetErrors('main', true);
          setModalSucces(true);
          dispatch(fetchConferences());
          console.log('res', res);
          //! загрузка файлов
          funApiEditFileMulti(data, fileKeys, res?.data?.conference?.id);
          // refetchConferense();
        } else {
          funSetErrors('main', false);
          setModalSucces(false);
        }
      });
    }
  };

  //! функция отмена
  const funCancelData = () => {
    setDeleteOrganizer([]);
    setDeletePartners([]);
    funUpdData();
    window.location.reload();
  };

  //! функция завершения конференции
  const funСompleteConference = () => {
    apiFinishConfirm(conferenseId).then(res => {
      if (res?.status === 200) {
        dispatch(disResetConferences());
        setComplate(false);
        setData({});
        setDeleteOrganizer([]);
        setDeletePartners([]);
        funUpdData();
        window.location.reload();
        // refetchConferense();
      }
    });
  };

  // if (isLoading) {
  //   return (
  //     <>
  //       <CircleLoader />
  //     </>
  //   );
  // }

  return (
    <section className={styles.ConfirenceModuleAdminPage}>
      <ModalCompleteConference
        open={complate}
        close={setComplate}
        funSave={funСompleteConference}
      />
      <ReqError errors={errors.filter(item => !item.succes)} setErrors={setErrors} />
      <ModalSuccessfully open={modalSucces} setOpen={setModalSucces} />
      <h2 className={styles.title}>Конференция</h2>
      <StagesConference
        data={data}
        setData={setData}
        validateError={validateError}
        setValidateError={setValidateError}
      />
      <ErrorModal
        open={errorModalTitle}
        close={() => setErrorModalTitle(null)}
        title={errorModalTitle}
      />
      <DateAdsess data={data} setData={setData} setErrorModalTitle={setErrorModalTitle} />
      <Logotips data={data} setData={setData} />
      <DocumentsModule data={data} setData={setData} />
      <AboutConference data={data} setData={setData} />
      <Directions data={data} setData={setData} />
      <Organizers
        data={data}
        setData={setData}
        itemKey={'organizers'}
        name={'Организаторы'}
        buttonName={'Добавить организатора'}
        deleteMass={deleteOrganizer}
        setDeleteMass={setDeleteOrganizer}
      />
      <Organizers
        data={data}
        setData={setData}
        itemKey={'partners'}
        name={'Партнёры'}
        buttonName={'Добавить партнёра'}
        deleteMass={deletePartners}
        setDeleteMass={setDeletePartners}
      />
      <div className={styles.buttons}>
        <div className={styles.left}>
          {conferenseId && <button onClick={() => setComplate(true)}>Завершить конференцию</button>}
        </div>
        <div className={styles.buttons_inner}>
          <button onClick={funCancelData}>Отмена</button>
          <button onClick={funEditDataApi}>
            {' '}
            {!conferenseId ? 'Создать' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirenceModuleAdminPage;
