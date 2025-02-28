import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useContext, useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { organizationComiteData, programmingComiteData } from './data';
import NavBar from '../../components/NavBar/NavBar';
import DataContext from '../../context';
import Cap from "../../assets/img/Cap.svg";
import { getOrgCommitet } from '../../apirequests/apirequests';
export default function CommitteesPage() {
  const [organizationComite, setOrganizationComite] = useState(0);
  const [programmingComite, setProgrammingComite] = useState(0);
  const [dataOrgAll, setDataOrgAll] = useState([]);
  const [datePeopleOne, setDatePeopleOne] = useState(null);
  const [datePeopleSecond, setDatePeopleSecond] = useState(null);
  const context = useContext(DataContext);

  const ButtonOneDats = [
    {
      text: 'Сопредседатели',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
    {
      text: 'Члены комитета',
      Icon: () => <img src={Cap} alt="Cap" />,
    },
  ]

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
  ]

   
  useEffect(() => {
    getDataOrg();
  }, []);

  const getDataOrg = async () => {
      const res = await getOrgCommitet();
      if (res?.status === 200) {
          setDataOrgAll(res.data.committee);
      }
  };

  useEffect(() => {
      filterCommittees();
  }, [dataOrgAll, organizationComite, programmingComite]);

  const filterCommittees = () => {
      const committeeOne = dataOrgAll.find(item => item.type === organizationComite)?.committees || [];
      const committeeTwo = dataOrgAll.find(item => item.type === programmingComite + 2)?.committees || [];
      
      setDatePeopleOne(committeeOne);
      setDatePeopleSecond(committeeTwo);
  };
  return (



    <>
      <NavBar/>
      <div>
        <Layout>
          <main className={styles.organizationComiteMain}>
            {/* organization commite */}
            <div className={styles.organizationComite}>
              <h2>ОРГАНИЗАЦИОННЫЙ КОМИТЕТ</h2>
              {/* buttons */}
              <div className={styles.organizationComiteButtons}>
                <ChangeButtons
                  buttonArray={ButtonOneDats}
                  setIndex={setOrganizationComite}
                />
              </div>
              {/* images */}
              <div className={styles.organizationComiteImages}>
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
                <ChangeButtons
                  buttonArray={ButtonSecondDats}
                  setIndex={setProgrammingComite}
                />
              </div>
              {/* images */}
              <div className={styles.programmingComiteImages}>
                {datePeopleSecond?.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
              </div>
            </div>
          </main>
        </Layout>
      </div>{' '}
      {
        !context.activeMenu &&
        <div>
          <a href="#top">
            <div className={styles.greenArrow}></div>
          </a>
        </div>
      }
      <Footer />
    </>
  );
}
