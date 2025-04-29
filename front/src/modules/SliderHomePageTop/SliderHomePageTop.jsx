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

  const splitName = name => {
    if (name.length <= 30) return { firstPart: name, secondPart: '' };
    const words = name.split(' ');
    const midIndex = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, midIndex).join(' ');
    const secondPart = words.slice(midIndex).join(' ');
    return { firstPart, secondPart };
  };

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
                        {(() => {
                          const { firstPart, secondPart } = splitName(el.name);
                          return (
                            <>
                              <p className={styles.text}>{firstPart}</p>
                              <p className={styles.text}>{secondPart}</p>
                            </>
                          );
                        })()}
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
