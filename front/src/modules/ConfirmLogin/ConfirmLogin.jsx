import { useContext, useRef, useState, useEffect } from 'react';
import styles from './ConfirmLogin.module.scss';
import DataContext from '../../context';
import logo from './../../assets/img/logo.png';
import confirm from './../../assets/img/confirm.svg';
import errorItem from '@assets/img/UI/error.svg';
import { CheckEmail } from '../../apirequests/apirequests';
import { AnimatePresence, motion } from 'framer-motion';
function ConfirmLogin() {
  const context = useContext(DataContext);
  const [code, setCode] = useState(['', '', '', '', '', '']); // Для кода
  const [errorAuth, setErrorAuth] = useState(false);
  const [errors, setErrors] = useState([false, false, false, false, false, false]); // Для ошибок
  const [timer, setTimer] = useState(59); // Таймер в секундах
  const [isButtonActive, setIsButtonActive] = useState(false); // Состояние кнопки
  const inputsRef = useRef([]);

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

  const handleResendCode = () => {
    if (!isButtonActive) return;

    console.log('Код повторно отправлен');
    setTimer(60); // Сбрасываем таймер
    setIsButtonActive(false); // Делаем кнопку неактивной
  };

  const handleChange = (index, value) => {
    setErrorAuth(false);

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
      console.log('Некоторые поля пустые');
      return;
    }
    const fullCode = code.join('');
    const data = {
      email: context?.mailValue || sessionStorage.getItem('confirmEmail'),
      code: fullCode,
      type: 0,
    };
    CheckEmail(data).then(resp => {
      if (resp?.status === 200) {
        context?.setAuthPage('Auth');
        setErrorAuth(false);
      } else {
        setErrorAuth(true);
      }
    });
    console.log('Код отправлен на сервер:', fullCode);
  };

  return (
    <section className={styles.ConfirmLogin}>
      <div className={styles.ConfirmLoginLogo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.ConfirmLoginTitle}>
        <p>Подтвердите адрес электронной почты</p>
      </div>
      <div className={styles.ConfirmLoginGalca}>
        <div>
          <div className={styles.ConfirmLoginGalcaImg}>
            <img src={confirm} alt="Confirm Icon" />
          </div>
          <p>
            На адрес вашей электронной почты{' '}
            <span className={styles.mail}>{context?.mailValue}</span> отправлено письмо с
            проверочным кодом. Введите полученный код в поле ниже и нажмите "Продолжить".
          </p>
        </div>
      </div>
      <div className={styles.code}>
        <p>Проверочный код:</p>
      </div>
      <div className={styles.codeInput}>
        <div className={styles.codeInputInner}>
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength={1}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
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
        <button onClick={handleSubmit}>Войти</button>
        <AnimatePresence>
          {errorAuth && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.error_auth}
            >
              <img src={errorItem} alt="❗" />
              <span>Ошибка подтверждения</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ConfirmLogin;
