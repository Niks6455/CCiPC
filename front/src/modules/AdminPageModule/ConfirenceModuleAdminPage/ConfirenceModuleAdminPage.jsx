import { useEffect, useState } from "react";
import styles from "./ConfirenceModuleAdminPage.module.scss";
import { testData } from "./data";
import StagesConference from "./StagesConference/StagesConference";
import Logotips from "./Logotips/Logotips";
import DocumentsModule from "./DocumentsModule/DocumentsModule";

function ConfirenceModuleAdminPage() {
  const [data, setData] = useState([]);

  //! получение конференции
  useEffect(() => {
    setData(testData);
  }, []);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <section className={styles.ConfirenceModuleAdminPage}>
      <h2 className={styles.title}>Конференция</h2>
      <StagesConference data={data} setData={setData} />
      <Logotips data={data} setData={setData} />
      <DocumentsModule data={data} setData={setData} />
    </section>
  );
}

export default ConfirenceModuleAdminPage;
