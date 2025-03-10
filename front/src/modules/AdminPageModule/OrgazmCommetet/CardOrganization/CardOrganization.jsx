import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CardOrganization.module.scss';
import notPhoto from '@assets/img/notPhoto.svg';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import {
  deleteOrgCommitet,
  server,
  updateOrgCommitet,
  uploadPhoto,
} from '../../../../apirequests/apirequests';
import deletePhoto2Img from '@assets/img/AdminPanel/deletePhoto.svg';
import editPhoto2Img from '@assets/img/AdminPanel/editPhoto.svg';

function CardOrganization(props) {
  const textareasRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  const defaultValue = {
    img: props?.item?.img || '',
    fio: props?.item?.fio || '',
    organization: props?.item?.organization || '',
  };
  const [file, setFile] = useState(null);
  const refFile = useRef(null);
  const [dataItem, setDataItem] = useState(defaultValue);
  const [isChanged, setIsChanged] = useState(false);

  // Проверка изменений
  useEffect(() => {
    const hasChanged =
      dataItem.fio !== defaultValue.fio ||
      dataItem.organization !== defaultValue.organization ||
      dataItem.img !== defaultValue.img;
    setIsChanged(hasChanged);
  }, [dataItem, defaultValue]);

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

    if (key === 'organization' && textareasRef.current) {
      textareasRef.current.style.height = 'auto';
      textareasRef.current.style.height = `${Math.min(textareasRef.current.scrollHeight, 145)}px`;
    }
  };

  const handleCancel = () => setDataItem(defaultValue);
  const handleSave = () => {
    updateOrgCommitet(dataItem, props.item.id).then(res => {
      if (res?.status === 200) {
        props?.getDataOrg();
      }
    });
  };
  const handleDelete = () => {
    deleteOrgCommitet(props.item.id).then(res => {
      if (res?.status === 200) {
        props?.getDataOrg();
      }
    });
  };

  const changeFileData = e => {
    const file = e.target.files[0];
    setFile(file);
    const formFile = new FormData();
    formFile.append('file', file);
    formFile.append('committeeId', props?.item?.committeeId);
    uploadPhoto(formFile, 'COMMITTEE').then(res => {
      if (res?.status === 200) {
        props?.getDataOrg();
      }
    });
  };

  return (
    <div ref={cardRef} className={styles.CardOrganization}>
      <div className={styles.CardOrganizationInner}>
        <div className={styles.CardOrganizationInnerImg}>
          <img
            ref={imgRef}
            className={styles.Img}
            src={dataItem.img ? `${server}/${dataItem.img}` : notPhoto}
            alt={dataItem.fio}
          />
          <div className={styles.CardOrganizationInnerImgInput}>
            <img src={deletePhoto2Img} alt="Удалить" />
            <img src={editPhoto2Img} alt="Редактирование" onClick={() => refFile.current.click()} />
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
          <input value={dataItem.fio} onChange={e => handleEditData(e.target.value, 'fio')} />
        </div>

        <div className={styles.CardOrganizationInnerInfo}>
          <label>Организация</label>
          <textarea
            ref={textareasRef}
            value={dataItem.organization}
            onChange={e => handleEditData(e.target.value, 'organization')}
          />
        </div>

        {/* Если есть изменения → Отменить и Сохранить, иначе → Удалить */}
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
  );
}

export default CardOrganization;
