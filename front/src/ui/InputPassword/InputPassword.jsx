import { useEffect, useState } from "react";
import styles from "./InputPassword.module.scss";
import galka from "./../../assets/img/UI/galka.svg";
import krest from "./../../assets/img/UI/krest.svg";
import lock from "./../../assets/img/UI/lock.svg";

function InputPassword(props) {
  const [errorListShow, setErrorListShow] = useState(false);
  //! при наведении на img множественных ошибок
  const funOpenListErrors = () => {
    setErrorListShow(true);
  };
  const funClouseListErrors = () => {
    setErrorListShow(false);
  };

  //! функция проверки по множеству ошибок
  const selectErrors = (e) => {
    if (props.errorList) {
      const value = e.target.value;
      const updatedLists = props.errorList?.map((fun) =>
        fun.functionCheck(value)
      ); // Получаем массив обновленных списков
      console.log("updatedLists", updatedLists);
      const combinedList = [...props.errorList].map((el) => {
        return {
          ...el,
          done: updatedLists.find((item) => item.id === el.id)?.done,
        };
      });
      props.setErrorList(combinedList); // Обновляем состояние с новым объединенным списком
    }
  };

  useEffect(() => {
    console.log("props.errorList", props.errorList);
  }, [props.errorList]);

  return (
    <div className={styles.Input}>
      <img className={styles.leftImg} src={lock} alt={props?.name} />
      {/* //! при множественных ошибках выводим лист */}
      {props.errorList && (
        <img
          onMouseEnter={funOpenListErrors}
          onMouseLeave={funClouseListErrors}
          className={styles.errorListImg}
          src={
            errorListShow
              ? props?.errorListImgHover
              : props?.errorListImgNoHover
          }
          alt="!"
        />
      )}

      {/* лсит множественных ошибок */}
      {errorListShow && (
        <div className={styles.errorsListContainer}>
          <ul>
            {props.errorList?.map((el) => (
              <li key={el.id}>
                {el.done ? (
                  <img src={galka} alt="✔️" />
                ) : (
                  <img src={krest} alt="❌" />
                )}

                {el.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.labelText && (
        <div className={styles.labelText}>
          <span>{props.labelText}</span>
        </div>
      )}
      {props.rigthImg && (
        <img
          onClick={props.rigthImgClick ? props.rigthImgClick : () => {}}
          className={styles.rigthImg}
          src={
            props.rigthImgActiveAction ? props.rigthImg : props.rigthImgActive
          }
          alt="показать пароль"
        />
      )}
      <input
        name={props?.name}
        onChange={(e) => {
          props?.onChange(e);
          selectErrors(e);
        }}
        value={props?.value}
        placeholder={props?.placeholder}
        className={props?.error ? styles.errorInput : ""}
        type={props.type || "text"}
        autoComplete={props.autoComplete ? props.autoComplete : "on"}
      />
      {props?.value && !props?.error && (
        <div className={styles.placeholderClose}>{props?.placeholder}</div>
      )}
      {props?.error && <div className={styles.errorText}>{props?.error}</div>}
    </div>
  );
}

export default InputPassword;
