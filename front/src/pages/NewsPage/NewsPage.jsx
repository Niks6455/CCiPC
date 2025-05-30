import NewsCard from '../../components/NewsCard/NewsCard';
import styles from './NewsPage.module.scss';
import Layout from '../../ui/Layout/Layout';
import NavBar from '../../components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import { getAllNews } from '../../apirequests/apirequests';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import ClickerYears from '../../ui/ClickerYears/ClickerYears';
import { useTranslation } from 'react-i18next';

function NewsPage({ userRole }) {
  const { i18n } = useTranslation();
  const [activeYears, setActiveYears] = useState(new Date().getFullYear() + '');
  const [dataSliderFirstColumn, setDataSliderFirstColumn] = useState([]);
  const [dataSliderTwoColumn, setDataSliderTwoColumn] = useState([]);
  const [dataSliderThreeColumn, setDataSliderThreeColumn] = useState([]);
  const [allDataSliders, setAllDataSliders] = useState([]);

  useEffect(() => {
    getAllNews().then(res => {
      if (res?.status === 200) {
        setAllDataSliders(res?.data?.news);
      }
    });
  }, []);

  useEffect(() => {
    setActiveYears(
      allDataSliders
        ?.map(item => Number(item?.createdAt?.split('T')?.[0]?.split('-')?.[0]))
        ?.sort((a, b) => b - a)?.[0] + '' || new Date().getFullYear() + '',
    );
  }, [allDataSliders]);

  useEffect(() => {
    const firstColumn = [];
    const secondColumn = [];
    const thirdColumn = [];
    allDataSliders
      .filter(item => item.createdAt.split('T')[0].split('-')[0] === activeYears)
      .forEach((item, index) => {
        if (index % 3 === 0) {
          firstColumn.push(item);
        } else if (index % 3 === 1) {
          secondColumn.push(item);
        } else {
          thirdColumn.push(item);
        }
      });

    setDataSliderFirstColumn(firstColumn);
    setDataSliderTwoColumn(secondColumn);
    setDataSliderThreeColumn(thirdColumn);
  }, [allDataSliders, activeYears]);

  return (
    <>
      <NavBar userRole={userRole} />
      <HeaderPhone />
      <main className={styles.NewsPage}>
        <Layout>
          <div className={styles.Title}>
            <h2>{i18n.language === 'ru' ? 'НОВОСТИ' : 'NEWS'}</h2>
          </div>
          <div className={styles.ClickerYears}>
            <ClickerYears
              data={allDataSliders}
              activeYears={activeYears}
              setActiveYears={setActiveYears}
            />
          </div>
          <div className={styles.NewsPageContainer}>
            {allDataSliders.length === 0 && (
              <div className={styles.NoNews}>
                {i18n.language === 'ru' ? 'Новости отсутствуют' : 'There are no news'} :(
              </div>
            )}
            <div className={styles.NewsPageContainerInner}>
              {dataSliderFirstColumn.map((el, index) => (
                <div className={styles.item} key={index}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>

            <div className={styles.NewsPageContainerInner}>
              {dataSliderTwoColumn.map((el, index) => (
                <div key={index} className={styles.item}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>
            <div className={styles.NewsPageContainerInner}>
              {dataSliderThreeColumn.map((el, index) => (
                <div key={index} className={styles.item}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.NewsPageContainer} ${styles.phone}`}>
            <div className={styles.NewsPageContainerInner}>
              {allDataSliders.map((el, index) => (
                <div key={index} className={styles.item}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
}

export default NewsPage;
