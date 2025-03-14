import Header from '@components/Header/Header';
import Layout from '../../ui/Layout/Layout';
import styles from './HomePage.module.scss';
import TopMainInfo from '../../modules/TopMainInfo/TopMainInfo';
import SliderHomePageTop from '../../modules/SliderHomePageTop/SliderHomePageTop';
import { textDataHomePage } from './date';
import SliderHomePage from '../../components/SliderHomePage/SliderHomePage';
import Footer from '../../components/Footer/Footer';
import Organization1 from '@assets/img/UI/org1.png';
import Organization2 from '@assets/img/UI/org2.png';
import Organization3 from '@assets/img/UI/org3.png';
import Organization4 from '@assets/img/UI/org4.png';
import SliderHomePageMobile from '../../components/SliderHomePageMobile/SliderHomePageMobile';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
function HomePage() {
  // const context = useContext(DataContext);
  const textData = textDataHomePage;
  return (
    <div className={styles.HomePage}>
      <HeaderPhone />
      <Header />
      <TopMainInfo />
      <SliderHomePageTop />
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
            <div className={styles.textSectionInerText}>
              <p>
                Архыз — живописный уголок Кавказа, который ежегодно привлекает тысячи туристов
                со всей страны. В этом году здесь прошла конференция, посвящённая вопросам экологии
                и устойчивого развития горных регионов. Участники мероприятия обсудили актуальные
                проблемы сохранения биоразнообразия, рационального использования природных ресурсов
                и внедрения «зелёных» технологий в жизнь местных сообществ.
              </p>
              <div>
                <p className={styles.textSectionInerTextTile}>Ведущие эксперты</p>
                <p className={styles.textSectionInerTextLine}>
                  {' '}
                  Конференция собрала ведущих экспертов, учёных и представителей общественных
                  организаций. Обсуждались такие важные темы, как снижение воздействия туризма
                  на экосистемы гор, развитие экотуризма и создание новых природоохранных зон.
                  Особое внимание было уделено роли местного населения в сохранении природного
                  наследия региона.{' '}
                </p>
              </div>
              <p>
                В рамках конференции также прошли мастер-классы и практические семинары,
                где участники могли обменяться опытом и узнать о последних достижениях в области
                экологического менеджмента.
              </p>
              <p>
                Мероприятие завершилось подписанием резолюции, в которой были сформулированы
                рекомендации для государственных органов и бизнеса по улучшению экологической
                ситуации в горах.
              </p>
            </div>
          </div>
        </section>
        <section className={styles.clickerSection}>
          <div>
            <div className={styles.Title}>
              <p>НАПРАВЛЕНИЯ РАБОТЫ КОНФЕРЕНЦИИ</p>
            </div>
            <div className={`${styles.blockTextCompetitionsInner} ${styles.pc}`}>
              {textData.map((el, index) => (
                <div key={index} className={styles.blockTextCompetitions}>
                  <p dangerouslySetInnerHTML={{ __html: el.text }}></p>
                </div>
              ))}
            </div>
            <div className={`${styles.blockTextCompetitionsInner} ${styles.mobile}`}>
              <div className={styles.row_items}>
                {textData.slice(0, textData.length / 2 + 1).map((el, index) => (
                  <div key={index} className={styles.blockTextCompetitions}>
                    <p dangerouslySetInnerHTML={{ __html: el.text }}></p>
                  </div>
                ))}
              </div>
              <div className={styles.row_items}>
                {textData.slice(textData.length / 2 + 1, textData.length).map((el, index) => (
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
        <section className={styles.imgSection}>
          <div className={styles.Title}>
            <p>Организаторы</p>
          </div>
          <div className={styles.imgSectionInner}>
            <img src={Organization1} alt="Organization1" />
            <img src={Organization2} alt="Organization2" />
            <img src={Organization3} alt="Organization3" />
            <img src={Organization4} alt="Organization4" />
          </div>
        </section>
        <section className={styles.imgSection}>
          <div className={styles.Title}>
            <p>Партнёры</p>
          </div>
          <div className={styles.imgSectionInner}>
            <img src={Organization1} alt="Organization1" />
            <img src={Organization2} alt="Organization2" />
            <img src={Organization3} alt="Organization3" />
            <img src={Organization4} alt="Organization4" />
          </div>
        </section>
      </Layout>
      {/* <Footer /> */}
    </div>
  );
}

export default HomePage;
