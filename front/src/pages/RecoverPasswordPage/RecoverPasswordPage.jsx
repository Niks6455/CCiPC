import { Outlet } from "react-router-dom";
import styles from "./RecoverPasswordPage.module.scss";

function RecoverPasswordPage() {
  return (
    <div className={styles.RecoverPasswordPage}>
      <Outlet />
    </div>
  );
}

export default RecoverPasswordPage;
