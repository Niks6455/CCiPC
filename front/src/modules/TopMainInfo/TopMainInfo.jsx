import Button from "../../ui/Button/Button";
import styles from "./TopMainInfo.module.scss";

function TopMainInfo() {
    return ( 
        <div className={styles.topContainer}>
            <div className={styles.TopHeader}>
                <img src="/img/BgHomePageTop.png"/>
            </div>
            <main >
                <div  className={styles.mainTopTextContainer}>
                    <div className={styles.mainTopText}>
                        <div className={styles.mainTopDate}>
                                <p>23 - 29 сентября 2025 года <br/>пос. Нижний Архыз</p>
                            </div>
                            <div className={styles.mainTopList}>
                                <ul>
                                    <li>
                                        Программа <br/>конференции <span className={styles.clicker}></span>
                                    </li>
                                    <li>
                                        Информационное <br/>письмо <span className={styles.clicker}></span>
                                    </li>
                                    <li>
                                        Последний сборник <br/>научных трудов <span className={styles.clicker}></span>
                                    </li>
                                </ul>
                            </div>
                    </div>
                 
                    <div className={styles.buttonClicker}>
                        <Button text={"Подать заявку"}/>
                    </div>
                </div>
              
            </main>
        </div>
     );
}

export default TopMainInfo;