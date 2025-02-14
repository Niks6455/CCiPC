import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"; // Импортируем хук для работы с query params
import styles from "./ViewReports.module.scss";
import { ReactComponent as BlockFile } from "./../../../assets/img/blockFile.svg";

function ViewReports() {
  const [searchParams] = useSearchParams(); // Получаем query параметры
  const report = useSelector((state) => state.reportsSlice.data);
  const [reportData, setReportData] = useState(null);
  //! появление названия
  const [showTooltip, setShowTooltip] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const navigate = useNavigate();
  const handleMouseEnter = (index) => {
    // Устанавливаем таймер для задержки
    const timeout = setTimeout(() => {
      setShowTooltip(index);
    }, 500); // Задержка в 300 мс

    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Очищаем таймер и скрываем подсказку
    clearTimeout(tooltipTimeout);
    setShowTooltip(null);
  };

  const handleMouseMove = (event) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
  };
  useEffect(() => {
    const idReport = searchParams.get("idReport"); // Получаем idReport из query параметров
    if (idReport && report.length > 0) {
      setReportData(report.find((item) => item.id === idReport));
    }
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов
  useEffect(() => {
    console.log("reportData", reportData);
  }, [reportData]);
  return (
    <section className={styles.ViewReports}>
      <div className={styles.ViewReportsInner}>
        <div className={styles.ViewReportsInnerFirst}>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>
              Название доклада № {reportData?.number}:
            </p>
            <p>{reportData?.name}</p>
          </div>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>Направление конференции:</p>
            <p>{reportData?.direction}</p>
          </div>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>Статус участия:</p>
            <p>{reportData?.form}</p>
          </div>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>Комментарий:</p>
            <p>{reportData?.comment}</p>
          </div>
        </div>
        <div className={styles.ViewReportsInnerSecond}>
          <div className={styles.ViewReportsSoauthors}>
            <p className={styles.ViewReportsTitle}>Соавторы:</p>
            {reportData?.coAuthors?.map((item, index) => (
              <div key={index}>
                <p className={styles.name}>{`${index + 1}. ${item?.name} ${
                  item?.surname
                } ${item?.patronymic}`}</p>
                <ul>
                  <li>
                    {" "}
                    <p>{item?.organization}</p>
                  </li>
                  <li>
                    {" "}
                    <p>{item?.email}</p>
                  </li>
                  <li>
                    {" "}
                    <p>{item?.phone}</p>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.fileLouders}>
        <div
          className={styles.fileContur}
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={() => handleMouseLeave()}
          onMouseMove={handleMouseMove}
        >
          <p className={styles.fileLoudersTitle}>Доклад:</p>
          <>
            <div className={styles.fileName}>
              <span>{report.reportFile?.name || "Документ.pdf"}</span>
            </div>
            <BlockFile className={styles.blockFile} />
          </>
          {showTooltip === 1 && (
            <div
              style={{
                left: coordinates.x - 445,
                top: coordinates.y - 460,
              }}
              className={styles.repName}
            >
              Открыть
            </div>
          )}
        </div>
        <div
          className={styles.fileContur}
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={() => handleMouseLeave()}
          onMouseMove={handleMouseMove}
        >
          <p className={styles.fileLoudersTitle}>Экспертное заключение:</p>
          <>
            <div className={styles.fileName}>
              <span>{report.conclusion?.name || "Документ.pdf"}</span>
            </div>
            <BlockFile className={styles.blockFile} />
          </>
          {showTooltip === 2 && (
            <div
              style={{
                left: coordinates.x - 1060,
                top: coordinates.y - 465,
              }}
              className={styles.repName}
            >
              Открыть
            </div>
          )}
        </div>
      </div>
      <div className={styles.EditDataReport}>
        <button
          onClick={() =>
            navigate(`/account/editreport?idReport=${reportData?.id}`)
          }
        >
          Редактировать данные
        </button>
      </div>
    </section>
  );
}

export default ViewReports;
