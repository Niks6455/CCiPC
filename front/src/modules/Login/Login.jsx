import { useEffect, useState } from 'react';
import Input from '../../ui/Input/Input';
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/img/logo.png';
import sfeduLogo from './../../assets/img/SfeduLogo.svg';
import {
  apiLoginGetCodeSfedu,
  apiSendConfirm,
  LoginFunc,
  LoginFuncSfedu,
} from '../../apirequests/apirequests';
import glaz from '@assets/img/UI/glaz.svg';
import noglaz from '@assets/img/UI/noglaz.svg';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import { useTranslation } from 'react-i18next';

function Login(props) {
  const { t } = useTranslation('login');

  const [passActionFirst, setPassActionFirst] = useState('password');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [openModal, setOpenModal] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t('enterEmail');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('incorrectEmail');
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = t('enterPassword');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      LoginFunc(formData).then(data => {
        if (data?.status === 200) {
          navigate('/');
          props.funGetAllApi();
          return;
        } else {
          if (data?.status === 500) {
            apiSendConfirm({ email: formData.email }).then(res => {
              if (res?.status === 200) {
                navigate('/login/confirmLogin');
              }
            });
          } else {
            if (data?.response?.data?.message === 'You do not have access to this action') {
              apiSendConfirm({ email: formData.email }).then(res => {
                if (res?.status === 200) {
                  navigate('/login/confirmLogin');
                }
              });
              return;
            }
            if (data?.response?.data?.errNum === 201) {
              setErrors({ email: t('errorLogin') });
              return;
            }
            if (data?.response?.data?.errNum === 204) {
              setErrors({
                password: t('errorPassword'),
              });
              return;
            } else {
              setOpenModal(true);
            }
          }
        }
      });
    }
  };

  const clickRigthImg = name => {
    if (name === 'password') {
      setPassActionFirst('text');
    } else {
      setPassActionFirst('password');
    }
  };

  //! вызываем запрос для получения кода который отправил на бэк
  const funSfeduAuth = () => {
    apiLoginGetCodeSfedu();
  };

  //! проверяем если в url есть код значит авторизация идет через сфеду
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
      LoginFuncSfedu(code).then(res => {
        if (res?.status === 200) {
          navigate('/');
          props.funGetAllApi();
        } else {
          setOpenModal(true);
        }
      });
    }
  }, [navigate]);

  return (
    <section className={styles.Login}>
      <ErrorModal title={t('errorAuth')} open={openModal} close={setOpenModal} />
      <div className={styles.LoginLogo}>
        <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      </div>
      <div className={styles.LoginTitle}>
        <p>{t('title')}</p>
        <p>{t('h2')}</p>
      </div>
      <div className={styles.input}>
        <div className={styles.inputInner}>
          <Input
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
            imgSrc="/img/login.svg"
            error={errors.email}
          />
          <Input
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder={t('password')}
            imgSrc="/img/password.svg"
            error={errors.password}
            type={passActionFirst}
            rigthImg={glaz}
            rigthImgActive={noglaz}
            rigthImgActiveAction={passActionFirst === 'text'}
            rigthImgClick={() => clickRigthImg(passActionFirst)}
            autoComplete={'off'}
          />
          <div className={styles.forgetPassword}>
            <p
              onClick={() => {
                navigate('/recoverpassword');
              }}
            >
              {t('forgot')}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.Maybe}>
        <div className={styles.MaybeInner}>
          <div className={styles.lineOne}></div>
          <div className={styles.CentralContainer}>
            <p>{t('or')}</p>
          </div>
          <div className={styles.lineTwo}></div>
        </div>
      </div>
      <div className={styles.loginButtonSfedu} onClick={funSfeduAuth}>
        <button>
          <img src={sfeduLogo} />
          {t('sfedu')}
        </button>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>{t('login')}</button>
      </div>
      <div className={styles.noAccount}>
        <p>{t('noAccount')}</p>
        <p onClick={() => navigate('/login/registration')} className={styles.link}>
          {t('register')}
        </p>
      </div>
    </section>
  );
}

export default Login;
