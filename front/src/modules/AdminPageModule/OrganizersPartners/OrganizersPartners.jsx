import styles from './OrganizersPartners.module.scss';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import plusLigthImg from '@assets/img/UI/plusLigth.svg';
import {
  apiCreateOrganizersPartners,
  apiGetOrganizersPartners,
  uploadPhoto,
} from '../../../apirequests/apirequests';
import Card from './Card/Card';
import AddCard from './AddCard/AddCard';
import { fetchConferences } from '../../../store/conferencesSlice/conferences.Slice';
import { useDispatch } from 'react-redux';

function OrganizersPartners() {
  const dispatch = useDispatch();
  //! данные с бд
  const [partners, setPartners] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  //! добавлегние организатора или партнера
  const [addOrganizer, setAddOrganizer] = useState({
    file: null,
    url: '',
    number: '',
  });
  const [errorsAddOrganizer, setErrorsAddOrganizer] = useState({ file: '', url: '', number: '' });
  const [addPartner, setAddPartner] = useState({ file: null, url: '', number: '' });
  const [errorsAddPartner, setErrorsAddPartner] = useState({ file: '', url: '', number: '' });

  const [addFirstOne, setAddFirstOne] = useState(false);
  const [addFirstTwo, setAddFirstTwo] = useState(false);

  const addOrgPeopleRef = useRef(null);
  const [filesUrls, setFilesUrls] = useState([]);

  //! получение данных с бэка
  useEffect(() => {
    getDataOrg();
  }, []);

  useEffect(() => {
    setAddOrganizer({ ...addOrganizer, number: organizers.length + 1 });
  }, [organizers]);

  useEffect(() => {
    setAddPartner({ ...addPartner, number: partners.length + 1 });
  }, [partners]);

  const getDataOrg = async () => {
    apiGetOrganizersPartners().then(res => {
      if (res?.status === 200) {
        setPartners(
          res?.data?.partner?.map(el => ({ ...el, number: el?.index, file: el?.file?.url })),
        );
        setOrganizers(
          res?.data?.organization?.map(el => ({ ...el, number: el?.index, file: el?.file?.url })),
        );
      }
    });
  };

  const closeCreateOne = () => {
    if (addOrgPeopleRef.current) {
      gsap.to(addOrgPeopleRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setAddFirstOne(false);
          getDataOrg();
        },
      });
    } else {
      setAddFirstOne(false);
      getDataOrg();
    }
  };

  const closeCreateTwo = () => {
    if (addOrgPeopleRef.current) {
      gsap.to(addOrgPeopleRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setAddFirstTwo(false);
          getDataOrg();
        },
      });
    } else {
      setAddFirstTwo(false);
      getDataOrg();
    }
  };

  const validate = data => {
    let valid = true;
    const errors = {};
    if (!data?.number) {
      errors.number = 'Это обязательное поле';
      valid = false;
    }
    if (!data?.file) {
      errors.file = 'Это обязательное поле';
      valid = false;
    }
    if (data?.url?.trim() === '') {
      errors.url = 'Это обязательное поле';
      valid = false;
    }
    if (data?.url?.length > 250) {
      errors.url = 'Не более 250 символов';
      valid = false;
    }
    if (data?.number > 10000) {
      errors.number = 'Не более 10000';
      valid = false;
    }
    return { valid, errors };
  };

  const funSaveData = (type, data) => {
    const { valid, errors } = validate(data);
    if (type === 'organizers') setErrorsAddOrganizer(errors);
    if (type === 'partners') setErrorsAddPartner(errors);
    if (!valid) return;

    const formData = {
      url: data?.url,
      index: Number(data?.number),
      type: type === 'organizers' ? 0 : 1,
    };

    apiCreateOrganizersPartners(formData).then(res => {
      if (res?.status === 200) {
        const fileData = new FormData();
        fileData.append('file', data?.file);
        fileData.append('collaboratorId', res?.data?.collaborator?.id);
        uploadPhoto(fileData, 'COLLABORATOR').then(res => {
          if (res?.status === 200) {
            if (type === 'organizers') closeCreateOne();
            if (type === 'partners') closeCreateTwo();
            setAddOrganizer({ file: null, url: '', number: '' });
            setAddPartner({ file: null, url: '', number: '' });
            dispatch(fetchConferences());
          }
        });
      }
    });
    if (!valid) return;
  };

  return (
    <section className={styles.OrganizersPartners}>
      <div className={styles.OrgazmCommetetInner}>
        <p className={styles.title}>Организаторы и партнёры</p>
        <div>
          <p className={styles.subtitle}>Организаторы</p>
          <div className={styles.buttonBlock}>
            <button onClick={() => setAddFirstOne(true)} className={styles.ButtonAdd}>
              <img src={plusLigthImg} alt="plus" /> Добавить организатора
            </button>
          </div>
          <div className={styles.orgCargCont}>
            <div className={styles.orgCargContCards}>
              {addFirstOne && (
                <AddCard
                  ref={addOrgPeopleRef}
                  getDataOrg={getDataOrg}
                  type={'organizers'}
                  closeCreateOne={closeCreateOne}
                  data={addOrganizer}
                  setData={setAddOrganizer}
                  errors={errorsAddOrganizer}
                  setErrors={setErrorsAddOrganizer}
                  funSaveData={funSaveData}
                />
              )}
              {organizers.map(item => (
                <Card
                  key={item.id}
                  getDataOrg={getDataOrg}
                  item={item}
                  type={'organizers'}
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                  validate={validate}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className={styles.subtitle}>Партнёры</p>
          <div className={styles.buttonBlock}>
            <button onClick={() => setAddFirstTwo(true)} className={styles.ButtonAdd}>
              <img src={plusLigthImg} alt="plus" /> Добавить партнёра
            </button>
          </div>
          <div className={styles.orgCargCont}>
            <div className={styles.orgCargContCards}>
              {addFirstTwo && (
                <AddCard
                  ref={addOrgPeopleRef}
                  getDataOrg={getDataOrg}
                  type={'partners'}
                  closeCreateOne={closeCreateTwo}
                  data={addPartner}
                  setData={setAddPartner}
                  errors={errorsAddPartner}
                  setErrors={setErrorsAddPartner}
                  funSaveData={funSaveData}
                />
              )}
              {partners.map(item => (
                <Card
                  key={item.id}
                  getDataOrg={getDataOrg}
                  item={item}
                  type={'partners'}
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                  validate={validate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrganizersPartners;
