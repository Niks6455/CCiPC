import Button from "../../ui/Button/Button";
import Layout from "../../ui/Layout/Layout";
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
                        <img className={styles.leftBot} src="/img/rect.svg" alt="Background"/>
                            <Button text={"Подать заявку"} />
                        <img className={styles.leftTop} src="/img/rect.svg" alt="Background"/>
                    </div>
                </div>
            </main>
            <div>
                <a><div className={styles.imgArrowTop}></div></a>
            </div>
        </div>
    );
}

export default TopMainInfo;