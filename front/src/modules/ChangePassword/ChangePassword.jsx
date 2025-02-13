import { act, useState } from "react";
import styles from "./ChangePassword.module.scss";
import Input from "../../ui/Input/Input";
import glaz from "./../../assets/img/UI/glaz.svg";
import noglaz from "./../../assets/img/UI/noglaz.svg";

function ChangePassword() {
  const [inputTypes, setInputTypes] = useState({
    currentPassword: "password",
    newpassword: "password",
    rewnewpassword: "password",
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newpassword: "",
    rewnewpassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newpassword: "",
    rewnewpassword: "",
  });

  const clickRigthImg = (name) => {
    if (inputTypes[name] === "password") {
      setInputTypes({ ...inputTypes, [name]: "text" });
    } else {
      setInputTypes({ ...inputTypes, [name]: "password" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: "" });
  };
  return (
    <div className={styles.ChangePassword}>
      <div className={styles.container}>
        <Input
          name={"currentPassword"}
          onChange={handleChange}
          value={formData.currentPassword}
          placeholder=""
          error={errors.currentPassword}
          labelText={"Текущий пароль*"}
          inputerrorStyle={{ top: "25px" }}
          type={inputTypes.currentPassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.currentPassword === "text"}
          rigthImgClick={() => clickRigthImg("currentPassword")}
          autoComplete={"off"}
        />
        <Input
          name={"newpassword"}
          onChange={handleChange}
          value={formData.newpassword}
          placeholder=""
          error={errors.newpassword}
          labelText={"Придумайте новый пароль*"}
          inputerrorStyle={{ top: "25px" }}
          type={inputTypes.newpassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.newpassword === "text"}
          rigthImgClick={() => clickRigthImg("newpassword")}
          autoComplete={"off"}
        />
        <Input
          name={"rewnewpassword"}
          onChange={handleChange}
          value={formData.rewnewpassword}
          placeholder=""
          error={errors.rewnewpassword}
          labelText={"Повторите новый пароль*"}
          inputerrorStyle={{ top: "25px" }}
          type={inputTypes.rewnewpassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.rewnewpassword === "text"}
          rigthImgClick={() => clickRigthImg("rewnewpassword")}
          autoComplete={"off"}
        />
        <button className={styles.changebtn}>Изменить</button>
      </div>
    </div>
  );
}

export default ChangePassword;
