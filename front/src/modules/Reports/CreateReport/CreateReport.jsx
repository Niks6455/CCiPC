import { useRef, useState } from "react";
import styles from "./CreateReport.module.scss";
import {
  directionConferenceList,
  formParticipationList,
  participationStatus,
} from "../../../utils/List";
import fileImport from "./../../../assets/img/fileImport.svg";
import errorList from "./../../../assets/img/UI/errorZnak.svg";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../../store/reportCreateSlice/reportCreateSlice";
import InputListForma from "../../../components/InputListForma/InputListForma";
import download from "./../../../assets/img/UI/download.svg";
import exampleFile from "./../../../utils/files/template.docx";
import { useNavigate } from "react-router-dom";

function CreateReport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);

  //! функция скачивания шаблока
  const funDownloadShablon = () => {
    const link = document.createElement("a");
    link.href = exampleFile; // Указываем путь к файлу
    link.download = "template.docx"; // Имя файла для скачивания
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fileInputStatyaRef = useRef(null);
  //! загрузить файл со статьей
  const funUploadFileStatya = () => {
    fileInputStatyaRef.current.click(); // Программно кликаем по input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setValue({ key: "fileArticle", value: file })); // Сохраняем файл в Redux
    }
  };

  //! загрузить файл с заключением
  const fileInputZaklRef = useRef(null);
  const funUploadFileZakl = () => {
    fileInputZaklRef.current.click(); // Программно кликаем по input
  };

  const handleFileChangeZakl = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setValue({ key: "fileConclusion", value: file })); // Сохраняем файл в Redux
    }
  };
  return (
    <div className={styles.CreateReport}>
      <h2 className={styles.title}>Доклад №{report.number}</h2>
      <div className={styles.slider}>
        <div
          className={styles.sliderInner}
          style={{
            width: `${report.sliderState}%`,
            transition: "all 0.15s linear",
          }}
        ></div>
      </div>
      <p className={styles.nameReport}>Полное название доклада</p>

      <textarea
        type="text"
        className={styles.nameReportInput}
        value={report.name}
        onChange={(event) =>
          dispatch(setValue({ key: "name", value: event.target.value }))
        }
      />
      <div className={styles.inputsContainer}>
        <InputListForma
          name={"Направление конференции"}
          list={directionConferenceList}
          itemKey={"directionConference"}
          value={report.directionConference}
        />
        <InputListForma
          name={"Форма участия"}
          list={formParticipationList}
          itemKey={"formParticipation"}
          value={report.formParticipation}
        />
        <InputListForma
          name={"Статус участия"}
          list={participationStatus}
          itemKey={"participationStatus"}
          value={report.participationStatus}
        />
      </div>
      <div className={styles.fileContainer}>
        <div className={styles.box}>
          <p>Добавить файл со статьёй</p>
          <div className={styles.fileContur}>
            <input
              type="file"
              ref={fileInputStatyaRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Скрываем input
            />
            <img
              src={fileImport}
              alt="загрузить файл"
              onClick={funUploadFileStatya}
              draggable="false"
            />
            <div className={styles.downloadShablon}>
              <div className={styles.shablon} onClick={funDownloadShablon}>
                <span>Шаблон</span>
                <img src={download} alt="img" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <p>Добавить файл с экспертным заключением</p>
          <div className={styles.fileContur}>
            <input
              type="file"
              ref={fileInputZaklRef}
              onChange={handleFileChangeZakl}
              style={{ display: "none" }} // Скрываем input
            />
            <img
              src={fileImport}
              alt="загрузить файл"
              draggable="false"
              onClick={funUploadFileZakl}
            />
          </div>
        </div>
      </div>
      <div className={styles.context}>
        <p>
          Комментарий (пожелания по прибытию, по расселению; свободное текстовое
          поле)
        </p>
        <textarea
          type="text"
          readOnly={false}
          placeholder="Ваш комментарий"
          value={report.comments}
          onChange={(event) =>
            dispatch(setValue({ key: "comments", value: event.target.value }))
          }
        />
      </div>
      <div className={styles.srokContainer}>
        <div className={styles.text}>
          <img src={errorList} alt="img" />
          <span>
            В срок до XX.XX.XХХX необходимо прислать заявку на доклад, а в срок
            до ХХ.ХХ.ХХХХ загрузить статью и экспертное заключение.
          </span>
        </div>
        <button onClick={() => navigate("/Lks/addcoauthor")}>
          Следующий шаг
        </button>
      </div>
    </div>
  );
}

export default CreateReport;
