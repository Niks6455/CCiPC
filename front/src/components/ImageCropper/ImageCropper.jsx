import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './ImageCropper.module.scss';
import { useTranslation } from 'react-i18next';

const ImageCropper = ({
  editPhoto,
  setEditPhoto,
  urlPhoto,
  funEditPhoto,
  aspect = 1,
  circularCrop = true,
  width = 100,
  height = 100,
}) => {
  const { i18n } = useTranslation();
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [crop, setCrop] = useState({
    unit: 'px',
    x: 25,
    y: 25,
    width: width,
    height: height,
  });

  const getCroppedImg = () => {
    const image = imgRef.current;
    const cropData = crop;

    if (!cropData || !image) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = cropData.width * scaleX; // Учитываем масштаб
    canvas.height = cropData.height * scaleY; // Учитываем масштаб

    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high'; // Повышаем качество интерполяции

    ctx.drawImage(
      image,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width * scaleX,
      cropData.height * scaleY,
    );

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `${new Date().getTime()}cropped.png`, {
          type: 'image/png',
        });
        funEditPhoto(file);
        setEditPhoto(false);
      }
    }, 'image/png');
  };

  return (
    <>
      {editPhoto && (
        <div className={styles.ImageCropper}>
          <div className={styles.editPhoto}>
            <div className={styles.container}>
              <h2>{i18n?.language === 'en' ? 'Edit photo' : 'Редактирование фото'}</h2>
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                aspect={aspect}
                circularCrop={circularCrop}
              >
                <img ref={imgRef} src={urlPhoto} alt="Source" />
              </ReactCrop>
              <button onClick={getCroppedImg}>
                {i18n?.language === 'en' ? 'Save' : 'Сохранить'}
              </button>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCropper;
