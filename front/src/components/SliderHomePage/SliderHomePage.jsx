import styles from './SliderHomePage.module.scss'; // Ваши стили
import { useNavigate } from 'react-router-dom';
import { getAllNews, server } from '../../apirequests/apirequests';
import { useState } from 'react';
import { useEffect } from 'react';
import noPhoto from '@assets/img/noPhoto.png';
import { useTranslation } from 'react-i18next';
import newsArrIcon from '@assets/img/UI/newsArr.svg';

const SliderHomePage = () => {
  const { t } = useTranslation('homePage');
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    getAllNews().then(res => {
      if (res?.status === 200) {
        setSlides(res?.data?.news?.splice(0, 5));
      }
    });
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const checkPosition = currentSlide => {
    return currentSlide % 2 === 0 ? 'chet' : 'nechet';
  };

  const getTitle = title => {
    if (title.length > 50) {
      return title.substring(0, 50) + '...';
    } else {
      return title;
    }
  };

  const getDescriptions = desc => {
    if (desc.length > 550) {
      return desc.substring(0, 550) + '...';
    } else {
      return desc;
    }
  };

  const navigate = useNavigate();
  return (
    <div className={styles.SliderHomePage}>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderWrapper}>
          {slides?.map(slide => (
            <div
              key={slide.id}
              className={`${styles.slide} ${styles[checkPosition(currentSlide)]}`}
            >
              <div className={styles.SliderBg}>
                <div className={styles.textContent}>
                  <p
                    className={styles.SliderTitle}
                    dangerouslySetInnerHTML={{
                      __html: getTitle(slides[currentSlide].title),
                    }}
                  ></p>
                  <p
                    className={styles.SliderText}
                    dangerouslySetInnerHTML={{
                      __html: getDescriptions(slides[currentSlide].description),
                    }}
                  ></p>
                </div>
              </div>
              <div className={styles.Sliderimage}>
                <img
                  className={styles.SliderImageInner}
                  src={
                    slides[currentSlide].img?.url
                      ? ` ${server}/${slides[currentSlide].img?.url}`
                      : noPhoto
                  }
                  alt={slide.title}
                />
                {/* <div className={styles.allNews} onClick={() => navigate('/news')}></div> */}
                <button className={styles.allNews} onClick={() => navigate('/news')}>
                  <span>{t('par34')}</span>
                  <img src={newsArrIcon} alt="img" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {slides?.length > 1 && (
          <div className={styles.controls}>
            <div className={styles.controlsInner}>
              <button onClick={prevSlide} className={`${styles.arrow} ${styles.arrowLeft}`}>
                <span></span>
              </button>
              <p>0{currentSlide + 1}</p>
              <button onClick={nextSlide} className={styles.arrow}>
                <span></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderHomePage;
