import Layout from "../../ui/Layout/Layout";
import styles from "./Footer.module.scss";
function Footer() {
    return ( 
        <footer className={styles.footer}>
            <Layout>
                <div className={styles.footerContainer}>
                    <img src="/img/FooterText.svg" alt="logo"/>
                </div>
            </Layout>
        </footer>
     );
}

export default Footer;