import { useEffect, useState } from "react";
import styles from "./ConfirenceModuleAdminPage.module.scss";
import { testData } from "./data";
import StagesConference from "./StagesConference/StagesConference";
import Logotips from "./Logotips/Logotips";
import DocumentsModule from "./DocumentsModule/DocumentsModule";
import AboutConference from "./AboutConference/AboutConference";
import Directions from "./Directions/Directions";
import DateAdsess from "./DateAdsess/DateAdsess";
import Organizers from "./Organizers/Organizers";

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
      <DateAdsess data={data} setData={setData} />

      <Logotips data={data} setData={setData} />
      <DocumentsModule data={data} setData={setData} />
      <AboutConference data={data} setData={setData} />
      <Directions data={data} setData={setData} />
      <Organizers
        data={data}
        setData={setData}
        itemKey={"organizers"}
        name={"Организаторы"}
        buttonName={"Добавить организатора"}
      />
      <Organizers
        data={data}
        setData={setData}
        itemKey={"partners"}
        name={"Партнёры"}
        buttonName={"Добавить партнёра"}
      />
    </section>
  );
}

export default ConfirenceModuleAdminPage;
