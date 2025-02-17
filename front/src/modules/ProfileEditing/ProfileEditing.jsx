import styles from "./ProfileEditing.module.scss";
import profilePhoto from "./../../assets/img/noPhotoLk.svg";
import Input from "../../ui/Input/Input";
import InputList from "../../ui/InputList/InputList";
import { useContext, useEffect, useRef, useState } from "react";
import { stepenList, zwanieList } from "../../utils/Lists/List";
import { useNavigate } from "react-router-dom";
import DataContext from "../../context";
import { useSelector } from "react-redux";
function ProfileEditing() {
  const [openList, setOpenList] = useState("");
  const context = useContext(DataContext);
  const user = useSelector((state) => state.user.user.data);
  console.log("user", user);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    academicTitle: "",
    degree: "",
    post: "",
    organization: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        surname: "",
        patronymic: "",
        academicTitle: "",
        degree: "",
        post: "",
        organization: "",
        email: "",
        number: "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState({
    name: "",
    patronymic: "",
    academicTitle: "",
    degree: "",
    post: "",
    organization: "",
    email: "",
    number: "",
  });

  const inputsData = [
    {
      id: "0",
      name: "Ваше имя*",
      title: "name",
      required: true,
      list: null,
      type: "text",
    },
    {
      id: "1",
      name: "Ваша фамилия*",
      title: "surname",
      required: true,
      list: null,
      type: "text",
    },
    {
      id: "2",
      name: "Ваше отчество",
      title: "patronymic",
      required: false,
      list: null,
      type: "text",
    },
    {
      id: "3",
      name: "Ученое звание*",
      title: "academicTitle",
      required: true,
      list: zwanieList,
      type: "text",
    },
    {
      id: "4",
      name: "Степень*",
      title: "degree",
      required: true,
      list: stepenList,
      type: "text",
    },
    {
      id: "5",
      name: "Должность*",
      title: "post",
      required: true,
      list: null,
      type: "text",
    },
    {
      id: "6",
      name: "Организация*",
      title: "organization",
      required: true,
      list: null,
      type: "text",
    },
    {
      id: "7",
      name: "Email*",
      title: "email",
      required: true,
      list: null,
      type: "email",
    },
    {
      id: "8",
      name: "Номер*",
      title: "number",
      required: true,
      list: null,
      type: "text",
    },
  ];

  const funSelectedElement = (key, value) => {
    //! проверка что такой ключь есть в formData
    if (!formData.hasOwnProperty(key)) {
      return;
    }
    console.log("key", key);
    setErrors({ ...errors, [key]: "" });
    setFormData({ ...formData, [key]: value });
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
      "academicTitle",
      "degree",
      "post",
      "organization",
      "email",
      "forEach",
      "number",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если поле "number", форматируем номер телефона
    const formattedValue = name === "number" ? formatPhoneNumber(value) : value;

    setFormData({ ...formData, [name]: formattedValue });

    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: "" });
  };

  const funOpenList = (param) => {
    if (param === openList) {
      setOpenList("");
    } else {
      setOpenList(param);
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Форма отправлена", formData);
    }
  };
  const navigate = useNavigate();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const refList = [ref1, ref2];
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
    <div className={styles.ProfileEditing}>
      <div className={styles.head}>
        <img className={styles.profilePhoto} src={profilePhoto} alt="img" />
        <button className={styles.btn1}>Загрузить новое фото</button>
        <button className={styles.btn2}>Удалить фото</button>
      </div>
      <div className={styles.container}>
        <div className={styles.boxLeft}>
          {inputsData.map(
            (item, index) =>
              index <= 5 && (
                <div className={styles.item}>
                  {item.list ? (
                    <InputList
                      name={item.title}
                      onChange={handleChange}
                      value={formData[item.title]}
                      placeholder=""
                      open={openList === item.title}
                      funOpen={funOpenList}
                      divRef={refList[index - 3]}
                      list={item.list}
                      labelText={item.name}
                      styleArrow={{ height: "54px", bottom: "25px" }}
                      listStyle={{ transform: "translateY(calc(100% - 26px))" }}
                      inputerrorStyle={{ top: "25px" }}
                      funSelectElement={funSelectedElement}
                      error={errors[item.title]}
                    />
                  ) : (
                    <Input
                      name={item.title}
                      onChange={handleChange}
                      value={formData[item.title]}
                      placeholder=""
                      error={errors[item.title]}
                      labelText={item.name}
                      inputerrorStyle={{ top: "25px" }}
                    />
                  )}
                </div>
              )
          )}
        </div>
        <div className={styles.boxRigth}>
          {inputsData.map(
            (item, index) =>
              index > 5 && (
                <div className={styles.item}>
                  <Input
                    name={item.title}
                    onChange={handleChange}
                    value={formData[item.title]}
                    placeholder={""}
                    labelText={item.name}
                    error={errors[item.title]}
                    inputerrorStyle={{ top: "25px" }}
                  />
                </div>
              )
          )}
          <button className={styles.SaveButton} onClick={() => handleSubmit()}>
            Сохранить изменения
          </button>
          <button
            className={styles.noSaveButton}
            onClick={() => {
              context.setSelectFrameLks("profile");
              navigate("/account/profile");
            }}
          >
            Выйти без сохранения
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditing;
