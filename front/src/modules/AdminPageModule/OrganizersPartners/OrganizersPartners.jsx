import styles from './OrganizersPartners.module.scss';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import plusLigthImg from '@assets/img/UI/plusLigth.svg';
import { getOrgCommitet } from '../../../apirequests/apirequests';
import Card from './Card/Card';
import { useSelector } from 'react-redux';
import AddCard from './AddCard/AddCard';

function OrganizersPartners() {
  //! добавлегние организатора или партнера
  const [addOrganizer, setAddOrganizer] = useState({
    file: null,
    url: '',
    number: '',
  });
  const [errorsAddOrganizer, setErrorsAddOrganizer] = useState({ file: '', url: '', number: '' });
  const [addPartner, setAddPartner] = useState({ file: null, url: '', number: '' });
  const [errorsAddPartner, setErrorsAddPartner] = useState({ file: '', url: '', number: '' });

  //! данные с бд
  const [partners, setPartners] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  const [addFirstOne, setAddFirstOne] = useState(false);
  const [addFirstTwo, setAddFirstTwo] = useState(false);

  const [dataOrgAll, setDataOrgAll] = useState([]);
  const addOrgPeopleRef = useRef(null);
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [filesUrls, setFilesUrls] = useState([]);

  const funSetFilesUrls = (conferenceid, values) => {
    const prev = filesUrls.find(el => el.id === conferenceid);
    let fiurl = filesUrls.filter(el => el.id !== conferenceid);
    setFilesUrls([...fiurl, { ...prev, ...values, id: conferenceid }]);
  };

  useEffect(() => {
    getDataOrg();
  }, [conferenceid]);

  const getDataOrg = async () => {
    const res = await getOrgCommitet(conferenceid);
    if (res?.status === 200) {
      setDataOrgAll(res.data.committee);
    }
  };

  useEffect(() => {
    setPartners(dataOrgAll?.find(item => item?.type === 0)?.committees || []);
    setOrganizers(dataOrgAll?.find(item => item?.type === 0 + 2)?.committees || []);
  }, [dataOrgAll]);

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

  const funSaveData = (type, data) => {
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
    if (type === 'organizers') setErrorsAddOrganizer(errors);
    if (type === 'partners') setErrorsAddPartner(errors);

    const formData = {
      ...data,
      type: type,
    };
    console.log('formData', formData);
    if (!valid) return;
  };

  console.log('errorsAddOrganizer', errorsAddOrganizer);
  console.log('errorsAddPartner', errorsAddPartner);

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
            <button
              onClick={() => funSaveData('organizers', addOrganizer)}
              className={styles.ButtonAdd}
            >
              Сохранить
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
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                  funSetFilesUrls={funSetFilesUrls}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className={styles.subtitle}>Партнёры</p>
          <div className={styles.buttonBlock}>
            <button onClick={() => setAddFirstTwo(true)} className={styles.ButtonAdd}>
              <img src={plusLigthImg} alt="plus" /> Добавить партнёры
            </button>
            <button
              onClick={() => funSaveData('partners', addPartner)}
              className={styles.ButtonAdd}
            >
              Сохранить
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
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                  funSetFilesUrls={funSetFilesUrls}
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
