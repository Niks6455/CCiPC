import styles from "./NewsCard.module.scss";

function NewsCard({ data }) {
    return (
      <div className={styles.newsCard}>
        <img src={data.imgSrc} alt={data.title} />
        <div className={styles.newsCardContent}>
          <p className={styles.newsCardDate}>{data.date}</p>
          <h3 className={styles.newsCardTitle}>{data.title}</h3>
          <p className={styles.newsCardText}>{data.text}</p>
        </div>
      </div>
    );
  }
  
  export default NewsCard;
  