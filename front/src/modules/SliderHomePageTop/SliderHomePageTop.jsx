import Layout from '../../ui/Layout/Layout';
import styles from './SliderHomePageTop.module.scss';
import { dataSlider } from './date';
import LineSlider from '../../assets/img/LineSlider.svg';
import { useSelector } from 'react-redux';
function SliderHomePageTop() {
  // Дублируем массив данных для бесконечного скролла
  const conferenceStages = useSelector(state => state.conferences.data[0].stages);

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
              {Array(100)
                .fill(conferenceStages)
                .flat()
                .map((el, index) => (
                  <li key={index}>
                    <div className={styles.sliderItem}>
                      <div className={styles.date}>{el.date}</div>
                      <div>{el.name}</div>
                    </div>
                    <div className={styles.sliderLine}>
                      <img src={LineSlider} />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SliderHomePageTop;
