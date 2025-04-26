import styles from './AddNews.module.scss';
import goBackImg from '@assets/img/AdminPanel/goBack.svg';
import { useEffect, useRef, useState } from 'react';
import {
  createNews,
  deleteNews,
  getNewsId,
  server,
  updateNews,
  uploadPhoto,
} from '../../../../apirequests/apirequests';
import FileComponent from '../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { useDispatch, useSelector } from 'react-redux';
import trashRed from '@assets/img/AdminPanel/delete.svg';
import { setSelectNewsData } from '../../../../store/newsSlice/newsSlice';
import ImageCropper from '../../../../components/ImageCropper/ImageCropper';
import ErrorModal from '../../../../components/ErrorModal/ErrorModal';

function AddNews(props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [logoHeader, setLogoHeader] = useState(null);
  const [error, setError] = useState({ title: '', text: '', file: '' }); // Ошибки
  const store = useSelector(state => state.news);
  const dispatch = useDispatch();
  const [errorModal, setErrorModal] = useState(false);

  const [origPhoto, setOrigPhoto] = useState(null);
  const [editPhoto, setEditPhoto] = useState(false);

  useEffect(() => {
    getNewsId(store?.selectNewsData).then(response => {
      if (response?.status === 200) {
        setTitle(response?.data?.news?.title);
        setText(response?.data?.news?.description);
        setLogoHeader(`${server}/${response?.data?.news?.img?.url}`);
      }
    });
  }, []);

  //! Обработчик выбора файла
  const handleFileChange = file => {
    if (file) {
      setFile(file);
      setLogoHeader(URL.createObjectURL(file));
      setEditPhoto(true);
      setError(prevError => ({ ...prevError, file: '' }));
    } else {
      setFile(null);
      setLogoHeader(null);
    }
  };

  // Функция для валидации формы
  const validateForm = () => {
    let isValid = true;
    const newError = { title: '', text: '', file: '' };

    if (!title) {
      newError.title = 'Заголовок новости не может быть пустым.';
      isValid = false;
    }

    if (!text) {
      newError.text = 'Текст новости не может быть пустым.';
      isValid = false;
    }

    if (title.length < 2) {
      newError.title = 'Не менее двух символов.';
      isValid = false;
    }

    if (text.length < 2) {
      newError.text = 'Не менее двух символов.';
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

    createNews(data).then(res => {
      if (res?.status === 200 || (res?.status === 201 && file)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('newsId', res?.data?.news.id);
        uploadPhoto(formData, 'NEWS').then(res => {
          if (res?.status === 200) {
            props?.updateNewsData();
            dispatch(setSelectNewsData({ id: null }));
          }
        });
        props?.closeAddNews();
        props?.updateNewsData();
      } else {
        // props?.updateNewsData();
        if (res?.response?.data?.message === 'title entity already exists') {
          setErrorModal('Новость с таким заголовком уже существует!');
          return;
        }
        setErrorModal('Ошибка при создании новости');
      }
    });
  };

  const deleteData = id => {
    deleteNews(id).then(res => {
      if (res?.status === 200) {
        props?.closeAddNews();
        props?.updateNewsData();
        dispatch(setSelectNewsData({ id: null }));
      }
    });
  };

  const saveEditData = id => {
    if (!validateForm()) return; // Проверка на ошибки

    const data = {
      title: title,
      description: text,
    };

    updateNews(id, data).then(res => {
      if (res?.status === 200) {
        dispatch(setSelectNewsData({ id: null }));
        props?.updateNewsData();
        props?.closeAddNews();
      }
    });
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('newsId', id);
      uploadPhoto(formData, 'NEWS').then(res => {
        if (res?.status === 200) {
          props?.updateNewsData();
          props?.closeAddNews();
        }
      });
    }
  };

  const handleTitleChange = e => {
    const value = e.target.value.slice(0, 100); // Ограничение в 100 символов
    setTitle(value);
    if (value) {
      setError(prevError => ({ ...prevError, title: '' }));
    }
  };

  const handleTextChange = e => {
    const value = e.target.value.slice(0, 750); // Ограничение в 750 символов
    setText(value);
    if (value) {
      setError(prevError => ({ ...prevError, text: '' }));
    }
  };

  const funEditPhoto = file => {
    if (file) {
      setFile(file);
      setLogoHeader(URL.createObjectURL(file));
      setEditPhoto(false);
    }
  };

  return (
    <>
      <ErrorModal title={errorModal} open={errorModal} close={() => setErrorModal(null)} />
      <section className={styles.AddNews}>
        <ImageCropper
          editPhoto={editPhoto}
          setEditPhoto={setEditPhoto}
          urlPhoto={origPhoto ? URL.createObjectURL(origPhoto) : logoHeader}
          funEditPhoto={funEditPhoto}
          aspect={16 / 9}
          circularCrop={false}
          width={160}
          height={90}
        />
        <button
          className={styles.buttonBack}
          onClick={() => {
            props?.closeAddNews();
            dispatch(setSelectNewsData({ id: null }));
          }}
        >
          <img src={goBackImg} alt="Назад" /> Добавление новости
        </button>

        <div className={styles.addNewsTextAreaOne}>
          <div className={styles.containerInner}>
            <label>Заголовок новости</label>
            <textarea
              placeholder="Заголовок"
              value={title}
              onChange={handleTitleChange}
              style={{ borderColor: error.title ? '#B32020' : '' }}
              maxLength={100}
            />
            {error.title && <div className={styles.error}>{error.title}</div>}
            <div className={styles.counter}>{title.length}/100</div>
          </div>
        </div>

        <div className={styles.addNewsTextBlockTwo}>
          <div className={styles.containerInner}>
            <label>Текст новости</label>
            <textarea
              placeholder="Текст новости"
              value={text}
              onChange={handleTextChange}
              style={{ borderColor: error.text ? '#B32020' : '' }}
              maxLength={750}
            />
            {error.text && <div className={styles.error}>{error.text}</div>}
            <div className={styles.counter}>{text.length}/750</div>
          </div>

          <div className={styles.addFile}>
            <label>Фотография для новости</label>
            <div className={styles.file_cont}>
              <div
                className={styles.border_inner}
                style={{ border: logoHeader ? 'none' : '2px dashed #858B89' }}
              >
                <FileComponent
                  logoHeader={logoHeader}
                  data={file}
                  setData={handleFileChange}
                  typeFile={['image/png', 'image/jpg', 'image/jpeg']}
                  accept={'.png,.jpg'}
                  name={'pngNews'}
                  icon={'png'}
                  text={'Необходимо загрузить<br/> фотографию в формате JPG, PNG'}
                  fileSize={10}
                />
              </div>
            </div>
          </div>
        </div>

        {store?.selectNewsData === null ? (
          <div className={styles.addNewsCont}>
            <button className={styles.addNews} onClick={saveData}>
              Добавить
            </button>
          </div>
        ) : (
          <div className={styles.editNewsCont}>
            <div className={styles.editNewsContInner}>
              <button
                className={styles.deleteNews}
                onClick={() => deleteData(store?.selectNewsData)}
              >
                Удалить <img src={trashRed} />
              </button>
              <button
                className={styles.addNews}
                onClick={() => saveEditData(store?.selectNewsData)}
              >
                Сохранить
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default AddNews;
