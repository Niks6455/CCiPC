import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import LogoHomePage from "./../../assets/img/logo.png";
import TextLogo from "./../../assets/img/text.svg";
import arrow from "./../../assets/img/arrow.svg";
import footerLogo from "./../../assets/img/Headernumber.png";
import ArrowMenu from "./../../assets/img/ArrowMenu.png";
function Header() {
  const navigate = useNavigate();
  return (
    <header>
      <div className={styles.HeaderContainer} id="top">
        <div className={styles.logo}>
          <img src={LogoHomePage} alt="logo" onClick={() => navigate("/")} />
        </div>
        <div className={styles.logoInner}>
          <img src={footerLogo} alt="logo" />
          <p>
            Всероссийская научная конференция
            <br /> "Системный синтез и прикладная синергетика"
          </p>
        </div>
      </div>
      <div className={styles.HeaderMenuContainer}>
        <div className={styles.HeaderMenu}>
          <ul>
            <li onClick={() => navigate("/author")}>
              Автору{" "}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate("/participants")}>
              Участники{" "}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate("/organizationcomite")}>
              Оргкомитет{" "}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
            <li onClick={() => navigate("/account/profile")}>
              Личный кабинет{" "}
              <span className={styles.arowLi}>
                <img src={ArrowMenu} alt="Arrow" />
              </span>
            </li>
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
