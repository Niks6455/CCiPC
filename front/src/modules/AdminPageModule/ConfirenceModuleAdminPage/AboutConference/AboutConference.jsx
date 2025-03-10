import styles from './AboutConference.module.scss';

function AboutConference({ data, setData }) {
  const funChangeAbout = e => {
    setData({ ...data, aboutConference: e.target.value });
  };

  return (
    <div className={styles.AboutConference}>
      <h3>О конференции</h3>
      <textarea value={data.aboutConference} onChange={funChangeAbout} />
    </div>
  );
}

export default AboutConference;
