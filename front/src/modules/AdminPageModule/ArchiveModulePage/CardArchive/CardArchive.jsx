import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CardArchive.module.scss';
import notPhoto from '@assets/img/noPhotoNews.svg';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import deletePhoto2Img from '@assets/img/AdminPanel/deletePhoto.svg';
import editPhoto2Img from '@assets/img/AdminPanel/editPhoto.svg';
import {
  apiDeleteMulti,
  deleteArchive,
  updateArchive,
  uploadPhoto,
} from '../../../../apirequests/apirequests';
import { server } from '../../../../apirequests/apirequests';
import ImageCropper from '../../../../components/ImageCropper/ImageCropper';

function CardArchive({ item, updateData }) {
  const textareasRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const refFile = useRef(null);
  const [editPhoto, setEditPhoto] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  const [dataItem, setDataItem] = useState({
    file: item?.file || null,
    name: item?.name || '',
    url: item?.url || '',
  });
  const [isChanged, setIsChanged] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [errorUrl, setErrorUrl] = useState('');

  useEffect(() => {
    setDataItem({
      file: item?.file || null,
      name: item?.name || '',
      url: item?.url || '',
    });
    setErrorName('');
    setErrorUrl('');
  }, [item]);

  useEffect(() => {
    console.log('dataItem', dataItem);
    setIsChanged(
      dataItem.name !== item?.name ||
        dataItem.url !== item?.url ||
        dataItem?.file?.id !== item?.file?.id ||
        '',
    );
  }, [dataItem, item]);

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

    // Сбрасываем ошибку при изменении значения в поле
    if (key === 'name' && errorName) {
      setErrorName('');
    }
    if (key === 'url' && errorUrl) {
      setErrorUrl('');
    }
  };

  const handleCancel = () => {
    setErrorName('');
    setErrorUrl('');
    setDataItem({
      file: item?.file || '',
      name: item?.name || '',
      url: item?.url || '',
    });
  };

  const validateFields = () => {
    let valid = true;
    if (!dataItem.name) {
      setErrorName('Это обязательное поле*');
      valid = false;
    } else {
      setErrorName('');
    }

    if (!dataItem.url) {
      setErrorUrl('Это обязательное поле*');
      valid = false;
    } else {
      setErrorUrl('');
    }

    if (dataItem.name.length > 250) {
      setErrorName('Не более 250 символов*');
      valid = false;
    }

    if (dataItem.url.length > 250) {
      setErrorUrl('Не более 250 символов*');
      valid = false;
    }

    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      updateArchive({ ...dataItem, type: 0 }, item.id).then(res => {
        if (res?.status === 200) updateData();
      });
    }
  };

  const handleDelete = () => {
    deleteArchive(item.id).then(res => {
      if (res?.status === 200) updateData();
    });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setEditPhoto(true);
      setFile(file);
      setUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImg = item => {
    console.log('data?.file?.id', item?.file?.id);
    apiDeleteMulti({ ids: [item?.file?.id] }).then(res => {
      if (res?.status === 200) updateData();
    });
  };

  const funEditPhoto = file => {
    if (file) {
      setEditPhoto(false);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('archiveId', item?.id);

      uploadPhoto(formData, 'PHOTO_ARCHIVE').then(res => {
        if (res?.status === 200) {
          setDataItem(prev => ({ ...prev, file: res.data.file }));
          refFile.current.value = null;
          updateData();
          setFile(null);
          setUrl(null);
        }
      });
    }
  };

  return (
    <>
      <ImageCropper
        editPhoto={editPhoto}
        setEditPhoto={setEditPhoto}
        urlPhoto={url}
        funEditPhoto={funEditPhoto}
        circularCrop={false}
      />

      <div className={styles.CardOrganization} key={item.id}>
        <div className={styles.CardOrganizationInner}>
          <div className={styles.CardOrganizationInnerImg}>
            <img
              className={styles.Img}
              src={url ? url : dataItem?.file?.url ? `${server}/${dataItem?.file?.url}` : notPhoto}
              alt="Фото"
            />
            <div className={styles.CardOrganizationInnerImgInput}>
              <img src={deletePhoto2Img} onClick={() => handleDeleteImg(item)} alt="Удалить" />
              <img
                src={editPhoto2Img}
                alt="Редактировать"
                onClick={() => {
                  refFile.current.click();
                }}
              />
            </div>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={refFile}
              onChange={handleFileChange}
            />
          </div>
          <div className={styles.CardOrganizationInnerInfo}>
            <label>Название альбома</label>
            <input
              value={dataItem.name}
              onChange={e => handleEditData(e.target.value, 'name')}
              style={{ borderColor: errorName ? '#B32020' : '' }}
            />
            {errorName && <span className={styles.error}>{errorName}</span>}
          </div>
          <div className={styles.CardOrganizationInnerInfo}>
            <label>Ссылка</label>
            <textarea
              ref={textareasRef}
              value={dataItem.url}
              onChange={e => handleEditData(e.target.value, 'url')}
              style={{ borderColor: errorUrl ? '#B32020' : '' }}
            />
            {errorUrl && <span className={styles.error}>{errorUrl}</span>}
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
      </div>
    </>
  );
}

export default CardArchive;
