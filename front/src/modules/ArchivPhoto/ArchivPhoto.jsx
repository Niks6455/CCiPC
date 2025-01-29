import React from "react";
import styles from "./ArchivPhoto.module.scss";
const photos = [
    { src: "/img/Archive/img1.png", title: "2022 XI Конференция ССПС" },
    { src: "/img/Archive/img2.png", title: "2021 X Конференция ССПС" },
    { src: "/img/Archive/img3.png", title: "2019 IX Конференция ССПС" },
    { src: "/img/Archive/img4.png", title: "2019 Экскурсия в Зеленчукскую обсерваторию и РАТАН-600" },
    { src: "/img/Archive/img5.png", title: "2017 VII Конференция ССПС. День 1" },
    { src: "/img/Archive/img6.png", title: "2017 VII Конференция ССПС. День 2" },
    { src: "/img/Archive/img7.png", title: "2017 Историко-архитектурный комплекс" },
    { src: "/img/Archive/img8.png", title: "2017 Экскурсия на БТА" },
    { src: "/img/Archive/img9.png", title: "2017 Поход на гору Пастухова" },
    { src: "/img/Archive/img10.png", title: "2017 Река Б. Зеленчук" }
];

const ArchivPhoto = () => {
    return (
        <section className={styles.photoGrid}>
            {photos.map((photo, index) => (
                <div key={index} className={styles.photoItem}>
                    <img src={photo.src} alt={photo.title} />
                    <div className={styles.photoTitle}>{photo.title}</div>
                </div>
            ))}
        </section>
    );
};

export default ArchivPhoto;
