import styles from "./AddNews.module.scss";
import goBackImg from "@assets/img/AdminPanel/goBack.svg";
import { ReactComponent as FileImport } from "@assets/img/AdminPanel/addFile.svg";
import trashBeliy from "@assets/img/UI/trashBeliy.svg";
import { useRef, useState } from "react";
import { createNews } from "../../../../apirequests/apirequests";

function AddNews({ closeAddNews }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  //! Загрузить файл через клик
  const uploadFile = () => {
    fileInputRef.current.click();
  };

  //! Обработчик выбора файла
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile)); // Создаем URL для отображения изображения
    }
  };

  //! Удаление файла
  const deleteFile = () => {
    setFile(null);
    fileInputRef.current.value = "";
  };

  //! Обработка перетаскивания файла
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(URL.createObjectURL(droppedFile));
    }
  };

  const saveData = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    if (file) {
      formData.append("file", file);
    }
    console.log(formData);
    createNews(formData).then((res) => {
      console.log(res);
    });
    closeAddNews();
  };

  return (
    <section className={styles.AddNews}>
      <button className={styles.buttonBack} onClick={closeAddNews}>
        <img src={goBackImg} alt="Назад" /> Добавление новости
      </button>
      
      <div className={styles.addNewsTextAreaOne}>
        <label>Заголовок новости</label>
        <textarea
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className={styles.addNewsTextBlockTwo}>
        <div>
          <label>Текст новости</label>
          <textarea
            placeholder="Текст новости"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={styles.addFile}>
          <label>Фотография для новости</label>
          <div
            className={styles.fileContur}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {file ? (
              <>
                <img src={file} alt="Превью" className={styles.previewImage} />
                <button  className={styles.trash}  onClick={deleteFile}>
                    <img
                        src={trashBeliy}
                        alt="Удалить"
                    />
                </button>
                
              </>
            ) : (
              <FileImport
                className={styles.fileImport}
                draggable="false"
                onClick={uploadFile}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.addNewsCont}>
        <button className={styles.addNews} onClick={() => saveData()}>Добавить</button>
      </div>
    </section>
  );
}

export default AddNews;
