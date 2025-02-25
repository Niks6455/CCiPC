import { act, useState } from "react";
import styles from "./ChangePassword.module.scss";
import Input from "../../ui/Input/Input";
import glaz from "@assets/img/UI/glaz.svg";
import noglaz from "@assets/img/UI/noglaz.svg";
import listErrorNoHover from "@assets/img/UI/listErrorNoActive.svg";
import listErrorOnHover from "@assets/img/UI/listError.svg";
import {
  funCapitalLetter,
  funDigit,
  funEightSymbols,
} from "../../utils/functions/PasswordValidation";
import { useMutation } from "@tanstack/react-query";
import { apiChangePassword } from "../../apirequests/apirequests";

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

  const [errorListPassword, setErrorListPassword] = useState([
    {
      id: "0",
      text: "Не менее 8 символов",
      done: false,
      functionCheck: funEightSymbols,
    },
    {
      id: "1",
      text: "Не менее 1 заглавной буквы",
      done: false,
      functionCheck: funCapitalLetter,
    },
    {
      id: "2",
      text: "Не менее 1 цифры",
      done: false,
      functionCheck: funDigit,
    },
  ]);

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

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    // Проверка обязательных полей
    ["currentPassword", "newpassword", "rewnewpassword"].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Поле обязательно для заполнения";
        isValid = false;
      }
    });
    // Проверка совпадения паролей
    if (formData.newpassword !== formData.rewnewpassword) {
      newErrors.newpassword = "Пароли не совпадают";
      newErrors.rewnewpassword = "Пароли не совпадают";
      isValid = false;
    }
    if (errorListPassword.find((el) => !el.done)) {
      newErrors.newpassword = "Некорректный пароль";
      newErrors.rewnewpassword = "Некорректный пароль";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  //! изменение пароля
  const funEditPassword = () => {
    if (validate()) {
      const data = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newpassword,
        repeatPassword: formData.rewnewpassword,
      };
      apiChangePassword(data).then((res) => console.log(res));
    }
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
          errorList={errorListPassword}
          setErrorList={setErrorListPassword}
          errorListImgHover={listErrorOnHover}
          errorListImgNoHover={listErrorNoHover}
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
        <button className={styles.changebtn} onClick={funEditPassword}>
          Изменить
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
