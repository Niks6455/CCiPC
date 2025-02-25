import styles from "./AddNews.module.scss";
import goBackImg from "@assets/img/AdminPanel/goBack.svg";
import { ReactComponent as FileImport } from "@assets/img/AdminPanel/addFile.svg";
import trashBeliy from "@assets/img/UI/trashBeliy.svg";
import { useEffect, useRef, useState } from "react";
import { createNews, deleteNews, getNewsId, updateNews } from "../../../../apirequests/apirequests";
import FileComponent from "@components/AdminModuleComponents/FileComponent/FileComponent";
import { useSelector } from "react-redux";
import trashRed from "@assets/img/AdminPanel/delete.svg";
import borderIcon from "@assets/img/AdminPanel/borderFile.svg";

function AddNews(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const store = useSelector(state => state.news);
  useEffect(() => {
    getNewsId(store?.selectNewsData).then((response) => {
      if(response?.status === 200){
        setTitle(response?.data?.title)
        setText(response?.data?.description)      
      }
    })
  },[])

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
      if(res?.status === 200 || res?.status === 201){
        props?.updateNewsData();
      }
    });
    props?.closeAddNews();
  };

  const deleteData = (id) => {
    deleteNews(id).then((res) => {
      if(res?.status === 200){
        props?.closeAddNews();
        props?.updateNewsData();
      }
    })
  }
  const saveEditData = (id) =>{
    const data = {
      title: title,
      description: text
    }
    updateNews(id, data).then((res) => {
      if(res?.status === 200){
        props?.updateNewsData();
        props?.closeAddNews();
      }
    })
  }

  return (
    <section className={styles.AddNews}>
      <button className={styles.buttonBack} onClick={props?.closeAddNews}>
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
            <div className={styles.file_cont}>
              <div className={styles.border_inner}>
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
      </div>
      {store?.selectNewsData === null ? 
        <div className={styles.addNewsCont}>
        <button className={styles.addNews} onClick={() => saveData()}>Добавить</button>
      </div>:
      <div className={styles.editNewsCont}>
        <div className={styles.editNewsContInner}>
          <button className={styles.deleteNews} onClick={() => deleteData(store?.selectNewsData)} >Удалить <img src={trashRed}/></button>
          <button className={styles.addNews} onClick={() => saveEditData(store?.selectNewsData)}>Сохранить</button>
          </div>
      </div>
      }
      
    </section>
  );
}

export default AddNews;
