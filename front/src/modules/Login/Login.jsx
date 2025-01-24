import React, { useContext, useState } from "react";
import Input from "../../ui/Input/Input";
import styles from "./Login.module.scss";
import DataContext from "../../context";
import { useNavigate } from "react-router-dom";
import logo from "./../../assets/img/logo.png";
import sfeduLogo from "./../../assets/img/SfeduLogo.svg";
function Login() {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    if (!formData.login) {
      newErrors.login = "Введите Email*";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.login)) {
      newErrors.login = "Некорректный Email*";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль*";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    navigate("/HomePage");
    // if (validate()) {
    //     console.log("Форма отправлена", formData);
    //     // navigate("/HomePage");

    // }
  };

  return (
    <section className={styles.Login}>
      <div className={styles.LoginLogo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.LoginTitle}>
        <p>Добро пожаловать</p>
        <p>Войдите в личный кабинет, чтобы начать работу.</p>
      </div>
      <div className={styles.input}>
        <div className={styles.inputInner}>
          <Input
            name="login"
            onChange={handleChange}
            value={formData.login}
            placeholder="Email"
            imgSrc="/img/login.svg"
            error={errors.login}
            autoComplete={true}
          />
          <Input
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Пароль"
            imgSrc="/img/password.svg"
            error={errors.password}
            type="password"
            autoComplete={true}
          />
          <div className={styles.forgetPassword}>
            <p onClick={() => navigate("/recoverpassword")}>Забыли пароль?</p>
          </div>
        </div>
      </div>
      <div className={styles.Maybe}>
        <div className={styles.MaybeInner}>
          <div className={styles.lineOne}></div>
          <div className={styles.CentralContainer}>
            <p>ИЛИ</p>
          </div>
          <div className={styles.lineTwo}></div>
        </div>
      </div>
      <div className={styles.loginButtonSfedu}>
        <button>
          <img src={sfeduLogo} />
          Войти через аккаунт @sfedu
        </button>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>Войти</button>
      </div>
      <div className={styles.noAccount}>
        <p>Еще нет аккаунта?</p>
        <p onClick={() => context.setAuthPage("Register")}>Зарегистрируйтесь</p>
      </div>
    </section>
  );
}

export default Login;
