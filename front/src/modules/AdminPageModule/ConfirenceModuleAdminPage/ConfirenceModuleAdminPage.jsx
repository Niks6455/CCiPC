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
  apiGetConferencesById,
  apiPutConferencesById,
  uploadMulti,
  uploadPhoto,
} from '../../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { convertDate, convertDateTire } from '../../../utils/functions/funcions';

function ConfirenceModuleAdminPage() {
  const [data, setData] = useState([]);
  const conferenses = useSelector(state => state.conferences?.data);
  const [conferenseId, setConferenseId] = useState(null);
  const [deleteOrganizer, setDeleteOrganizer] = useState([]);
  const [deletePartners, setDeletePartners] = useState([]);

  const conferensetQery = useQuery({
    queryKey: [`${conferenseId}`, conferenseId],
    queryFn: () => apiGetConferencesById(conferenseId),
    enabled: !!conferenseId,
  });

  useEffect(() => {
    if (conferenses?.[0]?.id) {
      setConferenseId(conferenses[0]?.id);
    }
  }, [conferenses]);

  const funUpdData = () => {
    const qery = conferensetQery?.data?.data?.conference;
    console.log('conferensetQery', qery);

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
        directions: qery.directions,
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

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  //! для отправки файла
  const funApiEditFile = (file, key) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conferenceId', conferenseId);
    uploadPhoto(formData, key).then(res => {
      if (res?.status !== 200) {
        alert('Файл не загружен', key);
      }
    });
  };

  //! отправка файлов массивом организаторы и партнеры
  const funApiEditFileMulti = (files, key) => {
    const data = files.map(item => item.value).filter(item => item && typeof item !== 'string');
    const formData = new FormData();
    if (data.length > 0) {
      data.forEach(file => {
        formData.append('files', file);
      });
      formData.append('conferenceId', conferenseId);
      uploadMulti(formData, key).then(res => {
        if (res?.status !== 200) {
          alert('Файл не загружен', key);
        }
      });
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
      organizers: deleteOrganizer,
    };
    //! сохранение логотпа хедера
    if (typeof data.logoHeader === 'object') {
      funApiEditFile(data.logoHeader, 'HEADER');
    }
    //! сохранение логотпа футера
    if (typeof data.logoFooter === 'object') {
      funApiEditFile(data.logoFooter, 'FOOTER');
    }
    //! файла программы конференции
    if (typeof data.programConference === 'object') {
      funApiEditFile(data.programConference, 'PROGRAM');
    }
    //! файла буклета
    if (typeof data.informationLetter === 'object') {
      funApiEditFile(data.informationLetter, 'LETTER');
    }
    //! файл коллекции работ
    if (typeof data.worksCollection === 'object') {
      funApiEditFile(data.worksCollection, 'COLLECTION');
    }
    //! файл шаблона статьи
    console.log('data.аrticleTemplate', data.аrticleTemplate);
    if (typeof data.аrticleTemplate === 'object') {
      funApiEditFile(data.аrticleTemplate, 'SAMPLE');
    }
    //! файл документа о платёже индивидуальных
    if (typeof data.cashlessIndividual === 'object') {
      funApiEditFile(data.cashlessIndividual, 'INDIVIDUAL');
    }
    //! файл документа о платёже юрлиц
    if (typeof data.cashlessEntities === 'object') {
      funApiEditFile(data.cashlessEntities, 'LEGAL');
    }
    //! картинки организаторы
    if (data.organizers) {
      funApiEditFileMulti(data.organizers, 'ORGANIZATION');
    }
    //! картинки партнеры
    if (data.organizers) {
      funApiEditFileMulti(data.partners, 'PARTNER');
    }

    apiPutConferencesById(dat, conferenseId).then(res => {
      if (res?.status === 200) {
        setDeleteOrganizer([]);
        setDeletePartners([]);
      }
    });
  };

  //! функция отмена
  const funCancelData = () => {
    setDeleteOrganizer([]);
    setDeletePartners([]);
    funUpdData();
  };

  return (
    <section className={styles.ConfirenceModuleAdminPage}>
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
          <button onClick={funEditDataApi}>Сохранить изменения</button>
        </div>
      </div>
    </section>
  );
}

export default ConfirenceModuleAdminPage;
