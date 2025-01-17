import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './CommitteesPage.module.scss';
import ChangeButtons from '../../ui/ChangeButtons/ChangeButtons';
import { useEffect, useState } from 'react';
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
              <div></div>
              <ChangeButtons
                buttonArray={[
                  {
                    text: 'Сопредседатели',
                    Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
                  },
                  {
                    text: 'Сопредседатели',
                    Icon: () => <img src="/img/Cap.svg" alt="Cap" />,
                  },
                ]}
                setIndex={setProgrammingComite}
              />
            </div>
            {/* images */}
            <div className={styles.organizationComiteImages}>
              {[].map(() => 0)}
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
