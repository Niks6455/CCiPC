import { useEffect, useRef, useState } from "react";
import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import styles from "./TopMainInfo.module.scss";
import Bg from "../../assets/img/Bg.jpeg";
import rect from "../../assets/img/rect.svg";
function TopMainInfo() {
    const arrowRef = useRef(null); // Реф для стрелки
    const [arrowColor, setArrowColor] = useState(styles.greenArrow); // Начальный стиль стрелки

    useEffect(() => {
        const handleScroll = () => {
            if (!arrowRef.current) return;

            // Получаем позицию стрелки
            const arrowRect = arrowRef.current.getBoundingClientRect();

            // Определяем элемент под стрелкой
            const elementUnderArrow = document.elementFromPoint(arrowRect.left + arrowRect.width / 2, arrowRect.top + arrowRect.height / 2);

            // Проверяем фон элемента под стрелкой
            if (elementUnderArrow) {
                const bgColor = window.getComputedStyle(elementUnderArrow).backgroundColor;

                // Логика смены цвета стрелки
                if (bgColor === "#004529") { // Замените на ваш цвет (зелёный)
                    setArrowColor(styles.whiteArrow);
                } else {
                    setArrowColor(styles.greenArrow);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={styles.topContainer}>
            <div className={styles.TopHeader}>
                <img src={Bg} alt="Background" />
            </div>
            <main>
                <div className={styles.mainTopTextContainer}>
                    <div className={styles.mainTopText}>
                        <Layout>
                            <div className={styles.mainTopDate}>
                                <p>23 - 29 сентября 2025 года <br /> пос. Нижний Архыз</p>
                            </div>
                            <div className={styles.mainTopList}>
                                <ul>
                                    <li>
                                        Программа <br /> конференции <span className={styles.clicker}></span>
                                    </li>
                                    <li>
                                        Информационное <br /> письмо <span className={styles.clicker}></span>
                                    </li>
                                    <li>
                                        Последний сборник <br /> научных трудов <span className={styles.clicker}></span>
                                    </li>
                                </ul>
                            </div>
                        </Layout>
                    </div>
                </div>
                <div className={styles.buttonClicker}>
                    <div className={styles.buttonClickerInner}>
                        <img className={styles.leftBot} src={rect} alt="Background" />
                        <Button text={"Подать заявку"} />
                        <img className={styles.leftTop} src={rect} alt="Background" />
                    </div>
                </div>
            </main>
            <div>
                <a href="#top">
                    <div ref={arrowRef} className={`${styles.imgArrowTop} ${arrowColor}`}></div>
                </a>
            </div>
        </div>
    );
}

export default TopMainInfo;
