import NewsCard from '../../components/NewsCard/NewsCard';
import styles from './NewsPage.module.scss';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import ClickerYears from '../../ui/ClickerYears/ClickerYears';
import NavBar from '../../components/NavBar/NavBar';
import logoHeader from './../../assets/img/logo.png';
import { useEffect, useState } from 'react';
import { getAllNews } from '../../apirequests/apirequests';
function NewsPage() {
  const [dataSliderFirstColumn, setDataSliderFirstColumn] = useState([]);
  const [dataSliderTwoColumn, setDataSliderTwoColumn] = useState([]);
  const [dataSliderThreeColumn, setDataSliderThreeColumn] = useState([]);
  const [allDataSliders, setAllDataSliders] = useState([]);
  useEffect(() => {
    getAllNews().then(res => {
      if (res?.status === 200) {
        console.log('res?.data?.news', res?.data?.news);
        setAllDataSliders(res?.data?.news);
      }
    });
  }, []);
  useEffect(() => {
    const chunkedData = Array.from({ length: Math.ceil(allDataSliders.length / 3) }, (_, i) =>
      allDataSliders.slice(i * 3, (i + 1) * 3),
    );
    setDataSliderFirstColumn(chunkedData[0]);
    setDataSliderTwoColumn(chunkedData[1]);
    setDataSliderThreeColumn(chunkedData[2]);
  }, [allDataSliders]);
  return (
    <>
      <img src={logoHeader} className={styles.logo} />
      <NavBar />
      <main className={styles.NewsPage}>
        <Layout>
          <div className={styles.Title}>
            <p>Новости</p>
          </div>
          <div className={styles.ClickerYears}>
            <ClickerYears />
          </div>
          <div className={styles.NewsPageContainer}>
            <div className={styles.NewsPageContainerInner}>
              {dataSliderFirstColumn?.map((el, index) => (
                <div key={index}>
                  <NewsCard data={el} key={index} />
                </div>
              ))}
            </div>

            <div className={styles.NewsPageContainerInner}>
              {dataSliderTwoColumn?.map((el, index) => (
                <div key={index}>
                  <NewsCard data={el} key={index} />
                </div>
              ))}
            </div>
            <div className={styles.NewsPageContainerInner}>
              {dataSliderThreeColumn?.map((el, index) => (
                <div key={index}>
                  <NewsCard data={el} key={index} />
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </main>
      <Footer />
    </>
  );
}

export default NewsPage;
