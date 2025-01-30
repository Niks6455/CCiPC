import { useState } from "react";
import styles from "./AddCoauthor.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import leftArrow from "./../../../assets/img/UI/leftArrow.svg";
import plus from "./../../../assets/img/UI/plus.svg";
import errorList from "./../../../assets/img/UI/errorZnak.svg";
import {
  addSoauthors,
  deleteCoauthor,
  setValueCoauthors,
} from "../../../store/reportCreateSlice/reportCreateSlice";
import InputLabel from "../../../ui/InputLabel/InputLabel";
import trash from "./../../../assets/img/UI/trash.svg";

function AddCoauthor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);

  const inpustType = [
    {
      id: "1",
      label: "Имя соавтора*",
      placeholder: "Имя",
      type: "text",
      key: "name",
    },
    {
      id: "2",
      label: "Фамилия соавтора*",
      placeholder: "Фамилия",
      type: "text",
      key: "surname",
    },
    {
      id: "3",
      label: "Отчество соавтора",
      placeholder: "Отчество",
      type: "text",
      key: "patronymic",
    },
    {
      id: "4",
      label: "Организация*",
      placeholder: "Не заполнено",
      type: "text",
      key: "organization",
    },
    {
      id: "5",
      label: "Email*",
      placeholder: "Email (логин)",
      type: "email",
      key: "email",
    },
    {
      id: "6",
      label: "Номер*",
      placeholder: "+7-900-000-00-00",
      type: "tel",
      key: "phone",
    },
  ];

  const funDeleteCoauthor = (index) => {
    dispatch(deleteCoauthor({ index }));
  };

  const funChangeInput = (index, key, value) => {
    dispatch(setValueCoauthors({ index, key, value }));
  };

  return (
    <div className={styles.AddCoauthor}>
      <h2 className={styles.title}>Соавторы</h2>
      <div className={styles.backImg}>
        <img
          src={leftArrow}
          alt="назад"
          draggable="false"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles.slider}>
        <div
          className={styles.sliderInner}
          style={{
            width: `${report.sliderState}%`,
            transition: "all 0.15s linear",
          }}
        ></div>
      </div>
      {report?.soauthors?.map((soauthtor, index) => (
        <div key={index} className={styles.inputContainer}>
          <div className={styles.deletecoauthor}>
            <button onClick={() => funDeleteCoauthor(index)}>
              <span>Удалить соавтора №{index + 1}</span>
              <img src={trash} alt="удалить" />
            </button>
          </div>
          {inpustType.map((inp) => (
            <div className={styles.inputbox} key={inp.id}>
              <InputLabel
                label={inp.label}
                type={inp.type}
                index={index}
                itemKey={inp.key}
                value={soauthtor[inp.key]}
                funChange={funChangeInput}
                placeholder={inp.placeholder}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        className={styles.addsoaftor}
        onClick={() => dispatch(addSoauthors())}
      >
        <span>Добавить соавтора</span>
        <img src={plus} alt="+" />
      </button>

      <div className={styles.srokContainer}>
        <div className={styles.text}>
          <img src={errorList} alt="img" />
          <span>
            В срок до XX.XX.XХХX необходимо прислать заявку на доклад, а в срок
            до ХХ.ХХ.ХХХХ загрузить статью и экспертное заключение.
          </span>
        </div>
        <button onClick={() => navigate("/Lks/addcoauthor")}>Сохранить</button>
      </div>
    </div>
  );
}

export default AddCoauthor;
