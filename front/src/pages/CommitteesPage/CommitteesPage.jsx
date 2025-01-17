import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useEffect, useState } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { organizationComiteData, programmingComiteData } from './data';
export default function CommitteesPage() {
  const [organizationComite, setOrganizationComite] = useState(0);
  const [programmingComite, setProgrammingComite] = useState(0);
  const [datePeopleOne, setDatePeopleOne] = useState(organizationComiteData);
  const [datePeopleSecond, setDatePeopleSecond] = useState(
    programmingComiteData
  );

  useEffect(() => {
    console.log(organizationComite);
  }, [organizationComite]);

  useEffect(() => {
    console.log(programmingComite);
  }, [programmingComite]);

  const ButtonOneDats = [
    {
      text: 'Сопредседатели',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
    {
      text: 'Члены комитета',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
  ]

  const ButtonSecondDats = [
    {
      text: 'Почетный председатель',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
    {
      text: 'Cопредседатели',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
    {
      text: 'Заместитель председателя',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
    {
      text: 'Члены комитета',
      Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
    },
  ]

  
  
  return (
    <>
      <div>
        <Layout>
          <main>
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
                {datePeopleOne.map((el, index) => (
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
                {datePeopleSecond.map((el, index) => (
                  <ProfileCard data={el} key={index} />
                ))}
              </div>
            </div>
          </main>
        </Layout>
      </div>{' '}
      <div>
        <a href="#top">
          <div className={styles.greenArrow}></div>
        </a>
      </div>
      <Footer />
    </>
  );
}
