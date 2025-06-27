import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Card.module.scss';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import {
  apiDeleteOrganizersPartners,
  apiUpdateOrganizersPartners,
  server,
  uploadPhoto,
} from '../../../../apirequests/apirequests';
import editPhoto2Img from '@assets/img/AdminPanel/editPhoto.svg';

function Card({ item, type, getDataOrg, filesUrls, setFilesUrls, validate }) {
  const textareasRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const cardRef = useRef(null);
  const fileRef = useRef(null);
  const refFile = useRef(null);
  const [dataItem, setDataItem] = useState({
    file: item?.file || '',
    number: item?.number || '',
    url: item?.url || '',
  });
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({ file: '', url: '', number: '' });
  const [fileUrl, setFileUrl] = useState(null);

  const funSetErrors = (key, value) => {
    setErrors(prev => ({ ...prev, [key]: value }));
  };

  const funSetDataItem = (key, value) => setDataItem(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    setDataItem({
      file: item?.file || '',
      number: item?.number || '',
      url: item?.url || '',
    });
    // setErrors({ file: '', url: '', number: '' });
    setFileUrl(null);
  }, [item]);

  useEffect(() => {
    setIsChanged(
      dataItem.number !== item?.number ||
        dataItem.file !== item?.file ||
        dataItem?.url !== item?.url,
    );
  }, [dataItem, item]);

  //! Анимация появления карточки
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );

    gsap.fromTo(
      fileRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 },
    );
  }, []);

  //! Анимация появления кнопок "Отменить" и "Сохранить"
  useEffect(() => {
    if (buttonContainerRef.current) {
      const file = filesUrls?.find(it => it.id === item.committeeId);
      gsap.to(buttonContainerRef.current, {
        opacity: isChanged || file ? 1 : 0,
        height: isChanged || file ? 'auto' : 0,
        duration: 0.3,
        ease: 'power2.out',
        display: isChanged || file ? 'flex' : 'none',
      });
    } else {
      gsap.fromTo(
        buttonDeleteRef.current,
        { height: 0 },
        { height: '52px', duration: 0.3, ease: 'power2.out' },
      );
    }
  }, [isChanged, filesUrls?.find(it => it.id === item.committeeId)]);

  const handleEditData = (value, key) => {
    setDataItem(prev => ({ ...prev, [key]: value }));
    if (key === 'number') funSetErrors('number', '');
    if (key === 'url') funSetErrors('url', '');
  };

  const handleCancel = () => {
    setFileUrl(null);
    setErrors({ file: '', url: '', number: '' });
    setDataItem({
      file: item?.file || '',
      number: item?.number || '',
      url: item?.url || '',
    });
    let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
    setFilesUrls(fiurl);
    refFile.current.value = null;
  };

  const handleDelete = () => {
    apiDeleteOrganizersPartners(item.id).then(res => {
      if (res?.status === 200) {
        getDataOrg();
      }
    });
  };

  const changeFileData = e => {
    const file = e.target.files[0];
    if (file) {
      setIsChanged(true);
      funSetDataItem('file', file);
      setFileUrl(URL.createObjectURL(file));
    }
  };
  const funUpdateData = data => {
    const { valid, errors } = validate(data);
    setErrors(errors);

    const formData = {
      url: data?.url,
      index: Number(data?.number),
      type: type === 'organizers' ? 0 : 1,
    };
    apiUpdateOrganizersPartners(formData, item?.id).then(res => {
      if (res?.status === 200) {
        if (dataItem?.file !== item?.file) {
          const fileData = new FormData();
          fileData.append('file', dataItem?.file);
          fileData.append('collaboratorId', item?.id);
          uploadPhoto(fileData, 'COLLABORATOR').then(res => {
            if (res?.status === 200) {
              getDataOrg();
            }
          });
        } else {
          getDataOrg();
        }
      } else {
        if (res?.response?.data?.message === 'url parameter is invalid') {
          setErrors(prev => ({ ...prev, url: 'Некорректная ссылка' }));
        }
      }
    });
    if (!valid) return;
  };

  return (
    <>
      <div ref={cardRef} className={styles.Card}>
        <div className={styles.CardOrganizationInner}>
          <div className={styles.CardOrganizationInnerImg} onClick={() => refFile.current.click()}>
            <img
              ref={fileRef}
              className={styles.Img}
              src={fileUrl ? fileUrl : `${server}/${dataItem?.file}`}
              alt={dataItem?.number}
            />
            <div className={styles.CardOrganizationInnerImgInput}>
              <img
                src={editPhoto2Img}
                alt="Редактирование"
                onClick={() => refFile.current.click()}
              />
            </div>
            <input
              ref={refFile}
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={e => changeFileData(e)}
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>Порядковый номер</label>
            <input
              value={dataItem?.number}
              onChange={e => handleEditData(e.target.value, 'number')}
              style={{ borderColor: errors?.number ? '#B32020' : '' }}
              type="number"
            />
            {errors?.number && <span className={styles.error}>{errors?.number}</span>}
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>Ссылка</label>
            <textarea
              ref={textareasRef}
              value={dataItem?.url}
              onChange={e => handleEditData(e.target.value, 'url')}
              style={{ borderColor: errors?.url ? '#B32020' : '' }}
            />
            {errors?.url && <span className={styles.error}>{errors?.url}</span>}
          </div>

          {isChanged ? (
            <div className={styles.buttonContainer} ref={buttonContainerRef}>
              <button className={styles.cancel} onClick={handleCancel}>
                Отмена
              </button>
              <button className={styles.save} onClick={() => funUpdateData(dataItem)}>
                Сохранить
              </button>
            </div>
          ) : (
            <button className={styles.delete} onClick={handleDelete} ref={buttonDeleteRef}>
              Удалить <file src={deletePhotoImg} alt="Удалить" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
