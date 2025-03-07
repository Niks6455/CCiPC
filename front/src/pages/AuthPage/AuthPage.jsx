import { useContext } from "react";
import DataContext from "../../context";
import Layout from "../../ui/Layout/Layout";
import styles from "./AuthPage.module.scss";
import Login from "../../modules/Login/Login";
import Register from "../../modules/Register/Register";
import ConfirmLogin from "../../modules/ConfirmLogin/ConfirmLogin";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
function AuthPage(props) {
  const context = useContext(DataContext);

  return (
    <>
      <main className={styles.AuthPage}>
        <NavBar />
        <Layout>
          {context.authPage === "Auth" ? (
            <Login funGetAllApi={props.funGetAllApi} />
          ) : context.authPage === "Register" ? (
            <Register />
          ) : context.authPage === "ConfirmLogin" ? (
            <ConfirmLogin />
          ) : null}
        </Layout>
      </main>
      <Footer />
    </>
  );
}

export default AuthPage;
