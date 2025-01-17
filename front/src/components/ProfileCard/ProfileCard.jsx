import styles from './ProfileCard.module.scss';

export default function ProfileCard({ Image, name, university }) {
  return (
    <div className={styles.profileCard}>
      {Image && <Image />}
      <p className={styles.name}>{name}</p>
      <p className={styles.university}>{university}</p>
    </div>
  );
}
