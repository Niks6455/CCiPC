import styles from "./EnteringEmail.module.scss";
import logoIcon from "@assets/img/logo.png";

function EnteringEmail() {
  return (
    <div className={styles.EnteringEmail}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logoIcon} alt="Логотип" />
        </div>
        <h2>Забыли пароль?</h2>
        <p>
          Чтобы задать новый пароль, введите электронную почту своего аккаунта
        </p>
        <button className={styles.next_button}>Далее</button>
      </div>
    </div>
  );
}

export default EnteringEmail;
