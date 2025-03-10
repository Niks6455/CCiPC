import { useEffect, useRef, useState } from 'react';
import styles from './SliderHomePageMobile.module.scss';
import { getAllNews, server } from '../../apirequests/apirequests';

function SliderHomePageMobile() {
  const [slides, setSlides] = useState([]);
  const containerRef = useRef(null); // Reference to the scrollable container
  const itemsRef = useRef([]); // References to all team_item elements

  useEffect(() => {
    getAllNews().then(res => {
      if (res?.status === 200) {
        setSlides(res?.data?.news.splice(0, 5));
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
                <button onClick={() => scrollToPrevious(index)}>prev</button>
                <span>{index + 1}</span>
                <button onClick={() => scrollToNext(index)}>next</button>
              </div>
              <img className={styles.main_img} src={`${server}/${item?.img}`} alt="img" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SliderHomePageMobile;
