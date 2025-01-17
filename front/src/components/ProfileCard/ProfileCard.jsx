import styles from './ProfileCard.module.scss';

export default function ProfileCard(props) {
  return (
    <div className={styles.profileCard} key={props?.key}>
      {/* {Image && <Image />} */}
      <img src={props?.data?.photo || '/img/NotPhoto.svg'} alt="photo" />
      <p className={styles.name}>{props?.data?.name}</p>
      <p className={styles.university}>{props?.data?.university}</p>
    </div>
  );
}
