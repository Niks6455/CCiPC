import { useEffect, useRef, useState } from 'react';
import styles from './InputPassword.module.scss';
import galka from './../../assets/img/UI/galka.svg';
import krest from './../../assets/img/UI/krest.svg';
import lock from './../../assets/img/UI/lock.svg';
import MobileDetect from 'mobile-detect';

function InputPassword(props) {
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = md.mobile() !== null;
  const isTablet = md.tablet() !== null;
  const [errorListShow, setErrorListShow] = useState(false);
  const errorImgRef = useRef(null);

  //! при наведении на img множественных ошибок
  const funOpenListErrors = () => {
    if (isMobile || isTablet) {
      return;
    }
    setErrorListShow(true);
  };
  const funClouseListErrors = () => {
    if (isMobile || isTablet) {
      return;
    }
    setErrorListShow(false);
  };

  const funClickListErrors = () => {
    if (isMobile || isTablet) {
      setErrorListShow(!errorListShow);
    }
  };

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

  return (
    <div className={styles.Input}>
      <img className={styles.leftImg} src={lock} alt={props?.name} />
      {/* //! при множественных ошибках выводим лист */}
      {props.errorList && (
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
      {errorListShow && (
        <div className={styles.errorsListContainer}>
          <ul>
            {props.errorList?.map(el => (
              <li key={el.id}>
                {el.done ? <img src={galka} alt="✔️" /> : <img src={krest} alt="❌" />}

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
          src={props.rigthImgActiveAction ? props.rigthImg : props.rigthImgActive}
          alt="показать пароль"
        />
      )}
      <input
        name={props?.name}
        onChange={e => {
          props?.onChange(e);
          selectErrors(e);
        }}
        value={props?.value}
        placeholder={props?.placeholder}
        className={props?.error ? styles.errorInput : ''}
        type={props.type || 'text'}
        autoComplete={props.autoComplete ? props.autoComplete : 'on'}
      />
      {props?.value && !props?.error && (
        <div className={styles.placeholderClose}>{props?.placeholder}</div>
      )}
      {props?.error && <div className={styles.errorText}>{props?.error}</div>}
    </div>
  );
}

export default InputPassword;
