import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CardOrganization.module.scss';
import notPhoto from '@assets/img/notPhoto.svg';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import {
  apiDeleteMulti,
  deleteOrgCommitet,
  server,
  updateOrgCommitet,
  uploadPhoto,
} from '../../../../apirequests/apirequests';
import deletePhoto2Img from '@assets/img/AdminPanel/deletePhoto.svg';
import editPhoto2Img from '@assets/img/AdminPanel/editPhoto.svg';
import ImageCropper from '../../../../components/ImageCropper/ImageCropper';

function CardOrganization({ item, updateCardData, getDataOrg, filesUrls, setFilesUrls }) {
  const textareasRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const refFile = useRef(null);
  const [dataItem, setDataItem] = useState({
    img: item?.img || '',
    fio: item?.fio || '',
    organization: item?.organization || '',
  });
  const [isChanged, setIsChanged] = useState(false);
  const [errorFio, setErrorFio] = useState('');
  const [errorOrganization, setErrorOrganization] = useState('');
  const [file, setFile] = useState(null);
  const [editPhoto, setEditPhoto] = useState(false);

  useEffect(() => {
    setDataItem({
      img: item?.img || '',
      fio: item?.fio || '',
      organization: item?.organization || '',
    });
    setErrorFio('');
    setErrorOrganization('');
  }, [item]);

  useEffect(() => {
    setIsChanged(
      dataItem.fio !== item?.fio ||
        dataItem.organization !== item?.organization ||
        dataItem?.img?.id !== item?.img?.id,
    );
  }, [dataItem, item]);

  // Анимация появления карточки
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );

    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 },
    );
  }, []);

  // Анимация появления кнопок "Отменить" и "Сохранить"
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
    if (key === 'fio') setErrorFio('');
    if (key === 'organization') setErrorOrganization('');

    if (key === 'organization' && textareasRef.current) {
      textareasRef.current.style.height = 'auto';
      textareasRef.current.style.height = `${Math.min(textareasRef.current.scrollHeight, 145)}px`;
    }
  };

  const handleCancel = () => {
    setErrorFio('');
    setErrorOrganization('');
    setDataItem({
      img: item?.img || '',
      fio: item?.fio || '',
      organization: item?.organization || '',
    });
    // setIsChanged(false);
    // setEditPhoto(false);
    let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
    setFilesUrls([...fiurl, { id: item.committeeId, url: URL.createObjectURL(file) }]);
    setFile(null);
    refFile.current.value = null;
  };

  const validateFields = () => {
    let valid = true;
    if (!dataItem.fio) {
      setErrorFio('Это обязательное поле');
      valid = false;
    }
    if (!dataItem.organization) {
      setErrorOrganization('Это обязательное поле');
      valid = false;
    }
    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      updateOrgCommitet(dataItem, item.id).then(res => {
        if (res?.status === 200) {
          updateCardData(item.id, dataItem);
          getDataOrg();

          if (file) {
            const formFile = new FormData();
            formFile.append('file', file);
            formFile.append('committeeId', item?.committeeId);
            uploadPhoto(formFile, 'COMMITTEE').then(res => {
              if (res?.status === 200) {
                updateCardData(item.id, res.data.file);
                setIsChanged(false);
              }
            });
          } else {
            setIsChanged(false);
          }
        }
      });
    }
  };

  const handleDelete = () => {
    deleteOrgCommitet(item.id).then(res => {
      if (res?.status === 200) {
        getDataOrg();
      }
    });
  };

  const changeFileData = e => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setEditPhoto(true);
      let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
      setFilesUrls([...fiurl, { id: item.committeeId, url: URL.createObjectURL(file) }]);
      setIsChanged(true);
    }
  };

  const funEditPhoto = file => {
    if (file) {
      setFile(file);
      let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
      setFilesUrls([...fiurl, { id: item.committeeId, url: URL.createObjectURL(file) }]);
      setEditPhoto(false);
    }
  };

  const handleDeleteImg = () => {
    let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
    setFilesUrls([...fiurl]);
    setFile(null);

    apiDeleteMulti({ ids: [item?.img?.id] }).then(res => {
      if (res?.status === 200) {
        updateCardData(item.id, dataItem);
        getDataOrg();
        setIsChanged(false);
      }
    });
  };
  return (
    <>
      {filesUrls.find(it => it.id === item.committeeId)?.url && (
        <ImageCropper
          editPhoto={editPhoto}
          setEditPhoto={setEditPhoto}
          urlPhoto={filesUrls.find(it => it.id === item.committeeId)?.url}
          funEditPhoto={funEditPhoto}
          circularCrop={false}
        />
      )}

      <div ref={cardRef} className={styles.CardOrganization}>
        <div className={styles.CardOrganizationInner}>
          <div className={styles.CardOrganizationInnerImg}>
            <img
              ref={imgRef}
              className={styles.Img}
              src={
                filesUrls.find(it => it.id === item.committeeId)?.url
                  ? filesUrls.find(it => it.id === item.committeeId)?.url
                  : dataItem?.img.url
                    ? `${server}/${dataItem?.img.url}`
                    : notPhoto
              }
              alt={dataItem?.fio}
            />
            <div className={styles.CardOrganizationInnerImgInput}>
              <img src={deletePhoto2Img} alt="Удалить" onClick={() => handleDeleteImg()} />
              <img
                src={editPhoto2Img}
                alt="Редактирование"
                onClick={() => refFile.current.click()}
              />
            </div>
            <input
              ref={refFile}
              type="file"
              onChange={e => changeFileData(e)}
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>ФИО</label>
            <input
              value={dataItem.fio}
              onChange={e => handleEditData(e.target.value, 'fio')}
              style={{ borderColor: errorFio ? '#B32020' : '' }}
            />
            {errorFio && <span className={styles.error}>{errorFio}</span>}
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>Организация</label>
            <textarea
              ref={textareasRef}
              value={dataItem.organization}
              onChange={e => handleEditData(e.target.value, 'organization')}
              style={{ borderColor: errorOrganization ? '#B32020' : '' }}
            />
            {errorOrganization && <span className={styles.error}>{errorOrganization}</span>}
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

export default CardOrganization;
