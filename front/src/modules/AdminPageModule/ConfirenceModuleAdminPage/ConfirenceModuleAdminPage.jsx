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
  useEffect(() => {
    console.log('data', data);
  }, [data]);

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
        logoHeader: qery.logo?.HEADER,
        logoFooter: qery.logo?.FOOTER,
        programConference: qery.documents?.PROGRAM,
        informationLetter: qery.documents?.LETTER,
        worksCollection: qery.documents?.COLLECTION,
        аrticleTemplate: qery.documents?.SAMPLE,
        cashlessIndividual: qery.documents?.INDIVIDUAL,
        cashlessEntities: qery.documents?.LEGAL,
        aboutConference: qery.description,
        directions: qery.directions.map(el => el.name),
        dateFirst: qery.date?.[0]?.value,
        dateSecond: qery.date?.[1]?.value,
        address: qery.address,
        organizers: qery.organization || [],
        partners: qery.partner || [],
        deadlineUploadingReports: convertDate(qery.deadline),
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

  //! для отправки файла
  const funApiEditFile = (file, key, conferenseId) => {
    if (typeof file === 'object') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conferenceId', conferenseId);
      uploadPhoto(formData, key).then(res => {
        if (res?.status !== 200) {
          funSetErrors(key, false);
        } else {
          funSetErrors(key, true);
        }
      });
    } else {
      funSetErrors(key, true);
    }
  };

  //! отправка файлов массивом организаторы и партнеры
  const funApiEditFileMulti = (files, key, conferenseId) => {
    if (files) {
      const data = files.map(item => item.value).filter(item => item && typeof item !== 'string');
      const formData = new FormData();
      if (data.length > 0) {
        data.forEach(file => {
          formData.append('files', file);
        });
        formData.append('conferenceId', conferenseId);
        uploadMulti(formData, key).then(res => {
          if (res?.status !== 200) {
            funSetErrors(key, false);
          } else {
            funSetErrors(key, true);
          }
        });
      } else {
        funSetErrors(key, true);
      }
    } else {
      funSetErrors(key, true);
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
          fileKeys.map(item => {
            if (item.fun === 'funApiEditFile') {
              funApiEditFile(data[item.key], item.name, conferenseId);
            }
            if (item.fun === 'funApiEditFileMulti') {
              funApiEditFileMulti(data[item.key], item.name, conferenseId);
            }
          });
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
          fileKeys.map(item => {
            if (item.fun === 'funApiEditFile') {
              funApiEditFile(data[item.key], item.name, res.data.conference.id);
            }
            if (item.fun === 'funApiEditFileMulti') {
              funApiEditFileMulti(data[item.key], item.name, res.data.conference.id);
            }
          });
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
