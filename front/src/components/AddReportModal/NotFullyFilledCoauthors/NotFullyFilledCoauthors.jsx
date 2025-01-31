import { useDispatch } from "react-redux";
import styles from "./NotFullyFilledCoauthors.module.scss";
import { setOpenPopUpName } from "../../../store/reportCreateSlice/reportCreateSlice";
import { useNavigate } from "react-router-dom";

function NotFullyFilledCoauthors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const funCloseModal = () => {
    dispatch(setOpenPopUpName({ name: "" }));
  };

  const funSaveData = () => {
    dispatch(setOpenPopUpName({ name: "" }));
    navigate("/account/profile");
  };

  return (
    <div className={styles.NotFullyFilledCoauthors}>
      <p className={styles.title}>
        Вы добавили соавтора(ов), но не заполнили необходимую информацию!
      </p>
      <div className={styles.btn}>
        <button onClick={funCloseModal} className={styles.btnred}>
          Вернуться к соавторам
        </button>
        <button className={styles.btnLight} onClick={funSaveData}>
          Сохранить без соавторов
        </button>
      </div>
    </div>
  );
}

export default NotFullyFilledCoauthors;
