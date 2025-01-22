import { useContext, useState } from "react";
import styles from "./LeftMenuLK.module.scss";
import DataContext from "../../context";
import logo from "./../../assets/img/logo.png";
function LeftMenuLk() {
  const context = useContext(DataContext);
  const [setingOpen, setSetingOpen] = useState(false);
  return (
    <section className={styles.LeftMenuLk}>
      <div>
        <img src={logo} className={styles.LogoImg} />
        <p className={styles.LeftMenuLkTitle}>Личный кабинет</p>
        <ul className={styles.LeftMenuLkList}>
          <li
            className={
              context.selectFrameLks === "profile" ? styles.Active : ""
            }
            onClick={() => context.setSelectFrameLks("profile")}
          >
            <img src="/img/UI/user.svg" /> Профиль
          </li>
          <li
            className={
              context.selectFrameLks === "documents" ? styles.Active : ""
            }
            onClick={() => context.setSelectFrameLks("documents")}
          >
            <img src="/img/UI/document.svg" /> Мои доклады
          </li>
          <li
            className={
              context.selectFrameLks === "pictures" ? styles.Active : ""
            }
            onClick={() => context.setSelectFrameLks("pictures")}
          >
            <img src="/img/UI/picture.svg" /> Архив фото
          </li>
          <li
            className={
              context.selectFrameLks === "settings" ? styles.Active : ""
            }
            onClick={() => {
              context.setSelectFrameLks("settings");
              setSetingOpen(!setingOpen);
            }}
          >
            <img src="/img/UI/settings.svg" /> Настройки
          </li>
          <div
            className={`${styles.listSetings} ${
              setingOpen && styles.setingOpen
            }`}
          >
            <li>Профиль</li>
            <li>Сменить пароль</li>
          </div>

          <li
            className={context.selectFrameLks === "logout" ? styles.Active : ""}
            onClick={() => context.setSelectFrameLks("logout")}
          >
            <img src="/img/UI/logout.svg" /> Выйти из аккаунта
          </li>
          <li
            className={context.selectFrameLks === "delete" ? styles.Active : ""}
            onClick={() => context.setSelectFrameLks("delete")}
          >
            <img src="/img/UI/cancel.svg" /> Удалить аккаунт
          </li>
        </ul>
      </div>
    </section>
  );
}

export default LeftMenuLk;
