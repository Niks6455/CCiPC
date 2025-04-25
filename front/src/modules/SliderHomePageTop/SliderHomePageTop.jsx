import Layout from '../../ui/Layout/Layout';
import styles from './SliderHomePageTop.module.scss';
import LineSlider from '../../assets/img/LineSlider.svg';
import { useSelector } from 'react-redux';
import { useWindowWidth } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import { convertDate } from '../../utils/functions/funcions';
function SliderHomePageTop() {
  const [mobile, setMobile] = useState(false);
  // Дублируем массив данных для бесконечного скролла
  const conferenceStages = useSelector(state => state.conferences.data[0].stages);
  useEffect(() => {
    setMobile(window.innerWidth < 480);
  }, [useWindowWidth()]);

  return (
    <div className={styles.SliderHomePageTop}>
      <div>
        <Layout>
          <p>/ ЭТАПЫ ПРОВЕДЕНИЯ КОНФЕРЕНЦИИ /</p>
        </Layout>
        <div className={styles.line}></div>
        <div className={styles.SliderHomePageTopInner}>
          <div className={styles.Slider}>
            <ul>
              {Array(mobile ? 1 : 100)
                .fill(conferenceStages)
                .flat()
                .map((el, index) => (
                  <>
                    <li key={index}>
                      <div className={styles.sliderItem}>
                        <div className={styles.date}>{convertDate(el.date)}</div>
                        <div>{el.name}</div>
                      </div>
                    </li>
                    <div className={styles.sliderLine}>
                        <img src={LineSlider} />
                    </div>
                  </>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SliderHomePageTop;
