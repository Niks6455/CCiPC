import styles from "./HeaderSecond.module.scss";

function HeaderSecond() {
    return ( 
        <header className={styles.HeaderSecond}>
            <div className={styles.HeaderSecondInner}>
                <div>
                    <img src="/img/logo.svg"/>
                </div>
                <div className={styles.HeaderMenu}>
                    <ul>
                        <li>Автору <span className={styles.arowLi}><img src="/img/ArrowBotGreen.svg" alt="Arrow" /></span></li>
                        <li>Участнику <span className={styles.arowLi}><img src="/img/ArrowBotGreen.svg" alt="Arrow" /></span></li>
                        <li>Оргкомитет <span className={styles.arowLi}><img src="/img/ArrowBotGreen.svg" alt="Arrow" /></span></li>
                        <li>Вход/Регистрация <span className={styles.arowLi}><img src="/img/ArrowBotGreen.svg" alt="Arrow" /></span></li>
                    </ul>
                </div>
            </div>
            
        </header>
     );
}

export default HeaderSecond;