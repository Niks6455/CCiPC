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
  uploadPhoto,
} from "../../../apirequests/apirequests";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  convertDate,
  convertDateTire,
} from "../../../utils/functions/funcions";

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
        stages: qery.stages.map((item) => ({
          date: convertDate(item.date),
          name: item.name,
        })),
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
        dateSecond: qery.date,
        address: qery.address,
        organizers: qery.organizers,
        partners: qery.partners,
        deadlineUploadingReports: convertDate(qery.deadline),
      };
      setData(data);
    }
  }, [conferensetQery?.data?.data?.conference]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  //! для отправки файла
  const funApiEditFile = (file, key) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("conferenceId", conferenseId);
    uploadPhoto(formData, key);
  };

  //! отправляем измененные данные на бэк
  const funEditDataApi = () => {
    const dat = {
      stages: data.stages.map((item) => ({
        date: convertDateTire(item.date),
        name: item.name,
      })),
      description: data.aboutConference,
      directions: data.directions,
      date: data.dateFirst,
      deadline: convertDateTire(data.deadlineUploadingReports) || null,
      address: data.address,
    };
    //! сохранение логотпа хедера
    if (typeof data.logoHeader === "object") {
      funApiEditFile(data.logoHeader, "HEADER");
    }
    //! сохранение логотпа футера
    if (typeof data.logoFooter === "object") {
      funApiEditFile(data.logoFooter, "FOOTER");
    }
    //! файла программы конференции
    if (typeof data.programConference === "object") {
      funApiEditFile(data.programConference, "PROGRAM");
    }
    //! файла буклета
    if (typeof data.informationLetter === "object") {
      funApiEditFile(data.informationLetter, "LETTER");
    }
    //! файл коллекции работ
    if (typeof data.worksCollection === "object") {
      funApiEditFile(data.worksCollection, "COLLECTION");
    }
    //! файл шаблона статьи
    console.log("data.аrticleTemplate", data.аrticleTemplate);
    if (typeof data.аrticleTemplate === "object") {
      funApiEditFile(data.аrticleTemplate, "SAMPLE");
    }
    //! файл документа о платёже индивидуальных
    if (typeof data.cashlessIndividual === "object") {
      funApiEditFile(data.cashlessIndividual, "INDIVIDUAL");
    }
    //! файл документа о платёже юрлиц
    if (typeof data.cashlessEntities === "object") {
      funApiEditFile(data.cashlessEntities, "LEGAL");
    }

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
