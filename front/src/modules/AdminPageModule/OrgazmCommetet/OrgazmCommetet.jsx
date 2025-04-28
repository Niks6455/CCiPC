import styles from './OrgazmCommetet.module.scss';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import React from 'react';
import CapImg from '@assets/img/Cap.svg';
import plusLigthImg from '@assets/img/UI/plusLigth.svg';
import { getOrgCommitet } from '../../../apirequests/apirequests';
import CardOrganization from './CardOrganization/CardOrganization';
import { useSelector } from 'react-redux';
import AddOrgPeople from '../../../components/AdminModuleComponents/AddOrgPeople/AddOrgPeople';

function OrgazmCommetet() {
  const [activeButtonFirst, setActiveButtonFirst] = useState(0);
  const [activeButtonTwoo, setActiveButtonTwoo] = useState(0);
  const [addFirstOne, setAddFirstOne] = useState(false);
  const [addFirstTwo, setAddFirstTwo] = useState(false);
  const [dataOrgAll, setDataOrgAll] = useState([]);
  const [dataCommitetOne, setDataCommitetOne] = useState([]);
  const [dataCommitetTwo, setDataCommitetTwo] = useState([]);
  const addOrgPeopleRef = useRef(null);
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [filesUrls, setFilesUrls] = useState([]);

  useEffect(() => {
    getDataOrg();
  }, [conferenceid]);

  const getDataOrg = async () => {
    if (conferenceid) {
      const res = await getOrgCommitet(conferenceid);
      if (res?.status === 200) {
        setDataOrgAll(res.data.committee);
        filterCommittees();
      }
    }
  };

  useEffect(() => {
    filterCommittees();
  }, [dataOrgAll, activeButtonFirst, activeButtonTwoo]);

  const filterCommittees = () => {
    const committeeOne =
      dataOrgAll?.find(item => item?.type === activeButtonFirst)?.committees || [];
    const committeeTwo =
      dataOrgAll?.find(item => item?.type === activeButtonTwoo + 2)?.committees || [];
    setDataCommitetOne(committeeOne);
    setDataCommitetTwo(committeeTwo);
  };

  const updateCardData = (id, newImg) => {
    const updateData = dataOrgAll.map(confirensis => {
      return {
        ...confirensis,
        committees: confirensis.committees.map(item => {
          if (item.id === id) {
            return { ...item, img: newImg };
          }
          return item;
        }),
      };
    });
    setDataOrgAll(updateData);
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

  return (
    <section className={styles.OrgazmCommetet}>
      <div className={styles.OrgazmCommetetInner}>
        <p className={styles.title}>Оргкомитет</p>
        <div>
          <p className={styles.subtitle}>Организационный комитет</p>
          <div className={styles.buttonBlock}>
            <div className={styles.buttonBlockCont}>
              <button
                onClick={() => setActiveButtonFirst(0)}
                className={activeButtonFirst === 0 ? styles.active : styles.noActive}
              >
                Сопредседатели <img src={CapImg} alt="cap" />
              </button>
              <button
                onClick={() => setActiveButtonFirst(1)}
                className={activeButtonFirst === 1 ? styles.active : styles.noActive}
              >
                Члены комитета <img src={CapImg} alt="cap" />
              </button>
            </div>
            <button onClick={() => setAddFirstOne(true)} className={styles.ButtonAdd}>
              <img src={plusLigthImg} alt="plus" /> Добавить сотрудника
            </button>
          </div>
          <div className={styles.orgCargCont}>
            <div className={styles.orgCargContCards}>
              {addFirstOne && (
                <AddOrgPeople
                  ref={addOrgPeopleRef}
                  getDataOrg={getDataOrg}
                  type={activeButtonFirst}
                  closeCreateOne={closeCreateOne}
                />
              )}
              {dataCommitetOne.map(item => (
                <CardOrganization
                  key={item.id}
                  getDataOrg={getDataOrg}
                  item={item}
                  updateCardData={updateCardData}
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className={styles.subtitle}>Программный комитет</p>
          <div className={styles.buttonBlock}>
            <div className={styles.buttonBlockCont}>
              <button
                onClick={() => setActiveButtonTwoo(0)}
                className={activeButtonTwoo === 0 ? styles.active : styles.noActive}
              >
                Почётный председатель <img src={CapImg} alt="cap" />
              </button>
              <button
                onClick={() => setActiveButtonTwoo(1)}
                className={activeButtonTwoo === 1 ? styles.active : styles.noActive}
              >
                Сопредседатели <img src={CapImg} alt="cap" />
              </button>
              <button
                onClick={() => setActiveButtonTwoo(2)}
                className={activeButtonTwoo === 2 ? styles.active : styles.noActive}
              >
                Заместитель председателя <img src={CapImg} alt="cap" />
              </button>
              <button
                onClick={() => setActiveButtonTwoo(3)}
                className={activeButtonTwoo === 3 ? styles.active : styles.noActive}
              >
                Члены комитета <img src={CapImg} alt="cap" />
              </button>
            </div>
            <button onClick={() => setAddFirstTwo(true)} className={styles.ButtonAdd}>
              <img src={plusLigthImg} alt="plus" /> Добавить сотрудника
            </button>
          </div>
          <div className={styles.orgCargCont}>
            <div className={styles.orgCargContCards}>
              {addFirstTwo && (
                <AddOrgPeople
                  ref={addOrgPeopleRef}
                  getDataOrg={getDataOrg}
                  type={activeButtonTwoo + 2}
                  closeCreateOne={closeCreateTwo}
                />
              )}
              {dataCommitetTwo.map(item => (
                <CardOrganization
                  key={item.id}
                  getDataOrg={getDataOrg}
                  item={item}
                  updateCardData={updateCardData}
                  filesUrls={filesUrls}
                  setFilesUrls={setFilesUrls}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrgazmCommetet;
