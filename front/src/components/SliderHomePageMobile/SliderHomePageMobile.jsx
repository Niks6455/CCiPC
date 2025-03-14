import { useEffect, useRef, useState } from 'react';
import styles from './SliderHomePageMobile.module.scss';
import { getAllNews, server } from '../../apirequests/apirequests';
import { ReactComponent as ArrowIcon } from '@assets/img/UI/SliderDefault.svg';
import { useNavigate } from 'react-router-dom';
import newsArrIcon from '@assets/img/UI/newsArr.svg';
import { ReactComponent as SlideArrowIcon } from '@assets/img/UI/slideArrow.svg';

function SliderHomePageMobile() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const containerRef = useRef(null); // Reference to the scrollable container
  const itemsRef = useRef([]); // References to all team_item elements

  useEffect(() => {
    getAllNews().then(res => {
      if (res?.status === 200) {
        setSlides(res?.data?.news?.splice(0, 5));
      }
    });
  }, []);

  useEffect(() => {
    console.log('slides', slides);
  }, [slides]);

  const scrollToNext = index => {
    if (index < itemsRef.current.length - 1) {
      itemsRef.current[index + 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const scrollToPrevious = index => {
    if (index > 0) {
      itemsRef.current[index - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  return (
    <div className={styles.SliderHomePageMobile} ref={containerRef}>
      <div className={styles.slider}>
        {slides?.map((item, index) => (
          <div key={index} className={styles.slide} ref={el => (itemsRef.current[index] = el)}>
            <h2>{item?.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: item?.description }}
              className={styles.description}
            ></div>
            <div className={styles.image}>
              <div className={styles.navigate}>
                <button onClick={() => scrollToPrevious(index)} name={`${index}button`}>
                  <ArrowIcon />
                </button>
                <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                <button
                  onClick={() => scrollToNext(index)}
                  name={`${index === slides.length - 1}button`}
                >
                  <ArrowIcon />
                </button>
              </div>
              <div className={`${styles.navigate} ${styles.mobile_navigate}`}>
                <button onClick={() => scrollToPrevious(index)} name={`${index}button`}>
                  <SlideArrowIcon />
                </button>
                <button
                  onClick={() => scrollToNext(index)}
                  name={`${index === slides.length - 1}button`}
                >
                  <SlideArrowIcon />
                </button>
              </div>
              <img className={styles.main_img} src={`${server}/${item?.img}`} alt="img" />
              <button className={styles.allNews} onClick={() => navigate('/news')}>
                <span>Все новости</span>
                <img src={newsArrIcon} alt="img" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SliderHomePageMobile;
