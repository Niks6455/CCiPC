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
import { ReactComponent as BlackArrowBottom } from "./../../assets/img/UI/blackArrowBottom.svg";
import { useSelector } from "react-redux";

function LeftMenuLk() {
  const context = useContext(DataContext);
  const [setingOpen, setSetingOpen] = useState(false);
  const [dokladOpen, setDokladOpen] = useState(false);
  const navigate = useNavigate();
  const reports = useSelector((state) => state.reportsSlice);

  //! появление названия
  const [showTooltip, setShowTooltip] = useState(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const handleMouseEnter = (index) => {
    // Устанавливаем таймер для задержки
    const timeout = setTimeout(() => {
      setShowTooltip(index);
    }, 500); // Задержка в 300 мс

    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Очищаем таймер и скрываем подсказку
    clearTimeout(tooltipTimeout);
    setShowTooltip(null);
  };

  const handleMouseMove = (event) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
  };
  return (
    <section className={styles.LeftMenuLk}>
      <div className={styles.LeftMenuLkInner}>
        <img
          src={logo}
          className={styles.LogoImg}
          onClick={() => navigate("/")}
        />
        <p className={styles.LeftMenuLkTitle}>Личный кабинет</p>
        <ul className={styles.LeftMenuLkList}>
          <li
            className={
              context.selectFrameLks === "profile" ? styles.Active : ""
            }
            onClick={() => {
              context.setSelectFrameLks("profile");
              navigate("profile");
            }}
          >
            <img src={Lk} /> Профиль
          </li>
          <li
            className={
              context.selectFrameLks === "documents" ? styles.Active : ""
            }
            onClick={() => {
              navigate("documents");
              setDokladOpen(!dokladOpen);
              context.setSelectFrameLks("documents");
            }}
          >
            <img src={documentImg} />
            <span>Мои доклады</span>
            <BlackArrowBottom
              className={`${styles.arrow} ${dokladOpen ? styles.open : ""}`}
            />
          </li>
          <div
            className={`${styles.listSetings} ${
              dokladOpen && styles.setingOpen
            }`}
          >
            {reports.data.map((rep, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave()}
                onMouseMove={handleMouseMove}
                onClick={() => navigate(`viewreports?idReport=${rep.id}`)}
              >
                {index === showTooltip && (
                  <div
                    style={{
                      left: coordinates.x + 50,
                      top: coordinates.y - 20,
                    }}
                    className={styles.repName}
                  >
                    {rep.name}
                  </div>
                )}
                <span>Доклад №{rep.number}</span>
              </li>
            ))}
          </div>
          <li
            className={
              context.selectFrameLks === "ArchivPhoto" ? styles.Active : ""
            }
            onClick={() => {
              context.setSelectFrameLks("ArchivPhoto");
              navigate("archivephoto");
            }}
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
              context.setSelectFrameLks("settings");
            }}
          >
            <img src={SettingsImg} />
            <span>Настройки</span>
            <BlackArrowBottom
              className={`${styles.arrow} ${setingOpen ? styles.open : ""}`}
            />
          </li>
          <div
            className={`${styles.listSetings} ${
              setingOpen && styles.setingOpen
            }`}
          >
            <li
              onClick={() => {
                navigate("settings/profile");
                context.setSelectFrameLks("settings/profile");
              }}
              className={
                context.selectFrameLks === "settings/profile"
                  ? styles.Active
                  : ""
              }
            >
              Изменить профиль
            </li>
            <li
              onClick={() => {
                navigate("settings/changepassword");
                context.setSelectFrameLks("settings/changepassword");
              }}
              className={
                context.selectFrameLks === "settings/changepassword"
                  ? styles.Active
                  : ""
              }
            >
              Сменить пароль
            </li>
          </div>

          <li
            className={
              context.selectFrameLks === "ExitAccount" ? styles.Active : ""
            }
            onClick={() => {
              navigate("exitaccount");
              context.setSelectFrameLks("ExitAccount");
            }}
          >
            <img src={exitImg} /> Выйти из аккаунта
          </li>
          <li
            className={
              context.selectFrameLks === "DeleteAccount" ? styles.Active : ""
            }
            onClick={() => {
              navigate("deleteaccount");
              context.setSelectFrameLks("DeleteAccount");
            }}
          >
            <img src={deleteImg} /> Удалить аккаунт
          </li>
        </ul>
      </div>
    </section>
  );
}

export default LeftMenuLk;
