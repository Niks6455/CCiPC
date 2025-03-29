import { useState } from 'react';
import styles from './Input.module.scss';
import galka from './../../assets/img/UI/galka.svg';
import krest from './../../assets/img/UI/krest.svg';

function Input(props) {
  const [errorListShow, setErrorListShow] = useState(false);
  //! при наведении на img множественных ошибок
  const funOpenListErrors = () => {
    setErrorListShow(true);
  };
  const funClouseListErrors = () => {
    setErrorListShow(false);
  };

  //! функция проверки по множеству ошибок
  const selectErrors = e => {
    if (props.errorList) {
      const value = e.target.value;
      const updatedLists = props.errorList?.map(fun => fun.functionCheck(value)); // Получаем массив обновленных списков
      const combinedList = [...props.errorList].map(el => {
        return {
          ...el,
          done: updatedLists.find(item => item.id === el.id)?.done,
        };
      });
      props.setErrorList(combinedList); // Обновляем состояние с новым объединенным списком
    }
  };

  const getListErrorContainer = () => {
    return (
      <div
        className={`${styles.errorsListContainer} ${
          props.labelText ? styles.erroListLabelContainer : ''
        }`}
      >
        <ul>
          {props.errorList?.map(el => (
            <li key={el.id}>
              {el.done ? <img src={galka} alt="✔️" /> : <img src={krest} alt="❌" />}

              {el.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.Input}>
      {!props?.value && props?.imgSrc && (
        <img className={styles.leftImg} src={props?.imgSrc} alt={props?.name} />
      )}
      {/* //! при множественных ошибках выводим лист */}
      {props.errorList && !props.labelText && (
        <img
          onMouseEnter={funOpenListErrors}
          onMouseLeave={funClouseListErrors}
          className={styles.errorListImg}
          src={errorListShow ? props?.errorListImgHover : props?.errorListImgNoHover}
          alt="!"
        />
      )}

      {/* лсит множественных ошибок */}
      {errorListShow && !props.labelText && getListErrorContainer()}
      {props.labelText && (
        <div className={styles.labelText}>
          <span>{props.labelText}</span>
          {props.errorList && props.labelText && (
            <img
              onMouseEnter={funOpenListErrors}
              onMouseLeave={funClouseListErrors}
              className={styles.errorListLabel}
              src={errorListShow ? props?.errorListImgHover : props?.errorListImgNoHover}
              alt="!"
            />
          )}
          {errorListShow && props.labelText && getListErrorContainer()}
        </div>
      )}
      {props.rigthImg && (
        <img
          onClick={props.rigthImgClick ? props.rigthImgClick : () => {}}
          className={styles.rigthImg}
          src={props.rigthImgActiveAction ? props.rigthImgActive : props.rigthImg}
          alt="показать пароль"
        />
      )}
      <input
        name={props?.name}
        onChange={e => {
          props?.onChange(e);
          selectErrors(e);
        }}
        disabled={props?.disabled}
        value={props?.value}
        placeholder={props?.placeholder}
        className={`${props?.error ? styles.errorInput : ''} ${props?.imgSrc && !props?.value ? styles.padding_left : ''}`}
        type={props.type || 'text'}
        autoComplete={props.autoComplete ? props.autoComplete : 'on'}
      />
      {props?.value && !props?.error && (
        <div className={styles.placeholderClose}>{props?.placeholder}</div>
      )}
      {props?.error && (
        <div
          name="error"
          className={styles.errorText}
          style={props.inputerrorStyle ? props.inputerrorStyle : {}}
        >
          {props?.error}
        </div>
      )}
    </div>
  );
}

export default Input;
