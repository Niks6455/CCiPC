import React, { useEffect, useState } from 'react';
import styles from './ArchivPhoto.module.scss';
import linkArrow from '../../assets/img/linkArrow.png';
import { getAllArchivePhoto } from '../../apirequests/apirequests';
import noPhoto from '@assets/img/noPhoto.png';
import { server } from '../../apirequests/apirequests';
const ArchivPhoto = () => {
  const [showTooltip, setShowTooltip] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  const [dataAlbom, setDataAlbom] = useState([]);

  useEffect(() => {
    getAllArchivePhoto().then(resp => {
      setDataAlbom(resp?.data?.archives || []);
    });
  }, []);

  const handleMouseEnter = index => {
    const timeout = setTimeout(() => {
      setShowTooltip(index);
    }, 300);
    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout);
    setShowTooltip(null);
  };

  const handleMouseMove = event => {
    setCoordinates({ x: event.clientX, y: event.clientY });
  };

  return (
    <section className={styles.photoGrid}>
      {dataAlbom.map((photo, index) => (
        <a
          key={photo.id || index}
          href={photo.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className={styles.photoItem}>
            <img
              src={photo?.file?.url && server ? `${server}/${photo?.file?.url}` : noPhoto}
              alt={photo.name}
              className={styles.photo}
            />
            <div className={styles.photoTitleWrapper}>
              <p className={styles.photoTitle}>{photo.name}</p>
            </div>
            <img src={linkArrow} className={styles.linkArrow} alt="Arrow" />
          </div>

          {index === showTooltip && (
            <div
              style={{
                left: coordinates.x - 150,
                top: coordinates.y + 10,
              }}
              className={styles.repName}
            >
              Перейти в альбом
            </div>
          )}
        </a>
      ))}
    </section>
  );
};

export default ArchivPhoto;
