import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import LogoHomePage from "./../../assets/img/logo.png"
import TextLogo from "./../../assets/img/text.svg"
import arrow from "./../../assets/img/arrow.svg"
import footerLogo from "./../../assets/img/Headernumber.png"
import ArrowMenu from "./../../assets/img/ArrowMenu.png"
function Header() {
    const navigate = useNavigate();
    return ( 
        <header>
            <div className={styles.HeaderContainer} id="top">
                <div className={styles.logo}>
                    <img src={LogoHomePage} alt="logo" />
                </div>
                <div className={styles.logoInner}>
                    <img src={footerLogo} alt="logo"/>
                    <p>Всероссийская научная конференция<br/> "Системный синтез и прикладная синергетика"</p>
                </div>
            </div>
            <div className={styles.HeaderMenuContainer}>
                <div className={styles.HeaderMenu}>
                    <ul>
                        <li onClick={()=>navigate('/Author')}>Автору <span className={styles.arowLi}><img src={ArrowMenu} alt="Arrow" /></span></li>
                        <li onClick={()=>navigate('/Participants')}>Участники <span className={styles.arowLi}><img src={ArrowMenu} alt="Arrow" /></span></li>
                        <li onClick={()=>navigate('/OrganizationComite')}>Оргкомитет <span className={styles.arowLi}><img src={ArrowMenu} alt="Arrow" /></span></li>
                        <li onClick={()=>navigate('/Lks/profile')}>Личный кабинет <span className={styles.arowLi}><img src={ArrowMenu} alt="Arrow" /></span></li>
                    </ul>
                </div>
                <div className={styles.HeaderLocarion}>
                    <p>Ru</p>
                    <img src={arrow} alt="Language Selector" />
                </div>
            </div>
            
        </header>
    );
}

export default Header;