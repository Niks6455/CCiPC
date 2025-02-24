import styles from "./FileComponent.module.scss";
import { useState } from "react";
import trashIcon from "@assets/img/UI/trashBeliy.svg";
import fileIcon from "@assets/img/AdminPanel/file.svg";
import pdfIcon from "@assets/img/AdminPanel/pdf.svg";
import pdfIconImport from "@assets/img/AdminPanel/pdfImport.svg";
import docIcon from "@assets/img/AdminPanel/doc.svg";
import dragingIcon from "@assets/img/AdminPanel/dragging.svg";
import borderFile from "@assets/img/AdminPanel/borderFile.svg";

function FileComponent(props) {
  const [logoHeader, setLogoHeader] = useState(null);
  const [imageStyleHeader, setImageStyleHeader] = useState({});
  const [isVisibleHeader, setIsVisibleHeader] = useState(null);
  const [isVisibleNoFileHeader, setIsVisibleNoFileHeader] = useState(true);
  const [isDragging, setIsDragging] = useState(null);

  //! при клике на загрузить логотип хедера открываем инпут для загрузки файла
  const funFileHeaderClick = () => {
    document.getElementById(props.name).click();
  };

  //! функция изменения хедер иконки
  const funChangeLogoHeader = (file) => {
    // const file = event.target.files[0];
    if (file && !props.typeFile?.find((el) => el === file.type)) {
      alert(`Пожалуйста, выберите только ${props.typeFile}-файл.`);
      //   event.target.value = ""; // Сбрасываем выбранный файл
      setLogoHeader(null);
      props.setData(null, props.itemKey);
    } else if (file) {
      const fileUrl = URL.createObjectURL(file); // Создаем временный URL для файла
      setIsVisibleNoFileHeader(false);
      setTimeout(() => {
        setLogoHeader(fileUrl);
        setTimeout(() => {
          setIsVisibleHeader(true);
        }, 300);
      }, 500);
      props.setData(file, props.itemKey);
    }
  };

  //! определяем соотношение фото
  const handleImageLoad = (event) => {
    const img = event.target;
    if (img.naturalHeight > img.naturalWidth) {
      // Вертикальное изображение
      setImageStyleHeader({ height: "100%", width: "auto" });
    } else {
      // Горизонтальное изображение
      setImageStyleHeader({ width: "100%", height: "auto" });
    }
  };

  //! удалаение файла
  const funDeleteFile = () => {
    setIsVisibleHeader(false);
    setTimeout(() => {
      setLogoHeader(null);
      setIsVisibleHeader(null);
      props.setData(null, props.itemKey);
      document.getElementById(props.name).value = "";
      setIsVisibleNoFileHeader(null);
      setTimeout(() => {
        setIsVisibleNoFileHeader(true);
      }, 300);
    }, 500);
  };

  //! обработка загрузки через drag-and-drop
  const handleDrop = (event) => {
    // если файла нет то тогда можно загрузить
    if (logoHeader) return;
    event.preventDefault();
    setIsDragging(false);
    setTimeout(() => {
      setIsDragging(null);
    }, 300);
    const file = event.dataTransfer.files[0];
    console.log("file", file);
    funChangeLogoHeader(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    // Check if the drag is leaving the entire container
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
      setTimeout(() => {
        setIsDragging(null);
      }, 300);
    }
  };
  return (
    <div
      className={styles.FileComponent}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* <img src={borderFile} className={styles.border} /> */}

      {logoHeader ? (
        <div className={styles.container_file}>
          {props.icon === "png" && (
            <div className={styles.container_file_inner}>
              <img
                src={logoHeader}
                alt="Фото загруженно"
                className={`${styles.logo} ${
                  isVisibleHeader
                    ? styles.visible
                    : isVisibleHeader === null
                    ? styles.novisible
                    : ""
                }`}
                onLoad={(e) => handleImageLoad(e)}
                style={imageStyleHeader}
              />
            </div>
          )}
          {(props.icon === "pdf" || props.icon === "doc") && (
            <div className={styles.container_file_inner_file}>
              <div
                className={`${styles.box_logo} ${
                  isVisibleHeader
                    ? styles.visible
                    : isVisibleHeader === null
                    ? styles.novisible
                    : ""
                }`}
              >
                <img
                  src={props.icon === "doc" ? docIcon : pdfIconImport}
                  alt="Файл загружен"
                />
                <span>{props.data?.name}</span>
              </div>
            </div>
          )}
          <button className={styles.delete} onClick={() => funDeleteFile()}>
            <img
              src={trashIcon}
              alt="Удалить файл"
              className={`${styles.logo} ${
                isVisibleHeader
                  ? styles.visible
                  : isVisibleHeader === null
                  ? styles.novisible
                  : ""
              }`}
            />
          </button>
        </div>
      ) : (
        <div
          className={styles.container}
          tabIndex="0"
          onClick={() => funFileHeaderClick()}
        >
          <div
            className={`${styles.container_inner} ${
              isVisibleNoFileHeader
                ? styles.visible
                : isVisibleNoFileHeader === null
                ? styles.novisible
                : ""
            }`}
          >
            <div
              className={`${styles.is_dragging} ${
                isDragging
                  ? styles.is_dragging_opasity
                  : isDragging === null
                  ? styles.is_dragging_opasity_no
                  : ""
              }`}
            >
              <img src={dragingIcon} alt="Перетащите в эту область" />
            </div>
            {props.icon === "png" && (
              <img
                className={
                  isDragging !== null
                    ? styles.is_dragging_opasity_no
                    : styles.is_dragging_opasity
                }
                src={fileIcon}
                alt="Загрузить файл"
              />
            )}
            {props.icon === "pdf" && (
              <img
                className={
                  isDragging !== null
                    ? styles.is_dragging_opasity_no
                    : styles.is_dragging_opasity
                }
                src={pdfIcon}
                alt="Загрузить файл"
              />
            )}
            {props.icon === "doc" && (
              <img
                className={
                  isDragging !== null
                    ? styles.is_dragging_opasity_no
                    : styles.is_dragging_opasity
                }
                src={docIcon}
                alt="Загрузить файл"
              />
            )}
            <span
              className={
                isDragging !== null
                  ? styles.is_dragging_opasity_no
                  : styles.is_dragging_opasity
              }
              dangerouslySetInnerHTML={{ __html: props.text }}
            ></span>
          </div>
        </div>
      )}

      <input
        type="file"
        accept={props.accept}
        id={props.name}
        style={{ display: "none" }}
        onChange={(event) => funChangeLogoHeader(event.target.files[0])}
      />
    </div>
  );
}

export default FileComponent;
