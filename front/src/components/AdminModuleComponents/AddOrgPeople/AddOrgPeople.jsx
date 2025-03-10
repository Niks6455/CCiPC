import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './AddOrgPeople.module.scss';
import addPhoto from '@assets/img/AdminPanel/addPhoto.svg';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';
import FileComponent from '../FileComponent/FileComponent';
import { createOrgCommitet, uploadPhoto } from '../../../apirequests/apirequests';

function AddOrgPeople(props) {
  const [file, setFile] = useState(null);
  const [fio, setFio] = useState('');
  const [organization, setOrganization] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );
  }, []);

  const createOrg = () => {
    const data = { fio, organization, type: props?.type };

    createOrgCommitet(data).then(res => {
      if (res?.status === 200) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('committeeId', res?.data?.committee[0]?.committeeId);
          uploadPhoto(formData, 'COMMITTEE').then(res => {
            if (res?.status === 200) {
              props?.getDataOrg();
            }
          });
        }
      }
    });
  };

  const handleFileChange = file => setFile(file);

  const handleTextareaChange = e => {
    setOrganization(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 145)}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 145 ? 'auto' : 'hidden';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 145)}px`;
    }
  }, []);

  return (
    <div ref={containerRef} className={styles.AddOrgPeople}>
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
          <label>ФИО</label>
          <input type="text" onChange={e => setFio(e.target.value)} />
        </div>

        <div className={styles.AddOrgPeopleInput}>
          <label>Организация</label>
          <textarea
            ref={textareaRef}
            value={organization}
            onChange={handleTextareaChange}
            style={{ minHeight: '62px', maxHeight: '145px', overflowY: 'hidden', resize: 'none' }}
          />
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
  );
}

export default AddOrgPeople;
