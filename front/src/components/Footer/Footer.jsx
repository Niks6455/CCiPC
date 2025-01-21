import Layout from "../../ui/Layout/Layout";
import styles from "./Footer.module.scss";
import footerLogo from "../../assets/img/FooterText.svg"
function Footer() {
    return ( 
        <footer className={styles.footer}>
            <Layout>
                <div className={styles.footerContainer}>
                    <div className={styles.footerContainerLeft}>
                        <div>
                            <img src={footerLogo} alt="logo"/>
                        </div>
                        <div className={styles.footerText}>
                            <p>Всероссийская научная конференция<br/> "Системный синтез и прикладная синергетика"</p>
                            <p>23 - 29 сентября 2025 года пос. Нижний Архыз</p>
                        </div>
                    </div>
                    <div className={styles.footerLink}>
                        <div>
                            <p>Напишите нам:</p>
                            <p className={styles.link}>e-mail: <a href="mailto:ssas@ictis.sfedu.ru">ssas@ictis.sfedu.ru</a></p>
                        </div>
                    </div>
                  
                </div>
              
            </Layout>
        </footer>
     );
}

export default Footer;