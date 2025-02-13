import styles from './ProfileCard.module.scss';
import imgHuman from './../../assets/img/UI/notPhoto.svg';
export default function ProfileCard(props) {
  return (
    <div className={styles.profileCard} key={props?.key}>
      {/* {Image && <Image />} */}
      <img src={imgHuman} alt="photo" />
      {/* <img src={props?.data?.photo || '/img/NotPhoto.svg'} alt="photo" /> */}

      <p className={styles.name}>{props?.data?.name}</p>
      <p className={styles.university}>{props?.data?.university}</p>
    </div>
  );
}
