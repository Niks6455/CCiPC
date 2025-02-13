import { useNavigate } from "react-router-dom";
import deleteImg from "./../../assets/img/delete.png";
import style from "./DeleteAccount.module.scss";
import { useContext } from "react";
import DataContext from "../../context";
function DeleteAccount() {
  const navigate = useNavigate();
  const context = useContext(DataContext);
  return (
    <section className={style.DeleteAccount}>
      <div>
        <div className={style.DeleteAccountImg}>
          <img src={deleteImg} />
        </div>
        <p>
          Все данные будут утеряны навсегда. <br />
          Вы уверены, что хотите удалить аккаунт?
        </p>
        <div className={style.DeleteAccountButton}>
          <button
            onClick={() => {
              navigate("/account/profile");
              context.setSelectFrameLks("profile");
            }}
          >
            Нет
          </button>
          <button>Да</button>
        </div>
      </div>
    </section>
  );
}

export default DeleteAccount;
