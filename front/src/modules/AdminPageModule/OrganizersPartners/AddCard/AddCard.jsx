import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './AddCard.module.scss';
import FileComponent from '../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import deletePhotoImg from '@assets/img/AdminPanel/delete.svg';

function AddCard(props) {
  const containerRef = useRef(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );
  }, []);

  const funSetData = (key, value) => {
    props.setData({ ...props.data, [key]: value });
  };

  const funSetErrors = (key, value) => {
    props.setErrors({ ...props.errors, [key]: value });
  };

  const handleFileChange = file => {
    funSetData('file', file);
    funSetErrors('file', '');
    if (file) {
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handleTextareaChange = e => {
    funSetData('url', e.target.value);
    funSetErrors('url', '');
  };

  return (
    <>
      <div ref={containerRef} className={styles.AddCard}>
        <div className={styles.AddCardInner}>
          <div className={styles.addFile}>
            <div
              className={`${styles.file_cont}`}
              style={{
                border: props.errors?.file ? '2px solid #B32020' : 'none',
              }}
            >
              <div
                className={`${styles.border_inner} ${props.data?.file || props.errors?.file ? styles.noborder : ''}`}
              >
                <FileComponent
                  logoHeader={fileUrl}
                  data={props.data?.file}
                  setData={handleFileChange}
                  typeFile={['image/png', 'image/jpg', 'image/jpeg']}
                  accept={'.png,.jpg'}
                  name={props.type}
                  icon={'png'}
                  text={'Нажмите или перетащите</br> изображение для добавления'}
                  errorText={props.errors?.file}
                  fileSize={10}
                />
              </div>
            </div>
          </div>

          <div className={styles.AddCardInput}>
            <label>Порядковый номер</label>
            <input
              type="number"
              value={props.data?.number}
              onChange={e => {
                funSetData('number', e.target.value);
                funSetErrors('number', '');
              }}
              style={{ borderColor: props.errors?.number ? '#B32020' : '' }}
            />
            {props.errors?.number && <span className={styles.error}>{props.errors?.number}</span>}
          </div>

          <div className={styles.AddCardInput}>
            <label>Ссылка</label>
            <textarea
              value={props.data?.url}
              onChange={handleTextareaChange}
              style={{
                minHeight: '62px',
                maxHeight: '145px',
                overflowY: 'hidden',
                resize: 'none',
                borderColor: props.errors?.url ? '#B32020' : '' 
              }}
            />
            {props.errors?.url && <span className={styles.error}>{props.errors?.url}</span>}
          </div>

          <div className={styles.AddCardButton}>
            <button
              className={styles.save}
              onClick={() => props.funSaveData(props.type, props.data)}
            >
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

export default AddCard;
