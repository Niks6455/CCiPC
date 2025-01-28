import { useContext, useState } from "react";
import styles from "./LeftMenuLK.module.scss";
import DataContext from "../../context";
import logo from "./../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import documentImg from "./../../assets/img/UI/document.png";
import exitImg from "./../../assets/img/UI/exit.png";
import deleteImg from "./../../assets/img/UI/delete.png";
import SettingsImg from "./../../assets/img/UI/settings.png";
import ArchiveiMG from "./../../assets/img/UI/archive.png";
import Lk from "./../../assets/img/UI/lk.png";
function LeftMenuLk() {
  const context = useContext(DataContext);
  const [setingOpen, setSetingOpen] = useState(false);
  const navigate = useNavigate();
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
            onClick={
              // () => context.setSelectFrameLks("profile")
              () => navigate("profile")
            }
          >
            <img src={Lk} /> Профиль
          </li>
          <li
            className={
              context.selectFrameLks === "documents" ? styles.Active : ""
            }
            onClick={() => { context.setSelectFrameLks("documents"); navigate("documents")}}
          >
            <img src={documentImg} /> Мои доклады
          </li>
          <li
            className={
              context.selectFrameLks === "ArchivPhoto" ? styles.Active : ""
            }
            onClick={() => {context.setSelectFrameLks("ArchivPhoto"); navigate("ArchivPhoto")}}
          >
            <img src={ArchiveiMG} /> Архив фото
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
            <img src={SettingsImg} /> Настройки
          </li>
          <div
            className={`${styles.listSetings} ${
              setingOpen && styles.setingOpen
            }`}
          >
            <li onClick={() => navigate("settings/profile")}>
              Изменить профиль
            </li>
            <li onClick={() => navigate("settings/changepassword")}>
              Сменить пароль
            </li>
          </div>

          <li
            className={context.selectFrameLks === "ExitAccount" ? styles.Active : ""}
            onClick={
              () => {navigate("ExitAccount")
              context.setSelectFrameLks("ExitAccount")}
            }
          >
            <img src={exitImg} /> Выйти из аккаунта
          </li>
          <li
            className={context.selectFrameLks === "DeleteAccount" ? styles.Active : ""}
            onClick={
              () =>{navigate("DeleteAccount")
              context.setSelectFrameLks("DeleteAccount")}
            }
          >
            <img src={deleteImg} /> Удалить аккаунт
          </li>
        </ul>
      </div>
    </section>
  );
}

export default LeftMenuLk;
