import React, { useContext, useEffect, useRef, useState } from "react";
import Input from "../../ui/Input/Input";
import styles from "./Register.module.scss";
import DataContext from "../../context";
import logo from "./../../assets/img/logo.png";
import InputList from "../../ui/InputList/InputList";
import listErrorNoHover from "./../../assets/img/UI/listErrorNoActive.svg";
import listErrorOnHover from "./../../assets/img/UI/listError.svg";
import lock from "./../../assets/img/UI/lock.svg";
import { doljnostList, stepenList, zwanieList } from "../../utils/Lists/List";
import {
  funCapitalLetter,
  funDigit,
  funEightSymbols,
} from "../../utils/functions/PasswordValidation";
import { apiRegister } from "../../apirequests/apirequests";

function Register() {
  const context = useContext(DataContext);
  const [openList, setOpenList] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    academicTitle: "",
    degree: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    napravlenieKonferencii: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    position: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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

  const funSelectedElement = (key, value) => {
    //! проверка что такой ключь есть в formData
    if (!formData.hasOwnProperty(key)) {
      return;
    }
    setErrors({ ...errors, [key]: "" });
    setFormData({ ...formData, [key]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если поле "number", форматируем номер телефона
    const formattedValue = name === "phone" ? formatPhoneNumber(value) : value;

    setFormData({ ...formData, [name]: formattedValue });

    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: "" });
  };

  const formatPhoneNumber = (value) => {
    // Форматируем номер в виде +7 (XXX) XXX-XX-XX
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return cleaned.slice(0, 16); // Ограничение длины
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    // Проверка обязательных полей
    [
      "name",
      "surname",
      "position",
      "organization",
      "email",
      "phone",
      "password",
      "confirmPassword",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Поле обязательно для заполнения";
        isValid = false;
      }
    });

    // Проверка корректности Email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный Email";
      isValid = false;
    }

    // Проверка номера телефона
    if (
      formData.phone &&
      !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone)
    ) {
      newErrors.phone = "Номер должен быть в формате +7 (XXX) XXX-XX-XX";
      isValid = false;
    }

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Форма отправлена", formData);
      // type 0 это подтверждение
      // сброс пароля type 1
      apiRegister(formData).then((res) => {
        console.log("res", res);
        if (res?.status === 200) {
          context.setAuthPage("ConfirmLogin");
          context.setMailValue(formData.email);
          sessionStorage.setItem("confirmEmail", formData.email);
          console.log(res);
        }
      });
    }
  };

  const funOpenList = (param) => {
    if (param === openList) {
      setOpenList("");
    } else {
      setOpenList(param);
    }
  };

  // const refCalendar = useRef(null);
  // массив из ref
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refList = [ref1, ref2, ref3, ref4];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refList.every(
          (item) => item.current && !item.current.contains(event.target)
        )
      ) {
        funOpenList("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className={styles.Login}>
      <div className={styles.LoginLogo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.LoginTitle}>
        <p>Добро пожаловать</p>
        <p>Зарегистрируйтесь, чтобы начать работу.</p>
      </div>
      <div className={styles.input}>
        <div className={styles.inputInner}>
          <div className={styles.inputInnerBlock}>
            <Input
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="Имя*"
              error={errors.name}
              autoComplete={"new-password"}
            />
            <Input
              name="organization"
              onChange={handleChange}
              value={formData.organization}
              placeholder="Организация*"
              error={errors.organization}
              autoComplete={"new-password"}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <Input
              name="surname"
              onChange={handleChange}
              value={formData.surname}
              placeholder="Фамилия*"
              error={errors.surname}
              autoComplete={"new-password"}
            />
            <Input
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email (логин)*"
              error={errors.email}
              autoComplete={"new-password"}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <Input
              name="patronymic"
              onChange={handleChange}
              value={formData.patronymic}
              placeholder="Отчество"
              autoComplete={"new-password"}
            />
            <Input
              name="phone"
              onChange={handleChange}
              value={formData.phone}
              placeholder="Номер телефона*"
              error={errors.phone}
              autoComplete={"new-password"}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="academicTitle"
              onChange={handleChange}
              value={formData.academicTitle}
              placeholder="Ученое звание"
              open={openList === "academicTitle"}
              funOpen={funOpenList}
              divRef={refList[1]}
              list={zwanieList}
              funSelectElement={funSelectedElement}
            />
            <Input
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Придумайте пароль*"
              error={errors.password}
              type="password"
              errorList={errorListPassword}
              setErrorList={setErrorListPassword}
              errorListImgHover={listErrorOnHover}
              errorListImgNoHover={listErrorNoHover}
              imgSrc={lock}
              autoComplete={"new-password"}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="degree"
              onChange={handleChange}
              value={formData.degree}
              placeholder="Степень"
              open={openList === "degree"}
              funOpen={funOpenList}
              divRef={refList[2]}
              list={stepenList}
              funSelectElement={funSelectedElement}
            />
            <Input
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
              placeholder="Повторите пароль*"
              error={errors.confirmPassword}
              type="password"
              imgSrc={lock}
              autoComplete={"new-password"}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="position"
              onChange={handleChange}
              value={formData.position}
              placeholder="Должность*"
              open={openList === "position"}
              funOpen={funOpenList}
              divRef={refList[3]}
              list={doljnostList}
              funSelectElement={funSelectedElement}
              error={errors.position}
            />
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
          <img src="/img/SfeduLogo.svg" alt="Sfedu Logo" />
          Войти через аккаунт @sfedu
        </button>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>Зарегистрироваться</button>
      </div>
      <div className={styles.noAccount}>
        <p>Еще нет аккаунта?</p>
        <p onClick={() => context.setAuthPage("Auth")}>Авторизируйтесь</p>
      </div>
    </section>
  );
}

export default Register;
