import Layout from '../../ui/Layout/Layout';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useContext, useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import logoHeader from './../../assets/img/logo.png';
import NavBar from '../../components/NavBar/NavBar';
import DataContext from '../../context';
import Cap from '../../assets/img/Cap.svg';
import { getOrgCommitet } from '../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function CommitteesPage({ userRole }) {
  const navigate = useNavigate();
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
      text: 'Сопредседатели',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: 'Члены комитета',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
  ];

  const ButtonSecondDats = [
    {
      text: 'Почетный председатель',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: 'Cопредседатели',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: 'Заместитель председателя',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: 'Члены комитета',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
  ];

  useEffect(() => {
    getDataOrg();
  }, [conferenceid]);

  const getDataOrg = async () => {
    if (conferenceid) {
      const res = await getOrgCommitet(conferenceid);
      if (res?.status === 200) {
        setDataOrgAll(res.data.committee);
      }
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
      {/* <img
        style={{ cursor: 'pointer' }}
        src={logoHeader}
        className={styles.logo}
        onClick={() => navigate('/')}
      /> */}
      <NavBar userRole={userRole} />
      <HeaderPhone />
      <div>
        <Layout>
          <main className={styles.organizationComiteMain}>
            {/* organization commite */}
            <div className={styles.organizationComite}>
              <h2>ОРГАНИЗАЦИОННЫЙ КОМИТЕТ</h2>
              {/* buttons */}
              <div className={styles.organizationComiteButtons}>
                <ChangeButtons buttonArray={ButtonOneDats} setIndex={setOrganizationComite} />
              </div>
              {/* images */}
              <div className={styles.organizationComiteImages}>
                {datePeopleOne?.length === 0 && (
                  <div className={styles.organizationComiteImagesEmpty}>
                    <p>Комитет еще не сформирован</p>
                  </div>
                )}
                {datePeopleOne?.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
              </div>
            </div>
            {/* programming comite */}
            <div className={styles.programmingComite}>
              <h2>ПРОГРАММНЫЙ КОМИТЕТ</h2>
              {/* buttons */}
              <div className={styles.programmingComiteButtons}>
                <ChangeButtons buttonArray={ButtonSecondDats} setIndex={setProgrammingComite} />
              </div>
              {/* images */}
              <div className={styles.organizationComiteImages}>
                {datePeopleSecond?.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
                {datePeopleSecond?.length === 0 && (
                  <div className={styles.organizationComiteImagesEmpty}>
                    <p>Комитет еще не сформирован</p>
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
