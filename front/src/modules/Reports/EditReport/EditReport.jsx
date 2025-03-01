import { useEffect, useState } from "react";
import styles from "./EditReport.module.scss";
import { useNavigate, useSearchParams } from "react-router-dom"; // Импортируем хук для работы с query params
import { useDispatch, useSelector } from "react-redux";
import CreateReport from "../CreateReport/CreateReport";
import AddCoauthor from "../AddCoauthor/AddCoauthor";
import { disEditReport } from "../../../store/reportCreateSlice/reportCreateSlice";

function EditReport() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams(); // Получаем query параметры
  const report = useSelector((state) => state.reportsSlice.data);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const idReport = searchParams.get("idReport"); // Получаем idReport из query параметров
    if (idReport && report.length > 0) {
      setReportData(report.find((item) => item.id === idReport));
    }
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов

  useEffect(() => {
    if (reportData) {
      const temp = {
        id: reportData.id,
        status: "save",
        number: searchParams.get("number"),
        name: reportData.name,
        directionConference: reportData.direction,
        formParticipation: reportData.form,
        participationStatus: reportData.participationStatus,
        fileArticle: reportData.reportFile,
        fileExpertOpinion: reportData.conclusion,
        comments: reportData.comment,
        soauthors: reportData.coAuthors?.map((soauthor) => ({
          data: {
            name: soauthor?.name || "",
            surname: soauthor?.surname || "",
            patronymic: soauthor?.patronymic || "",
            organization: soauthor?.organization || "",
            email: soauthor?.email || "",
            phone: soauthor?.phone || "",
            formParticipation: soauthor?.form || "",
          },
          autocompletion: "true",
        })),
      };
      dispatch(disEditReport({ data: temp }));
    }
  }, [reportData]);

  return (
    <section className={styles.EditReport}>
      <CreateReport edit={true} />
      <div className={styles.otstup}></div>
      <AddCoauthor edit={true} number={searchParams.get("number")} />
    </section>
  );
}

export default EditReport;
