import { useContext, useState } from "react";
import styles from "./LeftMenuLK.module.scss";
import DataContext from "../../context";
import logo from "./../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
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
            <img src="/img/UI/user.svg" /> Профиль
          </li>
          <li
            className={
              context.selectFrameLks === "documents" ? styles.Active : ""
            }
            onClick={() => {
              navigate("documents");
              setDokladOpen(!dokladOpen);
            }}
          >
            <img src="/img/UI/document.svg" />
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
              context.selectFrameLks === "pictures" ? styles.Active : ""
            }
            onClick={() => {
              context.setSelectFrameLks("pictures");
            }}
          >
            <img src="/img/UI/picture.svg" />
            Архив фото
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
            <img src="/img/UI/settings.svg" />
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
            <li onClick={() => navigate("settings/profile")}>
              Изменить профиль
            </li>
            <li onClick={() => navigate("settings/changepassword")}>
              Сменить пароль
            </li>
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
