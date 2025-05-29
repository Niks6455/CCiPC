import { useRef, useState, useEffect } from 'react';
import styles from './ConfirmLogin.module.scss';
import logo from './../../assets/img/logo.png';
import confirm from './../../assets/img/confirm.svg';
import errorItem from '@assets/img/UI/error.svg';
import { apiSendConfirm, CheckEmail } from '../../apirequests/apirequests';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useClipboardDigits } from '../../hooks/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setTimer } from '../../store/registrationSlice/registrationSlice';
import { useTranslation } from 'react-i18next';
function ConfirmLogin(props) {
  const { t } = useTranslation('confirmLogin');
  const dispach = useDispatch();
  const navigate = useNavigate();
  const registration = useSelector(state => state.registration);
  const navigete = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']); // Для кода
  const [errorAuth, setErrorAuth] = useState(false);
  const [errors, setErrors] = useState([false, false, false, false, false, false]); // Для ошибок
  const [isButtonActive, setIsButtonActive] = useState(false); // Состояние кнопки
  const inputsRef = useRef([]);

  // Таймер запускается при загрузке компонента
  useEffect(() => {
    let interval;
    if (registration?.timer > 0) {
      interval = setInterval(() => {
        // setTimer(prev => prev - 1);
        dispach(setTimer(registration?.timer - 1));
      }, 1000);
    } else {
      setIsButtonActive(true); // Делаем кнопку активной
    }
    return () => clearInterval(interval); // Очищаем таймер при размонтировании
  }, [registration?.timer]);

  const text = useClipboardDigits();
  useEffect(() => {
    const digits = text.match(/^\d{6}$/); // Проверяем, что текст состоит из 6 цифр
    if (digits) {
      setCode(digits[0].split('').map(digit => digit));
    }
  }, [text]);
  // apiSendConfirm

  const handleResendCode = () => {
    if (!isButtonActive) return;
    apiSendConfirm({
      email: registration?.data?.email,
    }).then(res => {
      if (res?.status === 200) {
        dispach(setTimer(60)); // Сбрасываем таймер
        setIsButtonActive(false); // Делаем кнопку неактивной
      }
    });
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
      return;
    }
    const fullCode = code.join('');
    const data = {
      email: registration?.data?.email,
      code: fullCode,
      type: 0,
    };
    CheckEmail(data).then(resp => {
      if (resp?.status === 200) {
        setErrorAuth(false);
        props.funGetAllApi();
        navigete('/');
      } else {
        setErrorAuth(true);
      }
    });
  };

  return (
    <section className={styles.ConfirmLogin}>
      <div className={styles.ConfirmLoginLogo}>
        <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      </div>
      <div className={styles.ConfirmLoginTitle}>
        <p>{t('par1')}</p>
      </div>
      <div className={styles.ConfirmLoginGalca}>
        <div>
          <div className={styles.ConfirmLoginGalcaImg}>
            <img src={confirm} alt="Confirm Icon" />
          </div>
          <p>
            {t('par2')} <span className={styles.mail}>{registration?.data?.email}</span> {t('par3')}
          </p>
        </div>
      </div>
      <div className={styles.code}>
        <p>{t('par4')}</p>
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
            {t('par5')}
          </button>
          <p className={styles.CodeTimer}>
            {registration?.timer > 0 ? `0:${registration?.timer}` : ''}
          </p>
        </div>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>{t('par6')}</button>
        <AnimatePresence>
          {errorAuth && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.error_auth}
            >
              <img src={errorItem} alt="❗" />
              <span>{t('par7')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ConfirmLogin;
