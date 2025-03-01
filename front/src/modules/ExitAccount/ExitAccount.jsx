import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExitAccount.module.scss";
import DataContext from "../../context";
import ExitImg from "./../../assets/img/exit.png";

function ExitAccount(props) {
  const navigate = useNavigate();
  const context = useContext(DataContext);

  const funExcit = () => {
    navigate("/authorization");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    props.funResetAllApi();
  };

  return (
    <section className={styles.ExitAccount}>
      <div>
        <div className={styles.ExitAccountImg}>
          <img src={ExitImg} />
        </div>
        <p>Выйти из аккаунта?</p>
        <div className={styles.ExitAccountButton}>
          <button
            onClick={() => {
              navigate("/account/profile");
              context.setSelectFrameLks("profile");
            }}
          >
            В профиль
          </button>
          <button onClick={funExcit}>Да</button>
        </div>
      </div>
    </section>
  );
}

export default ExitAccount;
