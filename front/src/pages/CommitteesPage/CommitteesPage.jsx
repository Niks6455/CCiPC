import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useState } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { data } from './data';
export default function CommitteesPage() {
  const [setOrganizationComite, setProgrammingComite] = useState(0);

  return (
    <div>
      <Layout>
        <main>
          {/* organization commite */}
          <div className={styles.organizationComite}>
            <h2>ОРГАНИЗАЦИОННЫЙ КОМИТЕТ</h2>
            {/* buttons */}
            <div className={styles.organizationComiteButtons}>
              <ChangeButtons
                buttonArray={[
                  {
                    text: 'Сопредседатели',
                    Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
                  },
                  {
                    text: 'Члены комитета',
                    Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
                  },
                ]}
                setIndex={setProgrammingComite}
              />
            </div>
            {/* images */}
            <div className={styles.organizationComiteImages}>
              {data.map((el, index) => (
                <ProfileCard
                  key={index}
                  Image={() => <img src={el.photo} alt="profile" />}
                  name={el.name}
                  university={el.university}
                />
              ))}
            </div>
          </div>
          {/* programming comite */}
          <div className={styles.programmingComite}>
            <h2>ПРОГРАММНЫЙ КОМИТЕТ</h2>
            {/* buttons */}
            <div className={styles.programmingComiteButtons}>
              <ChangeButtons
                buttonArray={[
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
                ]}
                setIndex={setProgrammingComite}
              />
            </div>
            {/* images */}
            <div className={styles.programmingComiteImages}>
              {[].map(() => 0)}
            </div>
          </div>
        </main>
      </Layout>
      <Footer />
    </div>
  );
}
