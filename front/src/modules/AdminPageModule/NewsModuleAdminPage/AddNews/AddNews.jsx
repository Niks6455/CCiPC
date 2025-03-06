import styles from "./AddNews.module.scss";
import goBackImg from "@assets/img/AdminPanel/goBack.svg";
import { ReactComponent as FileImport } from "@assets/img/AdminPanel/addFile.svg";
import trashBeliy from "@assets/img/UI/trashBeliy.svg";
import { useEffect, useRef, useState } from "react";
import { createNews, deleteNews, getNewsId, server, updateNews, uploadPhoto } from "../../../../apirequests/apirequests";
import FileComponent from "@components/AdminModuleComponents/FileComponent/FileComponent";
import { useDispatch, useSelector } from "react-redux";
import trashRed from "@assets/img/AdminPanel/delete.svg";
import borderIcon from "@assets/img/AdminPanel/borderFile.svg";
import { setSelectNewsData } from "../../../../store/newsSlice/newsSlice";

function AddNews(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [logoHeader, setLogoHeader] = useState(null);
  const [error, setError] = useState({ title: "", text: "", file: "" }); // Ошибки
  const fileInputRef = useRef(null);
  const store = useSelector(state => state.news);
  const dispatch = useDispatch();

  useEffect(() => {
    getNewsId(store?.selectNewsData).then((response) => {
      if (response?.status === 200) {
        setTitle(response?.data?.news?.title);
        setText(response?.data?.news?.description);
        setLogoHeader(`${server}/${response?.data?.news?.img}`);
      }
    });
  }, []);

  //! Обработчик выбора файла
  const handleFileChange = (file) => {
    if (file) {
      setFile(file); // Создаем URL для отображения изображения
      setError((prevError) => ({ ...prevError, file: "" })); // Сбрасываем ошибку файла
    } else {
      setFile(null);
      setLogoHeader(null);
    }
  };

  // Функция для валидации формы
  const validateForm = () => {
    let isValid = true;
    const newError = { title: "", text: "", file: "" };

    if (!title) {
      newError.title = "Заголовок новости не может быть пустым.";
      isValid = false;
    }

    if (!text) {
      newError.text = "Текст новости не может быть пустым.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const saveData = () => {
    if (!validateForm()) return; // Проверка на ошибки

    const data = {
      title: title,
      description: text,
    };

    createNews(data).then((res) => {
      if (res?.status === 200 || res?.status === 201 && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("newsId", res?.data?.news.id);
        uploadPhoto(formData, "NEWS").then((res) => {
          if (res?.status === 200) {
            props?.updateNewsData();
            dispatch(setSelectNewsData({ id: null }));
          }
        });
      } else {
        props?.updateNewsData();
      }
    });
    props?.closeAddNews();
  };

  const deleteData = (id) => {
    deleteNews(id).then((res) => {
      if (res?.status === 200) {
        props?.closeAddNews();
        props?.updateNewsData();
        dispatch(setSelectNewsData({ id: null }));
      }
    });
  };

  const saveEditData = (id) => {
    if (!validateForm()) return; // Проверка на ошибки

    const data = {
      title: title,
      description: text,
    };

    updateNews(id, data).then((res) => {
      if (res?.status === 200) {
        dispatch(setSelectNewsData({ id: null }));
        props?.updateNewsData();
        props?.closeAddNews();
      }
    });
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("newsId", id);
      uploadPhoto(formData, "NEWS").then((res) => {
        if (res?.status === 200) {
          props?.updateNewsData();
          props?.closeAddNews();
        }
      });
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setError((prevError) => ({ ...prevError, title: "" })); // Очищаем ошибку при изменении
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value) {
      setError((prevError) => ({ ...prevError, text: "" })); // Очищаем ошибку при изменении
    }
  };

  return (
    <section className={styles.AddNews}>
      <button className={styles.buttonBack} onClick={() => { props?.closeAddNews(); dispatch(setSelectNewsData({ id: null })) }}>
        <img src={goBackImg} alt="Назад" /> Добавление новости
      </button>

      <div className={styles.addNewsTextAreaOne}>
        <div className={styles.containerInner}>
          <label>Заголовок новости</label>
            <textarea
              placeholder="Заголовок"
              value={title}
              onChange={handleTitleChange} // Используем обработчик для очищения ошибок
              style={{ borderColor: error.title ? "#B32020" : "" }} // Отображаем ошибку
            />
            {error.title && <div className={styles.error}>{error.title}</div>}
        </div>
      </div>

      <div className={styles.addNewsTextBlockTwo}>
        <div className={styles.containerInner}>
          <label>Текст новости</label>
          <textarea
            placeholder="Текст новости"
            value={text}
            onChange={handleTextChange} // Используем обработчик для очищения ошибок
            style={{ borderColor: error.text ? "#B32020" : "" }} // Отображаем ошибку
          />
          {error.text && <div className={styles.error}>{error.text}</div>}
        </div>
        <div className={styles.addFile}>
          <label>Фотография для новости</label>
          <div className={styles.file_cont}>
            <div className={styles.border_inner} style={{ border: logoHeader ? "none" : "2px dashed #858B89" }}>
              <FileComponent
                logoHeader={logoHeader}
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
          <button className={styles.addNews} onClick={saveData}>Добавить</button>
        </div> :
        <div className={styles.editNewsCont}>
          <div className={styles.editNewsContInner}>
            <button className={styles.deleteNews} onClick={() => deleteData(store?.selectNewsData)}>Удалить <img src={trashRed} /></button>
            <button className={styles.addNews} onClick={() => saveEditData(store?.selectNewsData)}>Сохранить</button>
          </div>
        </div>
      }

    </section>
  );
}

export default AddNews;
