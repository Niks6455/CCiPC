import Button from "../../ui/Button/Button";
import styles from "./TopMainInfo.module.scss";

function TopMainInfo() {
    return ( 
        <div className={styles.topContainer}>
            <div className={styles.TopHeader}>
                <img src="/img/Bg.jpeg" alt="Background" />
            </div>
            <main>
                <div className={styles.mainTopTextContainer}>
                    <div className={styles.mainTopText}>
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
                    </div>
                </div>
                <div className={styles.buttonClicker}>
                    <div className={styles.buttonClickerInner}>
                        <img className={styles.leftBot} src="/img/rect.png" alt="Background"/>
                        <Button text={"Подать заявку"} />
                        {/* <img className={styles.leftTop} src="/img/rect.png" alt="Background"/> */}

                    </div>
                  
                    </div>
            </main>
        </div>
    );
}

export default TopMainInfo;