import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"; // Импортируем хук для работы с query params
import styles from "./ViewReports.module.scss";
import { ReactComponent as BlockFile } from "./../../../assets/img/blockFile.svg";
import { ReactComponent as Trash } from "./../../../assets/img/UI/trash.svg";
import { apiDeleteReport } from "../../../apirequests/apirequests";
import { disDeleteReport } from "../../../store/reportsSlice/reportsSlice";

function ViewReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportsSlice.data);
  const [searchParams] = useSearchParams(); // Получаем query параметры
  const [reportData, setReportData] = useState(null);
  const [number, setNumber] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);

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
    setNumber(searchParams.get("number")); // Получаем idReport из query параметров
    if (idReport && report.length > 0) {
      setReportData(report.find((item) => item.id === idReport));
    }
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов

  useEffect(() => {
    console.log("reportData", reportData);
  }, [reportData]);

  //! функция удаления доклада
  const deleteReportOpenModal = () => {
    //! открываем попап удаления доклада
    setIsModalDelete(true);
  };

  const funDeleteReport = () => {
    //! удаляем доклад
    apiDeleteReport(reportData.id).then((res) => {
      if (res?.status === 200) {
        dispatch(disDeleteReport(reportData.id));
        setIsModalDelete(false);
        navigate("/account/profile");
      }
    });
  };

  return (
    <section className={styles.ViewReports}>
      {isModalDelete && (
        <div className={styles.modal_container}>
          <div className={styles.modal_delete_report}>
            <h2>
              Вы действительно хотите удалить доклад “Название доклада”?
              Отменить это действие будет невозможно.
            </h2>
            <div className={styles.button_container}>
              <button
                className={styles.cancle}
                onClick={() => setIsModalDelete(false)}
              >
                Назад
              </button>
              <button className={styles.delete} onClick={funDeleteReport}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.ViewReportsInner}>
        <div className={styles.ViewReportsInnerFirst}>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>
              Название доклада № {number}:
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
          className={styles.button_edit}
          onClick={() =>
            navigate(`/account/editreport?idReport=${reportData?.id}`)
          }
        >
          Редактировать данные
        </button>
        <button
          className={styles.button_delete}
          onClick={deleteReportOpenModal}
        >
          <span>Удалить доклад</span>
          <Trash />
        </button>
      </div>
    </section>
  );
}

export default ViewReports;
