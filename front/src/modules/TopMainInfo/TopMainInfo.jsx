import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
import styles from "./TopMainInfo.module.scss";
import Bg from "../../assets/img/Bg.jpeg";
import rect from "../../assets/img/rect.svg";
import React, { useContext, useEffect, useRef, useState } from "react";
import DataContext from "../../context";

function TopMainInfo() {
  const arrowRef = useRef(null); // Реф для стрелки
  const [arrowColor, setArrowColor] = useState(styles.greenArrow); // Начальный стиль стрелки
  const context = useContext(DataContext);
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
                <p>
                  23 - 29 сентября 2025 года <br /> пос. Нижний Архыз
                </p>
              </div>
              <div className={styles.mainTopList}>
                <ul>
                  <li>
                    <a
                      target="_blank"
                      href="https://webictis.sfedu.ru/ssas/Program2024.pdf"
                    >
                      Программа <br /> конференции
                    </a>
                    <a
                      target="_blank"
                      href="https://webictis.sfedu.ru/ssas/Program2024.pdf"
                      className={styles.clicker}
                    ></a>
                  </li>
                  <li>
                    Информационное <br /> письмо
                    <span className={styles.clicker}></span>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://webictis.sfedu.ru/ssas/SSAS_2022.pdf"
                    >
                      Последний сборник <br /> научных трудов
                    </a>
                    <a
                      target="_blank"
                      href="https://webictis.sfedu.ru/ssas/SSAS_2022.pdf"
                      className={styles.clicker}
                    ></a>
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
      {!context.activeMenu && (
        <div className={styles.arrowTop}>
          <a href="#top">
            <div
              ref={arrowRef}
              className={`${styles.imgArrowTop} ${arrowColor}`}
            ></div>
          </a>
        </div>
      )}
    </div>
  );
}

export default TopMainInfo;
