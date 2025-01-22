import { useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from "./../../assets/img/closeImg.png";

function NavBar() {
    const [activeMenu, setActiveMenu] = useState(false);

    return ( 
        <section className={styles.NavBar}>
            <button className={styles.NavBarButton} onClick={() => setActiveMenu(true)}>
                <p>Меню</p>
                <div className={styles.NavBarMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <div 
                onClick={() => setActiveMenu(false)} 
                className={`${styles.menu} ${activeMenu ? styles.active : ""}`}
            >
                <button>Скрыть <img src={closeImg} alt="Close"/></button>
            </div>
        </section>
    );
}

export default NavBar;
