import Layout from '../../ui/Layout/Layout';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useContext, useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import NavBar from '../../components/NavBar/NavBar';
import DataContext from '../../context';
import Cap from '../../assets/img/Cap.svg';
import { getOrgCommitet } from '../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CommitteesPage({ userRole }) {
  const { t } = useTranslation('committee');
  const [organizationComite, setOrganizationComite] = useState(0);
  const [programmingComite, setProgrammingComite] = useState(0);
  const [dataOrgAll, setDataOrgAll] = useState([]);
  const [datePeopleOne, setDatePeopleOne] = useState(null);
  const [datePeopleSecond, setDatePeopleSecond] = useState(null);
  const context = useContext(DataContext);
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [isVisible, setIsVisible] = useState(false);

  const ButtonOneDats = [
    {
      text: t('cochairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: t('chairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
  ];

  const ButtonSecondDats = [
    {
      text: t('honoraryChairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: t('cochairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: t('viceChairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: t('chairman'),
      Icon: () => <img src={Cap} alt="Cap" />,
    },
  ];

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
    filterCommittees();
  }, [dataOrgAll, organizationComite, programmingComite]);

  const filterCommittees = () => {
    const committeeOne =
      dataOrgAll.find(item => item.type === organizationComite)?.committees || [];
    const committeeTwo =
      dataOrgAll.find(item => item.type === programmingComite + 2)?.committees || [];

    setDatePeopleOne(committeeOne);
    setDatePeopleSecond(committeeTwo);
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <NavBar userRole={userRole} />
      <HeaderPhone />
      <div>
        <Layout>
          <main className={styles.organizationComiteMain}>
            <div className={styles.organizationComite}>
              <h2>{t('title')}</h2>
              <div className={styles.organizationComiteButtons}>
                <ChangeButtons buttonArray={ButtonOneDats} setIndex={setOrganizationComite} />
              </div>
              <div className={styles.organizationComiteImages}>
                {datePeopleOne?.length === 0 && (
                  <div className={styles.organizationComiteImagesEmpty}>
                    <p>{t('notFoundCommittee')}</p>
                  </div>
                )}
                {datePeopleOne?.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
              </div>
            </div>
            <div className={styles.programmingComite}>
              <h2>{t('programmingCommittee')}</h2>
              <div className={styles.programmingComiteButtons}>
                <ChangeButtons buttonArray={ButtonSecondDats} setIndex={setProgrammingComite} />
              </div>
              <div className={styles.organizationComiteImages}>
                {datePeopleSecond?.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
                {datePeopleSecond?.length === 0 && (
                  <div className={styles.organizationComiteImagesEmpty}>
                    <p>{t('notFoundCommittee')}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </Layout>
      </div>{' '}
      {!context.activeMenu && (
        <div className={styles.greenArrowContainer}>
          <AnimatePresence>
            {isVisible && (
              <motion.a
                href="#top"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={`${styles.greenArrow}`}></div>
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
