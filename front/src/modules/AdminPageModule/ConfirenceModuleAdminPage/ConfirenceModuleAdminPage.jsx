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
  apiGetConferencesById,
  apiPutConferencesById,
  uploadMulti,
  uploadPhoto,
} from '../../../apirequests/apirequests';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { convertDate, convertDateTire } from '../../../utils/functions/funcions';
import ModalSuccessfully from '../../../components/ModalSuccessfully/ModalSuccessfully';
import { conferenceDataNull, fileKeys } from './data';
import ReqError from '../../../components/ReqError/ReqError';
import { fetchConferences } from '../../../store/conferencesSlice/conferences.Slice';

function ConfirenceModuleAdminPage() {
  const dispatch = useDispatch();
  const [data, setData] = useState(conferenceDataNull);
  const conferenses = useSelector(state => state.conferences?.data);
  const [conferenseId, setConferenseId] = useState(null);
  const [deleteOrganizer, setDeleteOrganizer] = useState([]);
  const [deletePartners, setDeletePartners] = useState([]);
  const [modalSucces, setModalSucces] = useState(null);
  const [errors, setErrors] = useState([]);

  const conferensetQery = useQuery({
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
    const qery = conferensetQery?.data?.data?.conference;
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
        directions: qery.directions.map(el => el.name),
        dateFirst: qery.date?.[0]?.value,
        dateSecond: qery.date?.[1]?.value,
        address: qery.address,
        organizers: qery.files?.ORGANIZATION || [],
        partners: qery.files?.PARTNER || [],
        deadlineUploadingReports: convertDate(qery.deadline),
        deleteIds: [],
      };
      setData(data);
    }
    setDeleteOrganizer([]);
    setDeletePartners([]);
  };
  //! получение конференции
  useEffect(() => {
    funUpdData();
  }, [conferensetQery?.data?.data?.conference]);

  //! отправка файлов массивом организаторы и партнеры
  const funApiEditFileMulti = (files, keys, conferenseId) => {
    if (files) {
      const formData = new FormData();
      formData.append('conferenceId', conferenseId);

      console.log('data', data);
      console.log('keys', keys);
      keys.map(key => {
        if (files[key.key]) {
          if (!files[key.key].url) {
            const file = files[key.key]?.value || files[key.key];
            console.log('file', file, file.length);
            if (file.length > 0) {
              console.log('file', file[0].value);
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
          }
        });
      }
    }
  };

  //! отправляем измененные данные на бэк
  const funEditDataApi = () => {
    const dat = {
      stages: data.stages.map(item => ({
        date: convertDateTire(item.date),
        name: item.name,
      })),
      description: data.aboutConference,
      directions: data.directions,
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
          //! загрузка файлов
          funApiEditFileMulti(data, fileKeys, conferenseId);
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
  };

  console.log('data', data);

  return (
    <section className={styles.ConfirenceModuleAdminPage}>
      <ReqError errors={errors.filter(item => !item.succes)} setErrors={setErrors} />
      <ModalSuccessfully open={modalSucces} setOpen={setModalSucces} />
      <h2 className={styles.title}>Конференция</h2>
      <StagesConference data={data} setData={setData} />
      <DateAdsess data={data} setData={setData} />
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
