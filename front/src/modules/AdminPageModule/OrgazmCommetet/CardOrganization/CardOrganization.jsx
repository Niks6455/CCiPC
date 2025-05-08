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

function CardOrganization({
  item,
  updateCardData,
  getDataOrg,
  filesUrls,
  setFilesUrls,
  funSetFilesUrls,
}) {
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
    if (key === 'fio') setErrorFio('');
    if (key === 'organization') setErrorOrganization('');

    if (key === 'organization' && textareasRef.current) {
      textareasRef.current.style.height = 'auto';
      textareasRef.current.style.height = `${Math.min(textareasRef.current.scrollHeight, 145)}px`;
    }

    funSetFilesUrls(item.committeeId, { [key]: value });
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
    setFilesUrls(fiurl);
    refFile.current.value = null;
  };

  const validateFields = () => {
    const dat = { ...dataItem, ...filesUrls.find(el => el.id === item.committeeId) };

    let valid = true;
    if (!dat.fio) {
      setErrorFio('Это обязательное поле');
      valid = false;
    }
    if (!dat.organization) {
      setErrorOrganization('Это обязательное поле');
      valid = false;
    }
    if (dat.fio.length > 250) {
      setErrorFio('Не более 250 символов');
      valid = false;
    }

    if (dat.organization.length > 250) {
      setErrorOrganization('Не более 250 символов');
      valid = false;
    }
    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      const dat = { ...dataItem, ...filesUrls.find(el => el.id === item.committeeId) };
      let reqData = {};
      if (dat?.fio) {
        reqData.fio = dat.fio;
      }
      if (dat?.organization) {
        reqData.organization = dat.organization;
      }
      updateOrgCommitet(reqData, item.id).then(res => {
        if (res?.status === 200) {
          getDataOrg();
          const file = filesUrls?.find(it => it.id === item.committeeId)?.file;
          if (file) {
            const formFile = new FormData();
            formFile.append('file', file);
            formFile.append('committeeId', item?.committeeId);
            uploadPhoto(formFile, 'COMMITTEE').then(res => {
              if (res?.status === 200) {
                // Сначала обновляем список файлов
                setFilesUrls(prevFilesUrls => {
                  const updatedFilesUrls = [
                    ...prevFilesUrls.filter(el => el.id !== item.committeeId),
                  ];
                  updateCardData(item.committeeId, res.data.file, dat);
                  return updatedFilesUrls; // Возвращаем обновленный список
                });
                setIsChanged(false);
              }
            });
          } else {
            setIsChanged(false);
            setFilesUrls(prevFilesUrls => {
              const updatedFilesUrls = [...prevFilesUrls.filter(el => el.id !== item.committeeId)];
              return updatedFilesUrls; // Возвращаем обновленный список
            });
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
      setEditPhoto(true);
      funSetFilesUrls(item.committeeId, { url: URL.createObjectURL(file), file: file });

      setIsChanged(true);
    }
  };

  const funEditPhoto = file => {
    if (file) {
      funSetFilesUrls(item.committeeId, { url: URL.createObjectURL(file), file: file });
      setEditPhoto(false);
    }
  };

  const handleDeleteImg = () => {
    let fiurl = filesUrls.filter(el => el.id !== item.committeeId);
    setFilesUrls([...fiurl]);

    apiDeleteMulti({ ids: [item?.img?.id] }).then(res => {
      if (res?.status === 200) {
        updateCardData(item.committeeId, dataItem);
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
              accept="image/png, image/jpg, image/jpeg"
              onChange={e => changeFileData(e)}
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>ФИО</label>
            <input
              value={filesUrls.find(it => it.id === item.committeeId)?.fio || dataItem.fio}
              onChange={e => handleEditData(e.target.value, 'fio')}
              style={{ borderColor: errorFio ? '#B32020' : '' }}
            />
            {errorFio && <span className={styles.error}>{errorFio}</span>}
          </div>

          <div className={styles.CardOrganizationInnerInfo}>
            <label>Организация</label>
            <textarea
              ref={textareasRef}
              value={
                filesUrls.find(it => it.id === item.committeeId)?.organization ||
                dataItem.organization
              }
              onChange={e => handleEditData(e.target.value, 'organization')}
              style={{ borderColor: errorOrganization ? '#B32020' : '' }}
            />
            {errorOrganization && <span className={styles.error}>{errorOrganization}</span>}
          </div>

          {isChanged || filesUrls?.find(it => it.id === item.committeeId) ? (
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
