import styles from "./NewsCard.module.scss";

function NewsCard(props) {
    return (
      <div className={styles.newsCard} key={props.key}>
        <img src={props.data.imgSrc} alt={props.data.title} />
        <div className={styles.newsCardContent}>
          <p className={styles.newsCardDate}>{props.data.date}</p>
          <h3 className={styles.newsCardTitle}>{props.data.title}</h3>
          <p className={styles.newsCardText}>{props.data.text}</p>
        </div>
      </div>
    );
  }
  
  export default NewsCard;
  