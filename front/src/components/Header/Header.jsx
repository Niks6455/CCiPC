import styles from "./Header.module.scss";

function Header() {
    return ( 
        <header>
            <div className={styles.HeaderContainer} id="top">
                <div className={styles.logo}>
                    <img src="/img/logo.svg" alt="logo" />
                </div>
                <div className={styles.TitleText}>
                    <img src="/img/text.svg" alt="Conference Title" />
                </div>
            </div>
            <div className={styles.HeaderMenuContainer}>
                <div className={styles.HeaderMenu}>
                    <ul>
                        <li>Автору <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                        <li>Участнику <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                        <li>Оргкомитет <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                        <li>Вход/Регистрация <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    </ul>
                </div>
                <div className={styles.HeaderLocarion}>
                    <p>Ru</p>
                    <img src="/img/arrow.svg" alt="Language Selector" />
                </div>
            </div>
            
        </header>
    );
}

export default Header;