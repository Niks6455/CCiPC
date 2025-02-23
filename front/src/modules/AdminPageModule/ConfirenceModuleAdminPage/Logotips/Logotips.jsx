import styles from "./Logotips.module.scss";
import FileComponent from "../../../../components/AdminModuleComponents/FileComponent/FileComponent";

function Logotips({ data, setData }) {
  //! функция изменения данных по файлу header
  const funChangeDataHeader = (value) => {
    setData({ ...data, logoHeader: value });
  };

  //! функция изменения данных по файлу footer
  const funChangeDataFooter = (value) => {
    setData({ ...data, logoFooter: value });
  };

  return (
    <div className={styles.Logotips}>
      {/* Логотип хедера */}
      <div className={styles.left_block}>
        <h3>Логотип (хедер)</h3>
        <FileComponent
          data={data.logoHeader}
          setData={funChangeDataHeader}
          typeFile={["image/png"]}
          accept={".png"}
          name={"logoHeader"}
          icon={"png"}
          text={"Загрузите или перетащите<br/>фотографию в формате PNG"}
        />
      </div>

      {/* Логотип футера */}
      <div className={styles.rigth_block}>
        <h3>Логотип (футер)</h3>
        <FileComponent
          data={data.logoFooter}
          setData={funChangeDataFooter}
          typeFile={["image/png"]}
          accept={".png"}
          name={"logoFooter"}
          icon={"png"}
          text={"Загрузите или перетащите<br/>фотографию в формате PNG"}
        />
      </div>
    </div>
  );
}

export default Logotips;
