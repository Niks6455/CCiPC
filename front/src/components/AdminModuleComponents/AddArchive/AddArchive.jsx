import styles from './AddArchive.module.scss';
import addPhoto from '@assets/img/AdminPanel/addPhoto.svg';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import FileComponent from '../FileComponent/FileComponent';
import borderIcon from '@assets/img/AdminPanel/borderFile.svg';
import { useEffect, useRef, useState } from 'react';
import { createArchive, uploadPhoto } from '../../../apirequests/apirequests';
import { useSelector } from 'react-redux';

function AddArchive(props) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorUrl, setErrorUrl] = useState('');
  const textareaRef = useRef(null);
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);

  //! Обработчик выбора файла
  const handleFileChange = file => {
    setFile(file);
  };

  //! Автоматическое изменение высоты textarea
  const handleTextareaChange = e => {
    setUrl(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сброс текущей высоты
      const newHeight = Math.min(textareaRef.current.scrollHeight, 87); // Ограничение 150px
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY = newHeight >= 87 ? 'auto' : 'hidden'; // Скролл только при необходимости
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Устанавливает высоту под контент
      const newHeight = Math.min(textareaRef.current.scrollHeight, 87);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  const createOrg = async () => {
    let valid = true;

    // Валидация для поля "Название"
    if (name === '') {
      setErrorName('Это обязательное поле');
      valid = false;
    } else {
      setErrorName('');
    }

    // Валидация для поля "Ссылка"
    if (url === '') {
      setErrorUrl('Это обязательное поле');
      valid = false;
    } else {
      setErrorUrl('');
    }

    if (!valid) return; // Прерывание, если есть ошибки

    const data = {
      name: name,
      url: url,
      type: 0,
      conferenceId: conferenceid,
    };
    console.log('data', data);

    try {
      const resp = await createArchive(data);
      if (resp?.status === 200) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('archiveId', resp?.data?.archive?.id);
          const uploadResp = await uploadPhoto(formData, 'PHOTO_ARCHIVE');
          if (uploadResp?.status === 200) {
            props.updateData();
            props.close();
            setName('');
            setUrl('');
          }
        } else {
          props.updateData();
          props.close();
          setName('');
          setUrl('');
        }
      }
    } catch (error) {
      console.error('Ошибка при создании архива:', error);
    }
  };

  return (
    <div className={styles.AddOrgPeople}>
      <div className={styles.AddOrgPeopleInner}>
        <div className={styles.addFile}>
          <div
            className={styles.file_cont}
            style={{ border: !file ? '2px dashed #C4C4C4' : 'none' }}
          >
            <div className={styles.border_inner}>
              <FileComponent
                data={file}
                setData={handleFileChange}
                typeFile={['image/png', 'image/jpg', 'image/jpeg']}
                accept={'.png,.jpg'}
                name={'pngNews'}
                icon={'png'}
                text={'Нажмите или перетащите</br> изображение для добавления'}
              />
            </div>
          </div>
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Название альбома</label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrorName('');
            }}
            style={{ borderColor: errorName ? '#B32020' : '' }}
          />
          {errorName && <span className={styles.error}>{errorName}</span>}
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Ссылка</label>
          <textarea
            ref={textareaRef}
            value={url}
            onChange={handleTextareaChange}
            style={{
              minHeight: '62px',
              maxHeight: '135px',
              overflowY: 'hidden',
              resize: 'none',
              borderColor: errorUrl ? '#B32020' : '',
            }}
          />
          {errorUrl && <span className={styles.error}>{errorUrl}</span>}
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
