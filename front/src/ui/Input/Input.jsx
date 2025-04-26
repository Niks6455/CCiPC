import { useEffect, useRef, useState } from 'react';
import styles from './Input.module.scss';
import galka from './../../assets/img/UI/galka.svg';
import krest from './../../assets/img/UI/krest.svg';
import MobileDetect from 'mobile-detect';

function Input(props) {
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = md.mobile() !== null;
  const isTablet = md.tablet() !== null;
  const errorImgRef = useRef(null);
  const [errorListShow, setErrorListShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = event => {
      if (errorImgRef.current && !errorImgRef.current.contains(event.target)) {
        setErrorListShow(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //! при наведении на img множественных ошибок

  const funClickListErrors = () => {
    if (isMobile || isTablet) {
      setErrorListShow(!errorListShow);
    }
  };
  const funOpenListErrors = () => {
    if (isMobile || isTablet) return;

    setErrorListShow(true);
  };
  const funClouseListErrors = () => {
    if (isMobile || isTablet) return;
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
          ref={errorImgRef}
          onMouseEnter={funOpenListErrors}
          onMouseLeave={funClouseListErrors}
          onClick={funClickListErrors}
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
              ref={errorImgRef}
              onMouseEnter={funOpenListErrors}
              onMouseLeave={funClouseListErrors}
              onClick={funClickListErrors}
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
        readOnly={props.readOnly || false}
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
