import styles from "./HeadBlock.module.scss";
import exportIcon from "@assets/img/AdminPanel/export.svg";
import lupa from "@assets/img/UI/lupa.svg";

function HeadBlock({ shearchParam, setShearchParam }) {
  return (
    <div className={styles.HeadBlock}>
      <div className={styles.left_block}>
        <img src={lupa} alt="🔍" />
        <input
          value={shearchParam}
          onChange={(e) => setShearchParam(e.target.value)}
          type="text"
          placeholder="Поиск"
        />
      </div>
      <div className={styles.right_block}>
        <button className={styles.save}>Сохранить</button>
        <button className={styles.export_staty}>
          <img src={exportIcon} alt="->" />
          <span>Экспорт архива статей</span>
        </button>
        <button className={styles.export_doklad}>
          <img src={exportIcon} alt="->" />
          <span>Экспорт докладов</span>
        </button>
      </div>
    </div>
  );
}

export default HeadBlock;
