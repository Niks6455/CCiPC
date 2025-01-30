import React, { useState } from "react";
import styles from "./ArchivPhoto.module.scss";
import linkArrow  from "./../../assets/img/linkArrow.png"
const photos = [
    { src: "/img/Archive/img1.png", title: "2022 XI Конференция ССПС", link:"#"},
    { src: "/img/Archive/img2.png", title: "2021 X Конференция ССПС", link:"#" },
    { src: "/img/Archive/img3.png", title: "2019 IX Конференция ССПС", link:"#" },
    { src: "/img/Archive/img4.png", title: "2019 Экскурсия в Зеленчукскую обсерваторию и РАТАН-600", link:"#" },
    { src: "/img/Archive/img5.png", title: "2017 VII Конференция ССПС. День 1", link:"#" },
    { src: "/img/Archive/img6.png", title: "2017 VII Конференция ССПС. День 2", link:"#" },
    { src: "/img/Archive/img7.png", title: "2017 Историко-архитектурный комплекс", link:"#" },
    { src: "/img/Archive/img8.png", title: "2017 Экскурсия на БТА", link:"#" },
    { src: "/img/Archive/img9.png", title: "2017 Поход на гору Пастухова", link:"#" },
];


const ArchivPhoto = () => {
 //! появление названия
    const [showTooltip, setShowTooltip] = useState(null);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [tooltipTimeout, setTooltipTimeout] = useState(null);

    const handleMouseEnter = (index) => {
    // Устанавливаем таймер для задержки
    const timeout = setTimeout(() => {
        setShowTooltip(index);
    }, 300); // Задержка в 300 мс

    setTooltipTimeout(timeout);
    };

    const handleMouseLeave = () => {
    // Очищаем таймер и скрываем подсказку
    clearTimeout(tooltipTimeout);
    setShowTooltip(null);
    };

    const handleMouseMove = (event) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
    };
    
    return (
        <section className={styles.photoGrid}>
            {photos?.map((photo, index) => (
                <a href={photo?.link} target="_blank"     onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave()}
                onMouseMove={handleMouseMove} key={index}>
                    <div className={styles.photoItem}>
                        <img src={photo?.src} alt={photo?.title} className={styles.photo}/>
                        <div className={styles.photoTitleWrapper}>
                            <p className={styles.photoTitle}>{photo?.title}</p>
                        </div>
                        <img src={linkArrow} className={styles.linkArrow}/>
                    </div>
                 
                  {index === showTooltip && (
                  <div
                    style={{
                      left: coordinates.x - 300,
                      top: coordinates.y - 0,
                    }}
                    className={styles.repName}
                  >Перейти в альбом</div>
                )}
                </a>
                
            ))}
        </section>
    );
};

export default ArchivPhoto;
