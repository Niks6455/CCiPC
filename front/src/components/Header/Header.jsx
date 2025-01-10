import styles from "./Header.module.scss";
function Header() {
    return ( 
        <header>
        <div className={styles.HeaderContainer}>
            <div className={styles.logo}>
                <img src="/img/logo.svg" alt="logo"/>
            </div>
            <div className={styles.TitleText}>
                {/* <img src="/img/numb.svg" className={styles.number}/> */}
                {/* <p>
                    ВСЕРОССИЙСКАЯ НАУЧНАЯ КОНФЕРЕНЦИЯ "СИСТЕМНЫЙ СИНТЕЗ И ПРИКЛАДНАЯ СИНЕРГЕТИКА"
                </p> */}
                <img src="/img/text.svg"/>
            </div>
        </div>
        <div className={styles.HeaderMenu}>
            <ul>
                <li>Автору <span className={styles.arowLi}><img src="/img/ArrowMenu.png"/></span></li>
                <li>Участнику <span className={styles.arowLi}><img src="/img/ArrowMenu.png"/></span></li>
                <li>Оргкомитет <span className={styles.arowLi}><img src="/img/ArrowMenu.png"/></span></li>
                <li>Вход/Регистрация <span className={styles.arowLi}><img src="/img/ArrowMenu.png"/></span></li>
            </ul>
        </div>
        <div className={styles.HeaderLocarion}>
            <p>Ru</p>
            <img src="/img/arrow.svg"/>
        </div>
        </header>
     );
}

export default Header;