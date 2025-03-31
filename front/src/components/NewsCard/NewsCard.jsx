import styles from './NewsCard.module.scss';
import noPhoto from '@assets/img/noPhoto.png';
import { server } from '../../apirequests/apirequests';
import { formatDate } from '../../utils/functions/funcions';
function NewsCard(props) {

  return (
    <div className={styles.newsCard} key={props.key}>
      <img src={props.data?.img?.url ? `${server}/${props.data?.img?.url}` : noPhoto} alt={'photo'} />
      <div className={styles.newsCardContent}>
        <p className={styles.newsCardDate}>{formatDate(props.data.createdAt)}</p>
        <h3 className={styles.newsCardTitle}>{props.data.title}</h3>
        <p className={styles.newsCardText}>{props.data.description}</p>
      </div>
    </div>
  );
}

export default NewsCard;
