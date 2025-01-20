import React, { useContext, useEffect, useRef, useState } from "react";
import Input from "../../ui/Input/Input";
import styles from "./Register.module.scss";
import DataContext from "../../context";
import InputList from "../../ui/InputList/InputList";

function Register() {
  const context = useContext(DataContext);
  const [openList, setOpenList] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    zwanie: "",
    stepen: "",
    doljnost: "",
    oraganization: "",
    login: "",
    number: "",
    password: "",
    confirmPassword: "",
    napravlenieKonferencii: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    doljnost: "",
    login: "",
    password: "",
    confirmPassword: "",
    number: "",
  });

  const zwanieList = [
    { id: "1", text: "Не выбрано" },
    { id: "2", text: "Профессор" },
    { id: "3", text: "Кандидат наук" },
    { id: "4", text: "Академик" },
    { id: "5", text: "Корреспондент академии наук" },
    { id: "6", text: "Доктор наук" },
    { id: "7", text: "Доцент" },
    // { id: "8", text: "Другое..." },
  ];

  const stepenList = [
    { id: "1", text: "Не выбрано" },
    { id: "2", text: "Кандидат наук" },
    { id: "3", text: "Доктор наук" },
  ];

  const doljnostList = [
    { id: "1", text: "Не выбрано" },
    { id: "2", text: "Студент" },
    { id: "3", text: "Лаборант" },
    { id: "4", text: "Старший преподаватель" },
    { id: "5", text: "Профессор" },
    { id: "6", text: "Заведующий кафедрой" },
  ];

  const napravlenieKonferenciiList = [
    { id: "1", text: "Название 1" },
    { id: "2", text: "Название 2" },
    { id: "3", text: "Название 3" },
    { id: "4", text: "Название 4" },
    { id: "5", text: "Название 5" },
    { id: "6", text: "Название 6" },
  ];

  const funSelectedElement = (key, value) => {
    //! проверка что такой ключь есть в formData
    if (!formData.hasOwnProperty(key)) {
      return;
    }
    console.log("key", key);
    setFormData({ ...formData, [key]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если поле "number", форматируем номер телефона
    const formattedValue = name === "number" ? formatPhoneNumber(value) : value;

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
      "doljnost",
      "oraganization",
      "login",
      "number",
      "password",
      "confirmPassword",
    ].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Поле обязательно для заполнения";
        isValid = false;
      }
    });

    // Проверка корректности Email
    if (formData.login && !/\S+@\S+\.\S+/.test(formData.login)) {
      newErrors.login = "Некорректный Email";
      isValid = false;
    }

    // Проверка номера телефона
    if (
      formData.number &&
      !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.number)
    ) {
      newErrors.number = "Номер должен быть в формате +7 (XXX) XXX-XX-XX";
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
    }
  };

  const funOpenList = (param) => {
    if (param === openList) {
      setOpenList("");
    } else {
      setOpenList(param);
    }
  };

  const refCalendar = useRef(null);
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (refCalendar.current && !refCalendar.current.contains(event.target)) {
  //         funOpenList("");
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, []);

  return (
    <section className={styles.Login}>
      <div className={styles.LoginLogo}>
        <img src="/img/logo.svg" alt="Logo" />
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
            />
            <Input
              name="oraganization"
              onChange={handleChange}
              value={formData.oraganization}
              placeholder="Организация*"
              error={errors.oraganization}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <Input
              name="surname"
              onChange={handleChange}
              value={formData.surname}
              placeholder="Фамилия*"
              error={errors.surname}
            />
            <InputList
              name="napravlenieKonferencii"
              onChange={handleChange}
              value={formData.napravlenieKonferencii}
              placeholder="Направление конференции"
              open={openList === "napravlenieKonferencii"}
              funOpen={funOpenList}
              divRef={refCalendar}
              list={napravlenieKonferenciiList}
              funSelectElement={funSelectedElement}
              error={errors.napravlenieKonferencii}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <Input
              name="patronymic"
              onChange={handleChange}
              value={formData.patronymic}
              placeholder="Отчество"
            />
            <Input
              name="login"
              onChange={handleChange}
              value={formData.login}
              placeholder="Email (логин)*"
              error={errors.login}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="zwanie"
              onChange={handleChange}
              value={formData.zwanie}
              placeholder="Ученое звание"
              open={openList === "zwanie"}
              funOpen={funOpenList}
              divRef={refCalendar}
              list={zwanieList}
              funSelectElement={funSelectedElement}
            />
            <Input
              name="number"
              onChange={handleChange}
              value={formData.number}
              placeholder="Номер телефона*"
              error={errors.number}
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="stepen"
              onChange={handleChange}
              value={formData.stepen}
              placeholder="Степень"
              open={openList === "stepen"}
              funOpen={funOpenList}
              divRef={refCalendar}
              list={stepenList}
              funSelectElement={funSelectedElement}
            />
            <Input
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Пароль*"
              error={errors.password}
              type="password"
            />
          </div>
          <div className={styles.inputInnerBlock}>
            <InputList
              name="doljnost"
              onChange={handleChange}
              value={formData.doljnost}
              placeholder="Должность*"
              open={openList === "doljnost"}
              funOpen={funOpenList}
              divRef={refCalendar}
              list={doljnostList}
              funSelectElement={funSelectedElement}
              error={errors.doljnost}
            />
            <Input
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
              placeholder="Повторите пароль*"
              error={errors.confirmPassword}
              type="password"
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
