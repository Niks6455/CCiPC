import { useNavigate } from "react-router-dom";
import styles from "./LeftMenuAdminPage.module.scss";
import logo from "./../../../assets/img/logo.png";
import archive from "./../../../assets/img/AdminPanel/archive.svg"
import colaborators from "./../../../assets/img/AdminPanel/colaborators.svg"
import conference from "./../../../assets/img/AdminPanel/conference.svg"
import news from "./../../../assets/img/AdminPanel/news.svg"
import org from "./../../../assets/img/AdminPanel/org.svg"
import orgMoney from "./../../../assets/img/AdminPanel/orgMoney.svg"
function LeftMenuAdminPage() {
    const navigate = useNavigate();
    return ( 
        <section className={styles.LeftMenuAdminPage}>
            <div className={styles.LeftMenuAdminPageInner}>
                <img
                    src={logo}
                    className={styles.LogoImg}
                    onClick={() => navigate("/")}
                />
                <p className={styles.Title}>Панель администратора</p>
                <ul className={styles.LeftMenuLkList}>
                    <li className={styles.active}><img src={news}/>Новости</li>
                    <li><img src={conference}/>Конференция</li>
                    <li><img src={org}/>Оргкомитет</li>
                    <li><img src={colaborators}/>Участники</li>
                    <li><img src={orgMoney}/>Оргвзнос</li>
                    <li><img src={archive}/>Архив фото</li>
                </ul>
            </div>
        </section>
     );
}

export default LeftMenuAdminPage;