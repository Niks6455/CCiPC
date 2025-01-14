import React, { useEffect, useState } from "react";
import styles from "./SliderHomePage.module.scss"; // Ваши стили
import Layout from "../../ui/Layout/Layout";

// Данные для слайдов
const slides = [
  {
    id: 1,
    title: "Конференция открыта!",
    text: `Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще! Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще! <br/><br/> Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще!`,
    image: "/img/img2.svg",
  },
  {
    id: 2,
    title: "Конференция продолжается!",
    text: `Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще! Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще! <br/><br/> Дорогие друзья, конференция открыта! Ждём ваши заявки! Будет интересно, познавательно и впечатляюще!`,
    image: "/img/img1.svg",
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

  const checkPosition = (currentSlide) => {
    return currentSlide % 2 === 0 ? "chet" : "nechet";
  };

  useEffect(() => {
    // Вызываем checkPosition при изменении currentSlide, чтобы иметь возможность отслеживать текущий флаг
    console.log("Current slide:", currentSlide, "Flag:", checkPosition(currentSlide));
  }, [currentSlide]);

  return (
    <div className={styles.SliderHomePage}>
      <div className={styles.sliderContainer}>
      <div
        className={styles.sliderWrapper}
        // style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`${styles.slide} ${styles[checkPosition(currentSlide)]}`}>
            <div className={styles.SliderBg}>
              <div className={styles.textContent}>
                <p className={styles.SliderTitle} dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}></p>
                <p className={styles.SliderText} dangerouslySetInnerHTML={{ __html: slides[currentSlide].text }}></p>
              </div>
            </div>
            <div className={styles.Sliderimage}>
              <img src={slides[currentSlide].image} alt={slide.title} />
              <div className={styles.allNews}></div>
            </div>
          </div>
        ))}
      </div>
        <div className={styles.controls}>
          <button onClick={prevSlide} className={`${styles.arrow} ${styles.arrowLeft}`}><span></span></button>
            <p>0{currentSlide+1}</p>
          <button onClick={nextSlide} className={styles.arrow}><span></span></button>
        </div>
      </div>
    </div>
  );
};

export default SliderHomePage;
