import styles from "./Logotips.module.scss";

function Logotips() {
  return (
    <div className={styles.Logotips}>
      <div className={styles.left_block}>
        <div className={styles.border}></div>
        <div className={styles.block_inner}>
          <h3>Логотип (хедер)</h3>
          <div className={styles.container}></div>
        </div>
      </div>
      <div className={styles.rigth_block}>
        <h3>Логотип (футер)</h3>
        <div className={styles.container}></div>
      </div>
    </div>
  );
}

export default Logotips;
