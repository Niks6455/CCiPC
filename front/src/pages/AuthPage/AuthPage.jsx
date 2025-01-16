import { useContext } from "react";
import DataContext from "../../context";
import Layout from "../../ui/Layout/Layout";
import styles from "./AuthPage.module.scss";
import Login from "../../modules/Login/Login";
import Register from "../../modules/Register/Register";
import ConfirmLogin from "../../modules/ConfirmLogin/ConfirmLogin";
import Footer from "../../components/Footer/Footer";
function AuthPage() {
    const context = useContext(DataContext);

    return ( 
        <>
            <main className={styles.AuthPage}>
                <Layout>
                    {context.authPage === "Auth" ? <Login/> : context.authPage === "Register" ? <Register/> : <ConfirmLogin/>}
                </Layout>
            </main>
            <Footer/>
        </>
     );
}

export default AuthPage;