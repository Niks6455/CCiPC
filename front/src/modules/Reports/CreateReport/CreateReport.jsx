import { useEffect, useState } from "react";
import styles from "./CreateReport.module.scss";
import {
  directionConferenceList,
  formParticipationList,
  participationStatus,
} from "../../../utils/Lists/List";
import errorList from "./../../../assets/img/UI/errorZnak.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  disSetResetReport,
  setValue,
} from "../../../store/reportCreateSlice/reportCreateSlice";
import InputListForma from "../../../components/InputListForma/InputListForma";
import download from "./../../../assets/img/UI/download.svg";
import exampleFile from "./../../../utils/files/template.docx";
import { useNavigate } from "react-router-dom";
import FileComponent from "../../../components/AdminModuleComponents/FileComponent/FileComponent";
import { ReactComponent as BorderIcon } from "@assets/img/AdminPanel/border2.svg";

function CreateReport({ edit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);
  // const conferences = useSelector((state) => state.conferences.data);
  const [errorName, setErrorName] = useState(false);

  useEffect(() => {
    if (!edit) {
      dispatch(disSetResetReport());
    }
  }, []);

  //! функция скачивания шаблока
  const funDownloadShablon = () => {
    const link = document.createElement("a");
    link.href = exampleFile; // Указываем путь к файлу
    link.download = "template.docx"; // Имя файла для скачивания
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const funChangeFile = (value, key) => {
    console.log("value", value);
    dispatch(setValue({ key: key, value: value }));
  };

  //! функция onClange на InputListForm
  const handleChangeForm = (name, text) => {
    dispatch(setValue({ key: name, value: text }));
    console.log("name", name);
  };

  //! изменение названия доклада с валидацией
  const funChangeNameReport = (value) => {
    if (value.length > 300) {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
    dispatch(setValue({ key: "name", value: value }));
  };

  return (
    <div className={styles.CreateReport}>
      <h2 className={styles.title}>Доклад №{report.data.number}</h2>
      {!edit && (
        <div className={styles.slider}>
          <div
            className={styles.sliderInner}
            style={{
              width: `${report.sliderState}%`,
              transition: "all 0.15s linear",
            }}
          ></div>
        </div>
      )}

      <p className={styles.nameReport}>Полное название доклада</p>

      <div className={styles.name_report_container}>
        {errorName && (
          <div className={styles.error_name}>
            <span>Не более 300 символов*</span>
          </div>
        )}
        <textarea
          type="text"
          className={`${errorName ? styles.error_input_name : ""} ${
            styles.nameReportInput
          }`}
          value={report.data.name}
          onChange={(event) => funChangeNameReport(event.target.value)}
        />
      </div>

      <div className={styles.inputsContainer}>
        <InputListForma
          name={"Направление конференции"}
          list={directionConferenceList}
          itemKey={"directionConference"}
          value={report.data.directionConference}
          handleChangeForm={handleChangeForm}
        />
        <InputListForma
          name={"Форма участия"}
          list={formParticipationList}
          itemKey={"formParticipation"}
          value={report.data.formParticipation}
          handleChangeForm={handleChangeForm}
        />
        <InputListForma
          name={"Статус участия"}
          list={participationStatus}
          itemKey={"participationStatus"}
          value={report.data.participationStatus}
          handleChangeForm={handleChangeForm}
        />
      </div>
      <div className={styles.inputsContainer}>
        <div className={styles.input_organization}>
          <span>Организация</span>
          <input
            type="text"
            value={report.data.organization}
            onChange={(e) => handleChangeForm("organization", e.target.value)}
            placeholder="Ваша организация"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Ваша организация")}
          />
        </div>
      </div>

      <div className={styles.fileContainer}>
        <div className={styles.box}>
          <p>Добавить файл со статьёй</p>
          <div className={styles.fileContur}>
            <div className={styles.file_block}>
              {!report.data.fileArticle && (
                <BorderIcon className={styles.border} />
              )}
              <div className={styles.file_inner}>
                <FileComponent
                  data={report.data.fileArticle}
                  setData={(value) => funChangeFile(value, "fileArticle")}
                  typeFile={["application/pdf"]}
                  accept={".pdf"}
                  name={"fileArticle"}
                  icon={"pdf"}
                  itemKey={"fileArticle"}
                  fileSize={20} // размер файла
                  text={"Необходимо загрузить<br/>файл в формате PDF"}
                />
              </div>
            </div>

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
            <div className={styles.file_block}>
              {!report.data.fileExpertOpinion && (
                <BorderIcon className={styles.border} />
              )}
              <div className={styles.file_inner}>
                <FileComponent
                  data={report.data.fileExpertOpinion}
                  setData={(value) => funChangeFile(value, "fileExpertOpinion")}
                  typeFile={["application/pdf"]}
                  accept={".pdf"}
                  name={"fileExpertOpinion"}
                  icon={"pdf"}
                  itemKey={"fileExpertOpinion"}
                  fileSize={20} // размер файла
                  text={"Необходимо загрузить<br/>файл в формате PDF"}
                />
              </div>
            </div>
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
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Ваш комментарий")}
          value={report.data.comments}
          onChange={(event) =>
            dispatch(setValue({ key: "comments", value: event.target.value }))
          }
        />
      </div>
      {!edit && (
        <div className={styles.srokContainer}>
          <div className={styles.text}>
            <img src={errorList} alt="img" />
            <span>
              В срок до необходимо прислать заявку на доклад, а в срок до
              ХХ.ХХ.ХХХХ загрузить статью и экспертное заключение.
            </span>
          </div>
          <button
            style={
              errorName ? { cursor: "not-allowed" } : { cursor: "pointer" }
            }
            onClick={() => !errorName && navigate("/account/addcoauthor")}
          >
            Следующий шаг
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateReport;
