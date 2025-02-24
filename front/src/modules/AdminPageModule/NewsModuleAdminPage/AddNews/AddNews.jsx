import styles from "./AddNews.module.scss";
import goBackImg from "@assets/img/AdminPanel/goBack.svg";
import { ReactComponent as FileImport } from "@assets/img/AdminPanel/addFile.svg";
import trashBeliy from "@assets/img/UI/trashBeliy.svg";
import { useRef, useState } from "react";
import { createNews } from "../../../../apirequests/apirequests";
import FileComponent from "../../../../components/AdminModuleComponents/FileComponent/FileComponent";

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
  const handleFileChange = (file) => {
    if (file) {
      setFile(file); // Создаем URL для отображения изображения
    }
  };

  const saveData = () => {
    const data = {
      title: title,
      description: text
    }
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("text", text);
    // if (file) {
    //   formData.append("file", file);
    // }
    // console.log(formData);
    createNews(data).then((res) => {
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
          <div className={styles.addFileInner}>
            <FileComponent
              data={file}
              setData={handleFileChange}
              typeFile={["image/png", "image/jpg", "image/jpeg"]}
              accept={".png,.jpg"}
              name={"pngNews"}
              icon={"png"}
              text={"Необходимо загрузить<br/> фотографию в формате JPG, PNG"}
            />
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
