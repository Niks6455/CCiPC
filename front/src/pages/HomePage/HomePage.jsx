import Header from '@components/Header/Header';
import Layout from '../../ui/Layout/Layout';
import styles from './HomePage.module.scss';
import TopMainInfo from '../../modules/TopMainInfo/TopMainInfo';
import SliderHomePageTop from '../../modules/SliderHomePageTop/SliderHomePageTop';
import { textDataHomePage } from './date';
import SliderHomePage from '../../components/SliderHomePage/SliderHomePage';
import SliderHomePageMobile from '../../components/SliderHomePageMobile/SliderHomePageMobile';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
function HomePage() {
  const conference = useSelector(state => state.conferences.data[0]);
  const textData = textDataHomePage;
  console.log('conference?.description ', conference?.description);
  const getDescription = text => {
    let newText = text.replace(/\n/g, '<p>');
    return newText;
  };
  return (
    <div className={styles.HomePage}>
      <HeaderPhone />
      <Header />
      <TopMainInfo />
      {conference && conference?.stages?.length > 0 && <SliderHomePageTop />}
      <Layout>
        <section className={styles.textSection}>
          <div className={styles.textSectionIner}>
            <div className={styles.Title}>
              <p>
                НАШИ КОНФЕРЕНЦИИ ПРОХОДЯТ
                <br /> С ПОЛЬЗОЙ НЕ ТОЛЬКО ДЛЯ <br />
                РАЗВИТИЯ, НО И ДЛЯ ЗДОРОВЬЯ!
              </p>
            </div>
            {conference && conference?.description && (
              <div className={styles.textSectionInerText}>
                <div
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: getDescription(conference?.description) }}
                />
              </div>
            )}
          </div>
        </section>
        <section className={styles.clickerSection}>
          <div>
            <div className={styles.Title}>
              <p>НАПРАВЛЕНИЯ РАБОТЫ КОНФЕРЕНЦИИ</p>
            </div>
            <div className={`${styles.blockTextCompetitionsInner} ${styles.pc}`}>
              {conference && conference?.directions?.map((el, index) => (
                <div key={index} className={styles.blockTextCompetitions}>
                  <p dangerouslySetInnerHTML={{ __html: el.name }}></p>
                </div>
              ))}
            </div>
            <div className={`${styles.blockTextCompetitionsInner} ${styles.mobile}`}>
              <div className={styles.row_items}>
                {conference && conference?.directions?.slice(0, textData?.length / 2 + 1).map((el, index) => (
                  <div key={index} className={styles.blockTextCompetitions}>
                    <p dangerouslySetInnerHTML={{ __html: el.text }}></p>
                  </div>
                ))}
              </div>
              <div className={styles.row_items}>
                {conference && conference?.directions
                  ?.slice(textData.length / 2 + 1, textData.length)
                  .map((el, index) => (
                    <div key={index} className={styles.blockTextCompetitions}>
                      <p dangerouslySetInnerHTML={{ __html: el.text }}></p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
      <SliderHomePage />
      <SliderHomePageMobile />
      <Layout>
        {conference && conference?.organization?.length > 0 && (
          <section className={styles.imgSection}>
            <div className={styles.Title}>
              <p>Организаторы</p>
            </div>
            <div className={styles.imgSectionInner}>
              {conference?.organization?.map(el => (
                <img src={`${server}/${el}`} alt="Organization1" />
              ))}
            </div>
          </section>
        )}
        {conference && conference?.partner?.length > 0 && (
          <section className={styles.imgSection}>
            <div className={styles.Title}>
              <p>Партнёры</p>
            </div>
            <div className={styles.imgSectionInner}>
              {conference?.partner?.map(el => (
                <img src={`${server}/${el}`} alt="Organization1" />
              ))}
            </div>
          </section>
        )}
      </Layout>
    </div>
  );
}

export default HomePage;
