import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './AddOrgPeople.module.scss';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import FileComponent from '../FileComponent/FileComponent';
import { createOrgCommitet, uploadPhoto } from '../../../apirequests/apirequests';
import { useSelector } from 'react-redux';
import ImageCropper from '../../ImageCropper/ImageCropper';

function AddOrgPeople(props) {
  const [file, setFile] = useState(null);
  const [fio, setFio] = useState('');
  const [organization, setOrganization] = useState('');
  const [errorFio, setErrorFio] = useState('');
  const [errorOrganization, setErrorOrganization] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [fileUrl, setFileUrl] = useState(null);
  const [editPhoto, setEditPhoto] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );
  }, []);

  const handleFileChange = file => {
    setFile(file);
    setFileUrl(URL.createObjectURL(file));
  };

  const handleTextareaChange = e => {
    setOrganization(e.target.value);
    setErrorOrganization('');
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 145)}px`;
    }
  }, []);

  const createOrg = async () => {
    let valid = true;

    if (fio.trim() === '') {
      setErrorFio('Это обязательное поле');
      valid = false;
    }

    if (organization.trim() === '') {
      setErrorOrganization('Это обязательное поле');
      valid = false;
    }

    if (organization.length > 250) {
      setErrorOrganization('Не более 250 символов');
      valid = false;
    }

    if (fio.length > 250) {
      setErrorFio('Не более 250 символов');
      valid = false;
    }

    if (!valid) return;

    const data = { fio, organization, type: props?.type, conferenceId: conferenceid };

    try {
      const res = await createOrgCommitet(data);
      if (res?.status === 200) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('committeeId', res?.data?.committee[0]?.committeeId);
          const uploadRes = await uploadPhoto(formData, 'COMMITTEE');
          if (uploadRes?.status === 200) {
            props?.getDataOrg();
          }
        }
        props?.closeCreateOne();
        props?.getDataOrg();
        setFio('');
        setOrganization('');
        setFile(null);
      }
    } catch (error) {
      console.error('Ошибка при создании:', error);
    }
  };

  const funEditPhoto = file => {
    if (file) {
      setFile(file);
      setFileUrl(URL.createObjectURL(file));
      setEditPhoto(false);
    }
  };

  return (
    <>
      {file && (
        <ImageCropper
          editPhoto={editPhoto}
          setEditPhoto={setEditPhoto}
          urlPhoto={fileUrl}
          funEditPhoto={funEditPhoto}
          circularCrop={false}
        />
      )}
      <div ref={containerRef} className={styles.AddOrgPeople}>
        <div className={styles.AddOrgPeopleInner}>
          <div className={styles.addFile}>
            <div
              className={styles.file_cont}
              style={{ border: !file ? '2px dashed #C4C4C4' : 'none' }}
              onClick={() => setEditPhoto(true)}
            >
              <div className={styles.border_inner}>
                <FileComponent
                  logoHeader={fileUrl}
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
            <label>ФИО</label>
            <input
              type="text"
              value={fio}
              onChange={e => {
                setFio(e.target.value);
                setErrorFio('');
              }}
              style={{ borderColor: errorFio ? '#B32020' : '' }}
            />
            {errorFio && <span className={styles.error}>{errorFio}</span>}
          </div>

          <div className={styles.AddOrgPeopleInput}>
            <label>Организация</label>
            <textarea
              ref={textareaRef}
              value={organization}
              onChange={handleTextareaChange}
              style={{
                minHeight: '62px',
                maxHeight: '145px',
                overflowY: 'hidden',
                resize: 'none',
                borderColor: errorOrganization ? '#B32020' : '',
              }}
            />
            {errorOrganization && <span className={styles.error}>{errorOrganization}</span>}
          </div>

          <div className={styles.AddOrgPeopleButton}>
            <button className={styles.save} onClick={createOrg}>
              Сохранить
            </button>
            <button className={styles.delete} onClick={props.closeCreateOne}>
              <img src={deletePhotoImg} alt="Удалить" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddOrgPeople;
