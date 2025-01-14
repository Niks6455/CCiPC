import { useContext } from "react";
import Footer from "../../components/Footer/Footer";
import DataContext from "../../context";
import Layout from "../../ui/Layout/Layout";
import styles from "./AuthPage.module.scss";
import Login from "../../modules/Login/Login";
import Register from "../../modules/Register/Register";
import ConfirmLogin from "../../modules/ConfirmLogin/ConfirmLogin";
function AuthPage() {
    const context = useContext(DataContext);

    return ( 
        <section className={styles.AuthPage}>
            <main>
                <Layout>
                  {context.authPage === "Auth" ? <Login/> : context.authPage === "Register" ? <Register/> : <ConfirmLogin/>}
                </Layout>
            </main>
            <Footer/>
        </section>
        
     );
}

export default AuthPage;