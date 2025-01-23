import NewsCard from "../../components/NewsCard/NewsCard";
import { dataSlider, dataSlider2 } from "./testData";
import styles from "./NewsPage.module.scss";
import Layout from "../../ui/Layout/Layout";
import HeaderSecond from "../../components/HeaderSecond/HeaderSecond";
import Footer from "../../components/Footer/Footer";
import ClickerYears from "../../ui/ClickerYears/ClickerYears";
import NavBar from "../../components/NavBar/NavBar";
import logoHeader from "./../../assets/img/logo.png";
function NewsPage() {
  return (
    <>
    <img src={logoHeader} className={styles.logo}/>
      <NavBar/>
      <main className={styles.NewsPage}>
        <Layout>
          <div className={styles.Title}>
              <p >
                  Новости
              </p>
          </div>
          <div className={styles.ClickerYears}>
            <ClickerYears/>
          </div>
            <div className={styles.NewsPageContainer}>
            <div className={styles.NewsPageContainerInner}>
            {dataSlider.map((el, index) => (
                  <div key={index}>
                    <NewsCard data={el} key={index} />
                  </div>
                ))}
            </div>
              
            <div className={styles.NewsPageContainerInner}>
            {dataSlider.map((el, index) => (
                  <div key={index}>
                    <NewsCard data={el} key={index} />
                  </div>
                ))}
            </div>
            <div className={styles.NewsPageContainerInner}>
            {dataSlider2.map((el, index) => (
                  <div key={index}>
                    <NewsCard data={el} key={index} />
                  </div>
                ))}
            </div>            
            </div>
        </Layout>
     
    </main>
    <Footer/>
    </>

  );
}

export default NewsPage;
