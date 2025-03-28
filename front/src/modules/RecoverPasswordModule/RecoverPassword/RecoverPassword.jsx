import { useContext, useRef, useState, useEffect } from 'react';
import styles from './RecoverPassword.module.scss';
import DataContext from '../../../context';
import logo from '@assets/img/logo.png';
import confirm from '@assets/img/confirm.svg';
import errorLogo from '@assets/img/UI/error.svg';
import glaz from '@assets/img/UI/glaz.svg';
import noglaz from '@assets/img/UI/noglaz.svg';
import InputPassword from '../../../ui/InputPassword/InputPassword';
import listErrorNoHover from '@assets/img/UI/listErrorNoActive.svg';
import listErrorOnHover from '@assets/img/UI/listError.svg';
import { funCapitalLetter, funDigit, funEightSymbols } from '@utils/functions/PasswordValidation';
import { useNavigate } from 'react-router-dom';
import { apiPasswordRecovery, apiSandReset, CheckEmail } from '../../../apirequests/apirequests';
import { useSelector } from 'react-redux';

function RecoverPassword() {
  //! востановление по почте true по телефону false
  const [isRecoverType, setIsRecoverType] = useState(true);
  const [email, setEmail ] = useState();
  const store = useSelector(store => store.user);

  const context = useContext(DataContext);
  const [code, setCode] = useState(['', '', '', '', '', '']); // Для кода
  const [codStatus, setCodStatus] = useState(true); // статус ошибки (код неверный)
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [errors, setErrors] = useState([false, false, false, false, false, false]); // Для ошибок
  const [timer, setTimer] = useState(59); // Таймер в секундах
  const [isButtonActive, setIsButtonActive] = useState(false); // Состояние кнопки
  const inputsRef = useRef([]);

  const [inputTypes, setInputTypes] = useState({
    newpassword: 'password',
    rewnewpassword: 'password',
  });

  const [formData, setFormData] = useState({
    newpassword: '',
    rewnewpassword: '',
  });

  const [errorsPassword, setErrorsPassword] = useState({
    newpassword: '',
    rewnewpassword: '',
  });

  const navigate = useNavigate();

  const [errorListPassword, setErrorListPassword] = useState([
    {
      id: '0',
      text: 'Не менее 8 символов',
      done: false,
      functionCheck: funEightSymbols,
    },
    {
      id: '1',
      text: 'Не менее 1 заглавной буквы',
      done: false,
      functionCheck: funCapitalLetter,
    },
    {
      id: '2',
      text: 'Не менее 1 цифры',
      done: false,
      functionCheck: funDigit,
    },
  ]);

  // Таймер запускается при загрузке компонента
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsButtonActive(true); // Делаем кнопку активной
    }
    return () => clearInterval(interval); // Очищаем таймер при размонтировании
  }, [timer]);

  useEffect(()=>{
    setEmail(store.emailSend || sessionStorage.getItem('confirmEmail'));
  },[])

  const handleResendCode = () => {
    if (!isButtonActive) return;
    const data = {
      email: email || localStorage.getItem('confirmEmail'),
    };
    apiSandReset(data).then(res => {
      if (res?.status === 200) {
        setTimer(60); 
        setIsButtonActive(false); 
      } 
    });
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  
    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);
  
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };
  

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const newErrors = code.map(digit => digit === '');
    setErrors(newErrors);
    if (newErrors.some(error => error)) {
      return;
    }
    const fullCode = code.join('');
    //! если код не совпал на сервере
    const data = {
      email: email,
      code: fullCode,
      type: 1,
    };
    CheckEmail(data).then(res => {
      if (res?.status === 200) {
        setCodStatus(true);
        setCodeConfirmed(true);
      } else {
        setCodStatus(false);
      }
    });
  };

  // const funRetype = () => {
  //   setIsRecoverType(!isRecoverType);
  //   handleResendCode();
  // };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    // Проверка обязательных полей
    ['newpassword', 'rewnewpassword'].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Поле обязательно для заполнения';
        isValid = false;
      }
    });

    // Проверка совпадения паролей
    if (formData.newpassword !== formData.rewnewpassword) {
      newErrors.newpassword = 'Пароли не совпадают';
      isValid = false;
    }

    if (errorListPassword.find(el => !el.done)) {
      newErrors.newpassword = 'Некорректный пароль';
      isValid = false;
    }

    setErrorsPassword(newErrors);
    return isValid;
  };

  const handleSubmitPassword = () => {
    if (validate()) {
      const fullCode = code.join('');
      const data = {
        code: fullCode,
        email: email,
        newPassword: formData.newpassword,
        repeatPassword: formData.rewnewpassword,
      };
      apiPasswordRecovery(data).then(res => {
        if (res?.status === 200) {
          navigate('/login/authorization');
        }
      });
    }
  };

  const clickRigthImg = name => {
    if (inputTypes[name] === 'password') {
      setInputTypes({ ...inputTypes, [name]: 'text' });
    } else {
      setInputTypes({ ...inputTypes, [name]: 'password' });
    }
  };

  const handleChangePassword = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: '' });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim(); 
    if (!/^\d{6}$/.test(paste)) return; 
  
    const newCode = paste.split('');
    setCode(newCode); 
  
    inputsRef.current[5]?.focus();
  };
  
  

  return (
    <div className={styles.ConfirmLogin}>
      {!codeConfirmed ? (
        <>
          <div className={styles.ConfirmLoginLogo}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={styles.ConfirmLoginTitle}>
            <p>Введите код для восстановления пароля</p>
          </div>
          <div className={styles.ConfirmLoginGalca}>
            <div>
              <div className={styles.ConfirmLoginGalcaImg}>
                <img src={confirm} alt="Confirm Icon" />
              </div>
              {isRecoverType ? (
                <p className={styles.ConfirmLoginGalcaText}>
                  На адрес вашей электронной почты{' '}
                  <span className={styles.mail}>{context?.mailValue || email || store.emailSend}</span> отправлено
                  письмо с проверочным кодом. Введите полученный код в поле ниже и нажмите
                  “Продолжить”.
                </p>
              ) : (
                <p className={styles.ConfirmLoginGalcaText}>
                  На номер вашего телефона{' '}
                  <span className={styles.mail}>+{context?.numberValue}</span> отправлено сообщение
                  с проверочным кодом. Введите полученный код в поле ниже и нажмите “Продолжить”.
                </p>
              )}
            </div>
          </div>
          {/* <div className={styles.netDostupa}>
            <p onClick={funRetype}>
              {isRecoverType
                ? "У меня нет доступа к электронной почте"
                : "Вернуться к восстановлению пароля через электронную почту"}
            </p>
          </div> */}
          <div className={styles.code}>
            <p>Проверочный код:</p>
          </div>
          <div className={styles.codeInput}>
            <div className={styles.codeInputInner}>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit} // Должно быть digit, а не code[0]
                maxLength={1}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={el => (inputsRef.current[index] = el)}
                className={errors[index] ? styles.error : ''}
              />
            ))}
            </div>
          </div>
          <div className={styles.CodeSubmit}>
            <div className={styles.CodeSubmitCode}>
              <button
                onClick={handleResendCode}
                style={{
                  color: isButtonActive ? '#006D49' : '#858B89',
                  cursor: isButtonActive ? 'pointer' : 'not-allowed',
                }}
                disabled={!isButtonActive}
              >
                Повторно выслать код
              </button>
              <p className={styles.CodeTimer}>{timer > 0 ? `0:${timer}` : ''}</p>
            </div>
          </div>
          <div className={styles.submitButton}>
            <button onClick={handleSubmit}>Продолжить</button>
            {!codStatus && (
              <div className={styles.errorstatus}>
                <img src={errorLogo} alt="" />
                <p>Ошибка подтверждения</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.passwordContainer}>
          <div className={styles.ConfirmLoginLogo}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={styles.ConfirmLoginTitle}>
            <p>Восстановление пароля</p>
          </div>
          <div className={styles.newPasseordText}>
            <p>Введите свой новый пароль.</p>
          </div>
          <div className={styles.InputContainer}>
            <div className={styles.InputBox}>
              <InputPassword
                name={'newpassword'}
                onChange={handleChangePassword}
                value={formData.newpassword}
                placeholder="Придумайте пароль"
                error={errorsPassword.newpassword}
                setErrorList={setErrorListPassword}
                errorListImgHover={listErrorOnHover}
                errorListImgNoHover={listErrorNoHover}
                errorList={errorListPassword}
                type={inputTypes.newpassword}
                rigthImg={glaz}
                rigthImgActive={noglaz}
                rigthImgActiveAction={inputTypes.newpassword === 'text'}
                rigthImgClick={() => clickRigthImg('newpassword')}
                autoComplete={'off'}
              />
            </div>
            <div className={styles.InputBox}>
              <InputPassword
                name={'rewnewpassword'}
                onChange={handleChangePassword}
                value={formData.rewnewpassword}
                placeholder="Повторите пароль"
                errorList={errorListPassword}
                setErrorList={setErrorListPassword}
                errorListImgHover={listErrorOnHover}
                errorListImgNoHover={listErrorNoHover}
                error={errorsPassword.rewnewpassword}
                type={inputTypes.rewnewpassword}
                rigthImg={glaz}
                rigthImgActive={noglaz}
                rigthImgActiveAction={inputTypes.rewnewpassword === 'text'}
                rigthImgClick={() => clickRigthImg('rewnewpassword')}
                autoComplete={'off'}
              />
            </div>
          </div>
          <div className={styles.submitButtonPassword}>
            <button onClick={handleSubmitPassword}>Продолжить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecoverPassword;
