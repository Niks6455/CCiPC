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
import {
  apiGetConferencesById,
  apiPutConferencesById,
} from "../../../apirequests/apirequests";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

function ConfirenceModuleAdminPage() {
  const [data, setData] = useState([]);
  const conferenses = useSelector((state) => state.conferences?.data);
  const [conferenseId, setConferenseId] = useState(null);

  const conferensetQery = useQuery({
    queryKey: [`${conferenseId}`, conferenseId],
    queryFn: () => apiGetConferencesById(conferenseId),
    enabled: !!conferenseId,
  });

  useEffect(() => {
    if (conferenses?.[0]?.id) {
      setConferenseId(conferenses[0]?.id);
    }
  }, [conferenses]);

  //! получение конференции
  useEffect(() => {
    const qery = conferensetQery?.data?.data?.conference;
    console.log("conferensetQery", qery);

    if (qery) {
      let data = {
        stages: qery.stages,
        logoHeader: qery.logo?.HEADER,
        logoFooter: qery.logo?.FOOTER,
        programConference: qery.documents?.PROGRAM,
        informationLetter: qery.documents?.LETTER,
        worksCollection: qery.documents?.COLLECTION,
        аrticleTemplate: qery.documents?.SAMPLE,
        cashlessIndividual: qery.documents?.INDIVIDUAL,
        cashlessEntities: qery.documents?.LEGAL,
        aboutConference: qery.description,
        directions: qery.directions,
        dateFirst: qery.date,
        dateSecond: qery.deadline,
        address: qery.address,
        organizers: qery.organizers,
        partners: qery.partners,
      };
      setData(data);
    }
  }, [conferensetQery?.data?.data?.conference]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const funEditDataApi = () => {
    const dat = {
      stages: data.stages,
      description: data.aboutConference,
      directions: data.directions,
      date: data.dateFirst,
      deadline: data.dateSecond,
      address: data.address,
    };
    apiPutConferencesById(dat, conferenseId);
  };

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
      <div className={styles.buttons}>
        <div className={styles.buttons_inner}>
          <button>Отмена</button>
          <button onClick={funEditDataApi}>Сохранить изменения</button>
        </div>
      </div>
    </section>
  );
}

export default ConfirenceModuleAdminPage;
