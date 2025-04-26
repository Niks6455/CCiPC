import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CardCollections.module.scss';
import {
  updateArchive,
  deleteArchive,
  uploadPhoto,
  apiDeleteMulti,
} from '../../../../apirequests/apirequests';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import closeIcon from '@assets/img/closeBack.svg';

function CardCollections(props) {
  const fileInputRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const [defaultValue, setDefaultValue] = useState(null);
  const [dataItem, setDataItem] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [deleteIds, setDeleteIds] = useState([]);
  // Убедитесь, что данные обновляются при изменении props.item
  useEffect(() => {
    setDefaultValue({
      name: props?.item?.name || '',
      file: props?.item?.file,
      fileName: props?.item?.file ? props?.item?.file?.name : '',
    });
    setDataItem({
      name: props?.item?.name || '',
      file: props?.item?.file,
      fileName: props?.item?.file ? props?.item?.file?.name : '',
    });
    setErrorText('');
  }, [props.item]);

  // Отслеживаем изменения данных
  useEffect(() => {
    const hasChanged =
      dataItem?.name !== defaultValue?.name || dataItem?.file !== defaultValue?.file;
    setIsChanged(hasChanged);
  }, [dataItem, defaultValue]);

  // Анимация кнопок в зависимости от изменений
  useEffect(() => {
    if (buttonContainerRef.current) {
      gsap.to(buttonContainerRef.current, {
        opacity: isChanged ? 1 : 0,
        height: isChanged ? 'auto' : 0,
        duration: 0.3,
        ease: 'power2.out',
        display: isChanged ? 'flex' : 'none',
      });
    } else {
      gsap.fromTo(
        buttonDeleteRef.current,
        { height: 0 },
        { height: '52px', duration: 0.3, ease: 'power2.out' },
      );
    }
  }, [isChanged]);

  const handleEditData = (value, key) => {
    setDataItem(prev => ({ ...prev, [key]: value }));
    if (key === 'name' && value !== '') {
      setErrorText('');
    }
  };

  const handleFileUpload = event => {
    const file = event?.target?.files[0];
    console.log('file', file);
    if (file) {
      setDataItem(prev => ({ ...prev, file: file, fileName: file?.name }));
    }
  };

  const handleDeleteFile = () => {
    apiDeleteMulti({ ids: [dataItem?.file?.id] }).then(res => {
      if (res?.status === 200) {
        setDataItem(prev => ({ ...prev, file: null, fileName: '' }));
        fileInputRef.current.value = null;
        props.updateData();
      }
    });
  };

  const handleCancel = () => {
    setDataItem(defaultValue);
    setErrorText('');
  };

  const handleSave = async () => {
    if (!dataItem.name) {
      setErrorText('Это обязательное поле');
      return;
    }

    const data = { name: dataItem.name, type: 1 };

    try {
      const res = await updateArchive(data, props.item.id);
      if (res?.status === 200) {
        if (dataItem?.file) {
          const formData = new FormData();
          formData.append('file', dataItem.file);
          formData.append('archiveId', props.item.id);
          await uploadPhoto(formData, 'COLLECTION_ARCHIVE');
        }
        if (deleteIds.length > 0) {
          apiDeleteMulti({ ids: deleteIds });
        }
        props.updateData();
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  const handleDelete = () => {
    deleteArchive(props.item.id).then(res => {
      if (res?.status === 200) {
        props.updateData();
      }
    });
    setIsChanged(true);
  };

  const spliseFileName = () => {
    const name = dataItem?.fileName;
    if (name && name.length > 30) {
      const extension = name.split('.').pop();
      return name.slice(0, 30) + '...' + extension;
    }
    return name;
  };

  return (
    <div className={styles.CardCollections} key={props.item.id}>
      <div className={styles.boxContainer}>
        <label>Название</label>
        <textarea
          value={dataItem?.name}
          onChange={e => handleEditData(e.target.value, 'name')}
          style={{ borderColor: errorText ? '#B32020' : '' }}
        />
        {errorText && <div className={styles.error}>{errorText}</div>}
      </div>
      <div className={styles.boxContainer}>
        <label>Файл сборника</label>
        {dataItem?.file || dataItem?.fileName ? (
          <div className={styles.fileDisplay}>
            <div className={styles.fileDisplayInner}>
              <span>{spliseFileName()}</span>
              <img
                src={closeIcon}
                alt="Удалить файл"
                className={styles.closeIcon}
                onClick={handleDeleteFile}
              />
            </div>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current.click()} style={{ color: '#b32020' }}>
            Загрузите PDF-файл
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".pdf"
        />
      </div>
      {isChanged ? (
        <div className={styles.buttonContainer} ref={buttonContainerRef}>
          <button className={styles.cancel} onClick={handleCancel}>
            Отмена
          </button>
          <button className={styles.save} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      ) : (
        <button className={styles.delete} onClick={handleDelete} ref={buttonDeleteRef}>
          Удалить <img src={deletePhotoImg} alt="Удалить" />
        </button>
      )}
    </div>
  );
}

export default CardCollections;
