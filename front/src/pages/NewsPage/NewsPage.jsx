import NewsCard from '../../components/NewsCard/NewsCard';
import styles from './NewsPage.module.scss';
import Layout from '../../ui/Layout/Layout';
import NavBar from '../../components/NavBar/NavBar';
import logoHeader from './../../assets/img/logo.png';
import { useEffect, useState } from 'react';
import { getAllNews } from '../../apirequests/apirequests';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useNavigate } from 'react-router-dom';
import ClickerYears from '../../ui/ClickerYears/ClickerYears';

function NewsPage({ userRole }) {
  const navigate = useNavigate();
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
    const firstColumn = [];
    const secondColumn = [];
    const thirdColumn = [];

    allDataSliders.forEach((item, index) => {
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
  }, [allDataSliders]);

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
      <main className={styles.NewsPage}>
        <Layout>
          <div className={styles.Title}>
            <h2>НОВОСТИ</h2>
          </div>
          <div className={styles.ClickerYears}>
            <ClickerYears data={allDataSliders} />
          </div>
          <div className={styles.NewsPageContainer}>
            {allDataSliders.length === 0 && (
              <div className={styles.NoNews}>Новости отсутствуют :(</div>
            )}
            <div className={styles.NewsPageContainerInner}>
              {dataSliderFirstColumn.map((el, index) => (
                <div key={index}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>

            <div className={styles.NewsPageContainerInner}>
              {dataSliderTwoColumn.map((el, index) => (
                <div key={index}>
                  <NewsCard data={el} />
                </div>
              ))}
            </div>
            <div className={styles.NewsPageContainerInner}>
              {dataSliderThreeColumn.map((el, index) => (
                <div key={index}>
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
