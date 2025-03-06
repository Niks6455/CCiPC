import { useRef, useState } from 'react';
import styles from './AddCollectioonsCard.module.scss';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import { createArchive, uploadPhoto } from '../../../../apirequests/apirequests';
import closeIcon from '@assets/img/closeBack.svg';

function AddCollectioonsCard(props) {
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setFileData(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setFileData(null);
  };

  const createOrg = async () => {
    if (name === '') {
      setErrorText('Это обязательное поле');
      return;
    }
    const data = { name, type: 1 };

    try {
      // Создаем архив
      const resp = await createArchive(data);
      if (resp?.status === 200) {
        // Если файл был выбран, загружаем его
        if (fileData) {
          const formData = new FormData();
          formData.append('file', fileData);
          formData.append('archiveId', resp?.data?.archive?.id);

          const uploadResp = await uploadPhoto(formData, 'COLLECTION_ARCHIVE');
          if (uploadResp?.status === 200) {
            // После загрузки файла обновляем данные
            props.updateData(); // Обновление данных в родительском компоненте
            props.close(); // Закрытие модального окна
          } else {
            console.error('Ошибка загрузки файла');
          }
        } else {
          // Если файл не был выбран, сразу обновляем данные
          props.updateData(); // Обновление данных в родительском компоненте
          props.close(); // Закрытие модального окна
        }
      }
    } catch (error) {
      console.error('Ошибка при создании архива:', error);
    }
  };

  return (
    <div className={styles.AddCollectioonsCard}>
      <div className={styles.AddCollectioonsCardInner}>
        <div className={styles.boxContainer}>
          <label>Название</label>
          <textarea
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrorText('');
            }}
            style={{ borderColor: errorText ? '#B32020' : '' }}
          />
          {errorText && <div className={styles.error}>{errorText}</div>}
        </div>
        <div className={styles.boxContainer}>
          <label>Файл сборника</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className={styles.fileUploadContainer}>
            <button onClick={handleUploadClick} style={{ color: fileData ? '#58B191' : '#b32020' }}>
              {fileData ? fileData.name : 'Загрузите PDF-файл'}
            </button>
            {fileData && (
              <button className={styles.removeFile} onClick={removeFile}>
                <img src={closeIcon} alt="closeIcon" />
              </button>
            )}
          </div>
        </div>
        <div className={styles.AddCollectioonsCardButton}>
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

export default AddCollectioonsCard;
