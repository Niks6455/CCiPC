import Layout from "../../ui/Layout/Layout";
import styles from "./SliderHomePageTop.module.scss";
import { dataSlider } from "./date";
import LineSlider from "../../assets/img/LineSlider.svg"
function SliderHomePageTop() {
    // Дублируем массив данных для бесконечного скролла
    const repeatedData = [...dataSlider, ...dataSlider, ...dataSlider];

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
                            {repeatedData.map((el, index) => (
                                <li key={index}>
                                    <div>
                                        <div className={styles.date}>{el.date}</div>
                                        <div>{el.text}</div>
                                    </div>
                                    <div className={styles.sliderLine}>
                                        <img src={LineSlider}/>
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
