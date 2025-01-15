import NewsCard from "../../components/NewsCard/NewsCard";
import { dataSlider } from "./testData";
import styles from "./NewsPage.module.scss";
import Layout from "../../ui/Layout/Layout";
function NewsPage() {
  return (
    <main className={styles.NewsPage}>
        <Layout>
            <div className={styles.NewsPageContainer}>
                {dataSlider.map((el, index) => (
                    <NewsCard data={el} key={index} />
                ))}
            </div>
        </Layout>
     
    </main>
  );
}

export default NewsPage;
