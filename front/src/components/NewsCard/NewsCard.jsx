import styles from './NewsCard.module.scss';
import noPhoto from '@assets/img/noPhoto.png';
import { server } from '../../apirequests/apirequests';
import { formatDateRange } from '../../utils/functions/funcions';
function NewsCard(props) {
  const date = new Date(props.data.createdAt.split('T')[0]).toLocaleDateString('ru-RU');
  const formatDate = formatDateRange(date);
  return (
    <div className={styles.newsCard} key={props.key}>
      <img src={props.data.img ? `${server}/${props.data.img}` : noPhoto} alt={'photo'} />
      <div className={styles.newsCardContent}>
        <span>{formatDate}</span>
        <p className={styles.newsCardDate}>{props.data.date}</p>
        <h3 className={styles.newsCardTitle}>{props.data.title}</h3>
        <p className={styles.newsCardText}>{props.data.description}</p>
      </div>
    </div>
  );
}

export default NewsCard;
