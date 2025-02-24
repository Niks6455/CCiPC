import styles from "./ProfileEditing.module.scss";
import profilePhoto from "./../../assets/img/noPhotoLk.svg";
import Input from "../../ui/Input/Input";
import InputList from "../../ui/InputList/InputList";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../../context";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUser } from "../../apirequests/apirequests";
import { disEditUser, setEditUser } from "../../store/userSlice/user.Slice";
import { inputsData } from "./data";
import cameraIcon from "@assets/img/UI/camera.svg";
import veselov from "./veselov.png";

function ProfileEditing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const refList = [ref1, ref2];

  const [openList, setOpenList] = useState("");
  const context = useContext(DataContext);
  const formData = useSelector((state) => state.user.editUser.data);
  const user = useSelector((state) => state.user.user.data);

  console.log("formData", formData);

  useEffect(() => {
    if (!formData.name) {
      dispatch(disEditUser());
    }
  }, [user]);

  const [errors, setErrors] = useState({
    name: "",
    patronymic: "",
    academicTitle: "",
    degree: "",
    position: "",
    organization: "",
    email: "",
    number: "",
  });

  const funSelectedElement = (key, value) => {
    //! проверка что такой ключь есть в formData
    if (!formData.hasOwnProperty(key)) {
      return;
    }
    console.log("key", key);
    setErrors({ ...errors, [key]: "" });
    // setFormData({ ...formData, [key]: value });
    dispatch(setEditUser({ key, value }));
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
      "position",
      "organization",
      "email",
      "phone",
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
    console.log("newErrors", newErrors);
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Если поле "phone", форматируем номер телефона
    const formattedValue = name === "phone" ? formatPhoneNumber(value) : value;

    // setFormData({ ...formData, [name]: formattedValue });
    dispatch(setEditUser({ key: name, value: formattedValue }));

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
      apiUpdateUser(formData).then((res) => {
        console.log("res", res);
        if (res?.status === 200) {
          console.log("Форма отправлена", formData);
        }
      });
    } else {
      console.log("Валидация не прошла");
    }
  };

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
        <div className={styles.profilePhoto}>
          <div className={styles.hover_bg}>
            <img src={cameraIcon} alt="Открыть" />
          </div>
          <img className={styles.photo_heve} src={veselov} alt="img" />
          {/* <img src={profilePhoto} alt="img" /> */}
        </div>
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
          <button
            type="button"
            className={styles.SaveButton}
            onClick={handleSubmit}
          >
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
