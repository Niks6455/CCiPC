import styles from "./SliderHomePage.module.scss"; // Ваши стили
import { useNavigate } from "react-router-dom";
import { getAllNews } from "../../apirequests/apirequests";
import { useState } from "react";
import { useEffect } from "react";
import noPhoto from "@assets/img/noPhotoNews.svg";


const SliderHomePage = () => {
  const [slides, setSlides] = useState([]);
  useEffect(()=>{
    getAllNews().then((res)=>{
      if(res?.status === 200){
        setSlides(res?.data?.news)
      }
    })
  },[])
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
    console.log(
      "Current slide:",
      currentSlide,
      "Flag:",
      checkPosition(currentSlide)
    );
  }, [currentSlide]);

  const navigate = useNavigate();
  return (
    <div className={styles.SliderHomePage}>
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderWrapper}
          // style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${
                styles[checkPosition(currentSlide)]
              }`}
            >
              <div className={styles.SliderBg}>
                <div className={styles.textContent}>
                  <p
                    className={styles.SliderTitle}
                    dangerouslySetInnerHTML={{
                      __html: slides[currentSlide].title,
                    }}
                  ></p>
                  <p
                    className={styles.SliderText}
                    dangerouslySetInnerHTML={{
                      __html: slides[currentSlide].description,
                    }}
                  ></p>
                </div>
              </div>
              <div className={styles.Sliderimage}>
                {slides[currentSlide].image ? <img src={slides[currentSlide].image} alt={slide.title} /> : <img src={noPhoto}/> }
                <div
                  className={styles.allNews}
                  onClick={() => navigate("/news")}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <div className={styles.controlsInner}>
            <button
              onClick={prevSlide}
              className={`${styles.arrow} ${styles.arrowLeft}`}
            >
              <span></span>
            </button>
            <p>0{currentSlide + 1}</p>
            <button onClick={nextSlide} className={styles.arrow}>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderHomePage;
