import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom"; // Импортируем хук для работы с query params
import styles from "./ViewReports.module.scss";
import { ReactComponent as BlockFile } from "./../../../assets/img/blockFile.svg";
import { ReactComponent as Trash } from "./../../../assets/img/UI/trash.svg";
import {
  apiDeleteReport,
  apiGetReportId,
  server,
} from "../../../apirequests/apirequests";
import { disDeleteReport } from "../../../store/reportsSlice/reportsSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { decodeFileName } from "../../../utils/functions/funcions";

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
  const [idReport, setIdReport] = useState(null);

  const reportQery = useQuery({
    queryKey: [`${idReport}`, idReport],
    queryFn: () => apiGetReportId(idReport),
    enabled: !!idReport,
  });

  useEffect(() => {
    setReportData(reportQery?.data?.data?.report);
  }, [reportQery]);

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
    if (idReport) {
      setIdReport(idReport);
    }
    setNumber(searchParams.get("number")); // Получаем number из query параметров
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов

  //! функция удаления доклада
  const deleteReportOpenModal = () => {
    //! открываем попап удаления доклада
    setIsModalDelete(true);
  };

  const funDeleteReport = () => {
    //! удаляем доклад
    const id = reportData.id;
    apiDeleteReport(id).then((res) => {
      if (res?.status === 200) {
        console.log("reportData", id);
        dispatch(disDeleteReport({ id }));
        setIsModalDelete(false);
        navigate("/account/profile");
      }
    });
  };

  const funOpenFile = (file) => {
    //открытие файла по ссылке
    window.open(`${server}/${file}`, "_blank");
  };

  const getFileName = (file) => {
    const fileName = file?.split("\\").pop();
    if (!fileName) return "Документ.pdf";
    return decodeFileName(fileName);
  };

  return (
    <section className={styles.ViewReports}>
      <AnimatePresence>
        {isModalDelete && (
          <div className={styles.modal_container}>
            <motion.div
              className={styles.modal_delete_report}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <h2>
                {`Вы действительно хотите удалить доклад “${reportData?.name}”?
                Отменить это действие будет невозможно.`}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={styles.ViewReportsInner}>
        <div className={styles.ViewReportsInnerFirst}>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>Автор:</p>
            <p>{reportData?.author?.fio}</p>
          </div>
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
            <p className={styles.ViewReportsTitle}>Форма участия:</p>
            <p>{reportData?.author?.form}</p>
          </div>
          <div className={styles.ViewReportsBlock}>
            <p className={styles.ViewReportsTitle}>Статус участия:</p>
            <p>{reportData?.author?.status}</p>
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
                <p className={styles.name}>{`${index + 1}. ${item.fio}`}</p>
                <ul>
                  <li>
                    {" "}
                    <p>{item?.organization || "Отсутствует"}</p>
                  </li>
                  <li>
                    {" "}
                    <p>{item?.email || "Отсутствует"}</p>
                  </li>
                  <li>
                    {" "}
                    <p>{item?.phone || "Отсутствует"}</p>
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
              <span>
                {getFileName(reportData?.reportFile) || "Документ.pdf"}
              </span>
            </div>
            <BlockFile
              className={styles.blockFile}
              onClick={() => funOpenFile(reportData?.reportFile)}
            />
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
              <span>
                {getFileName(reportData?.conclusion) || "Документ.pdf"}
              </span>
            </div>
            <BlockFile
              className={styles.blockFile}
              onClick={() => funOpenFile(reportData?.conclusion)}
            />
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
            navigate(
              `/account/editreport?idReport=${reportData?.id}&number=${number}`
            )
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
