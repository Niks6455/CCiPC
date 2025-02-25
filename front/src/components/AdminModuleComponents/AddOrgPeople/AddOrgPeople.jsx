import styles from "./AddOrgPeople.module.scss";
import addPhoto from "@assets/img/AdminPanel/addPhoto.svg";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
import FileComponent from "../FileComponent/FileComponent";
import borderIcon from "@assets/img/AdminPanel/borderFile.svg";
import { useEffect, useRef, useState } from "react";
import { createOrgCommitet } from "../../../apirequests/apirequests";

function AddOrgPeople(props) {
  const [file, setFile] = useState(null);
  const [fio, setFio] = useState("");
  const [organization, setOrganization] = useState("");
  const textareaRef = useRef(null);

  const createOrg = () => {
    const data = {
      fio,
      organization,
      type: props?.type,
    };

    createOrgCommitet(data).then((res) => {
      if (res?.status === 200) {
        console.log("res", res);
      }
    });
  };

  //! Обработчик выбора файла
  const handleFileChange = (file) => {
    console.log("file", file);
    setFile(file);
  };

  //! Автоматическое изменение высоты textarea
  const handleTextareaChange = (e) => {
    setOrganization(e.target.value);
  
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
          <label>ФИО</label>
          <input type="text" onChange={(e) => setFio(e.target.value)} />
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Организация</label>
          <textarea
            ref={textareaRef}
            value={organization}
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
          <button className={styles.delete} onClick={props.closeCreateOne}>
            <img src={deletePhotoImg} alt="Удалить" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddOrgPeople;
