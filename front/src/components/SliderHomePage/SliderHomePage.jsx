import React, { useState } from "react";
import styles from "./SliderHomePage.module.scss"; // Ваши стили

// Данные для слайдов
const slides = [
  {
    id: 1,
    title: "Конференция открыта!",
    text: "Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще!",
    image: "/img/img1.svg",
  },
  {
    id: 2,
    title: "Конференция продолжается!",
    text: "Подробности в наших новостях. Не пропустите ключевые моменты и интересные выступления.",
    image: "/img/img2.svg",
  },
];

const SliderHomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
  
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
  
    return (
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderWrapper}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className={styles.slide}>
            <div className={styles.SliderBg}></div>
              <div className={styles.textContent}>
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
              </div>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <button onClick={prevSlide} className={styles.arrow}>
            ←
          </button>
          <button onClick={nextSlide} className={styles.arrow}>
            →
          </button>
        </div>
      </div>
    );
  };

export default SliderHomePage;
