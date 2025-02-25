import styles from "./NewsCard.module.scss";
import noPhoto from "@assets/img/noPhoto.png";
function NewsCard(props) {
    return (
      <div className={styles.newsCard} key={props.key}>
        {props.data.imgSrc ? <img src={props.data.imgSrc} alt={props.data.title} /> : <img src={noPhoto}/>}
        <div className={styles.newsCardContent}>
          <p className={styles.newsCardDate}>{props.data.date}</p>
          <h3 className={styles.newsCardTitle}>{props.data.title}</h3>
          <p className={styles.newsCardText}>{props.data.description}</p>
        </div>
      </div>
    );
  }
  
  export default NewsCard;
  