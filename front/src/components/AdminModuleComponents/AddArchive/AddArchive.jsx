import styles from "./AddArchive.module.scss";
import addPhoto from "@assets/img/AdminPanel/addPhoto.svg";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
import FileComponent from "../FileComponent/FileComponent";
import borderIcon from "@assets/img/AdminPanel/borderFile.svg";
import { useEffect, useRef, useState } from "react";
import { createOrgCommitet } from "../../../apirequests/apirequests";

function AddArchive(props) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const textareaRef = useRef(null);

  const createOrg = () => {
    const data = {
        name: name,
        link: link,
    };

    console.log("data", data);
  };

  //! Обработчик выбора файла
  const handleFileChange = (file) => {
    setFile(file);
  };

  //! Автоматическое изменение высоты textarea
  const handleTextareaChange = (e) => {
    setLink(e.target.value);
  
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Сброс текущей высоты
      const newHeight = Math.min(textareaRef.current.scrollHeight, 145); // Ограничение 150px
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY = newHeight >= 145 ? "auto" : "hidden"; // Скролл только при необходимости
    }
  };
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Устанавливает высоту под контент
      const newHeight = Math.min(textareaRef.current.scrollHeight, 145);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);
  

  return (
    <div className={styles.AddOrgPeople}>
      <div className={styles.AddOrgPeopleInner}>
        <div className={styles.addFile}>
          <div
            className={styles.file_cont}
            style={{ border: !file ? "2px dashed #C4C4C4" : "none" }}
          >
            <div className={styles.border_inner}>
              <FileComponent
                data={file}
                setData={handleFileChange}
                typeFile={["image/png", "image/jpg", "image/jpeg"]}
                accept={".png,.jpg"}
                name={"pngNews"}
                icon={"png"}
                text={"Нажмите или перетащите</br> изображение для добавления"}
              />
            </div>
          </div>
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Название альбома</label>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Ссылка</label>
          <textarea
            ref={textareaRef}
            value={link}
            onChange={handleTextareaChange}
            style={{
              minHeight: "62px",
              maxHeight: "145px",
              overflowY: "hidden",
              resize: "none", // Опционально: убирает пользовательское растягивание
            }}
          />


        </div>

        <div className={styles.AddOrgPeopleButton}>
          <button className={styles.save} onClick={createOrg}>
            Сохранить
          </button>
          <button className={styles.delete} onClick={props.close}>
            <img src={deletePhotoImg} alt="Удалить" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddArchive;
