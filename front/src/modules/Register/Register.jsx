import React, { useContext, useEffect, useRef, useState } from 'react';
import Input from '../../ui/Input/Input';
import styles from './Register.module.scss';
import DataContext from '../../context';
import logo from './../../assets/img/logo.png';
import InputList from '../../ui/InputList/InputList';
import listErrorNoHover from './../../assets/img/UI/listErrorNoActive.svg';
import listErrorOnHover from './../../assets/img/UI/listError.svg';
import lock from './../../assets/img/UI/lock.svg';
import { doljnostList, stepenList, zwanieList } from '../../utils/Lists/List';
import {
  funCapitalLetter,
  funDigit,
  funEightSymbols,
  funSpecialSymbol,
} from '../../utils/functions/PasswordValidation';
import { apiRegister } from '../../apirequests/apirequests';
import {
  capitalizeFirstLetter,
  formatPhoneNumber,
  validateFIO,
  validateLength,
} from '../../utils/functions/Validations';
import glaz from '@assets/img/UI/glaz.svg';
import noglaz from '@assets/img/UI/noglaz.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetData, setDataKey } from '../../store/registrationSlice/registrationSlice';

function Register() {
  const dispach = useDispatch();
  const registration = useSelector(state => state.registration);
  const context = useContext(DataContext);
  const [openList, setOpenList] = useState('');
  const [passActionFirst, setPassActionFirst] = useState('password');
  const [passActionSecond, setPassActionSecond] = useState('password');

  //! При первом рендере сбрасываем данные
  useEffect(() => {
    dispach(resetData());
  }, []);

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    position: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

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
    {
      id: '3',
      text: 'Не менее 1 спецсимвола',
      done: false,
      functionCheck: funSpecialSymbol,
    },
  ]);

  const funSelectedElement = (key, value) => {
    setErrors({ ...errors, [key]: '' });
    // setFormData({ ...formData, [key]: value });
    dispach(setDataKey({ key, value }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    if (name === 'name' || name === 'surname' || name === 'patronymic') {
      formattedValue = capitalizeFirstLetter(value);
    }
    dispach(setDataKey({ key: name, value: formattedValue }));
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    // Проверка обязательных полей
    [
      'name',
      'surname',
      'position',
      'organization',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'academicTitle',
      'degree',
    ].forEach(field => {
      if (!registration?.data?.[field]) {
        newErrors[field] = 'Поле обязательно для заполнения';
        isValid = false;
      }
    });
    // Проверка корректности Email
    if (registration?.data?.email && !/\S+@\S+\.\S+/.test(registration?.data?.email)) {
      newErrors.email = 'Некорректный Email';
      isValid = false;
    }
    // Проверка номера телефона
    if (
      registration?.data?.phone &&
      !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(registration?.data?.phone)
    ) {
      newErrors.phone = 'Номер должен быть в формате +7 (XXX) XXX-XX-XX';
      isValid = false;
    }
    // Проверка совпадения паролей
    if (registration?.data?.password !== registration?.data?.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }
    const paseerors = errorListPassword.find(el => !el.done);
    if (paseerors) {
      newErrors.password = paseerors.text;
      isValid = false;
    }

    if (!validateFIO(registration?.data?.organization)) {
      newErrors.organization = 'Некорректное название';
      isValid = false;
    }

    if (!validateFIO(registration?.data?.name)) {
      newErrors.name = 'Некорректное имя';
      isValid = false;
    }

    if (!validateFIO(registration?.data?.surname)) {
      newErrors.surname = 'Некорректная фамилия';
      isValid = false;
    }

    if (!validateFIO(registration?.data?.patronymic)) {
      newErrors.patronymic = 'Некорректное отчество';
      isValid = false;
    }

    if (!validateLength(registration?.data?.surname, 2, 50)) {
      newErrors.surname = 'Некорректная фамилия';
      isValid = false;
    }
    if (!validateLength(registration?.data?.name, 2, 50)) {
      newErrors.name = 'Некорректное имя';
      isValid = false;
    }
    if (!validateLength(registration?.data?.patronymic, 5, 50)) {
      newErrors.patronymic = 'Некорректное отчество';
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (validate()) {
      // type 0 это подтверждение
      // сброс пароля type 1
      const data = {
        ...registration?.data,
        phone: `+${registration?.data?.phone.replace(/\D/g, '')}`,
      };
      apiRegister(data).then(res => {
        if (res?.status === 200) {
          navigate('/login/confirmLogin');
          context.setMailValue(registration?.data?.email);
          sessionStorage.setItem('confirmEmail', registration?.data?.email);
        }
      });
    }
  };

  const funOpenList = param => {
    if (param === openList) {
      setOpenList('');
    } else {
      setOpenList(param);
    }
  };

  // const refCalendar = useRef(null);
  // массив из ref
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refList = [ref1, ref2, ref3, ref4];
  useEffect(() => {
    const handleClickOutside = event => {
      if (refList.every(item => item.current && !item.current.contains(event.target))) {
        funOpenList('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const clickRigthImg = name => {
    if (name === 'password') {
      setPassActionFirst('text');
    } else {
      setPassActionFirst('password');
    }
  };
  const clickRigthImgSecond = name => {
    if (name === 'password') {
      setPassActionSecond('text');
    } else {
      setPassActionSecond('password');
    }
  };

  return (
    <section className={styles.Login}>
      <div className={styles.LoginLogo}>
        <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      </div>
      <div className={styles.LoginTitle}>
        <p>Добро пожаловать</p>
        <p>Зарегистрируйтесь, чтобы начать работу.</p>
      </div>
      <div className={styles.input}>
        <div className={styles.inputInner}>
          <div className={styles.first}>
            <Input
              name="name"
              onChange={handleChange}
              value={registration?.data?.name}
              placeholder="Имя*"
              error={errors.name}
              autoComplete={'new-password'}
            />
            <Input
              name="surname"
              onChange={handleChange}
              value={registration?.data?.surname}
              placeholder="Фамилия*"
              error={errors.surname}
              autoComplete={'new-password'}
            />
            <Input
              name="patronymic"
              onChange={handleChange}
              value={registration?.data?.patronymic}
              placeholder="Отчество"
              error={errors.patronymic}
              autoComplete={'new-password'}
            />
            <InputList
              name="academicTitle"
              onChange={handleChange}
              value={registration?.data?.academicTitle}
              placeholder="Ученое звание"
              open={openList === 'academicTitle'}
              funOpen={funOpenList}
              divRef={refList[1]}
              list={zwanieList}
              error={errors.academicTitle}
              funSelectElement={funSelectedElement}
            />
            <InputList
              name="degree"
              onChange={handleChange}
              value={registration?.data?.degree}
              placeholder="Степень"
              open={openList === 'degree'}
              funOpen={funOpenList}
              divRef={refList[2]}
              error={errors.degree}
              list={stepenList}
              funSelectElement={funSelectedElement}
            />

            <InputList
              name="position"
              onChange={handleChange}
              value={registration?.data?.position}
              placeholder="Должность*"
              open={openList === 'position'}
              funOpen={funOpenList}
              divRef={refList[3]}
              list={doljnostList}
              funSelectElement={funSelectedElement}
              error={errors.position}
            />
          </div>
          <div className={styles.secind}>
            <Input
              name="organization"
              onChange={handleChange}
              value={registration?.data?.organization}
              placeholder="Организация*"
              error={errors.organization}
              autoComplete={'new-password'}
            />
            <Input
              name="email"
              onChange={handleChange}
              value={registration?.data?.email}
              placeholder="Email (логин)*"
              error={errors.email}
              autoComplete={'new-password'}
            />
            <Input
              name="phone"
              onChange={handleChange}
              value={registration?.data?.phone}
              placeholder="Номер телефона*"
              error={errors.phone}
              autoComplete={'new-password'}
            />
            <Input
              name="password"
              onChange={handleChange}
              value={registration?.data?.password}
              placeholder="Придумайте пароль*"
              error={errors.password}
              errorList={errorListPassword}
              setErrorList={setErrorListPassword}
              errorListImgHover={listErrorOnHover}
              errorListImgNoHover={listErrorNoHover}
              imgSrc={lock}
              autoComplete={'new-password'}
              type={passActionFirst}
              rigthImg={glaz}
              rigthImgActive={noglaz}
              rigthImgActiveAction={passActionFirst === 'text'}
              rigthImgClick={() => clickRigthImg(passActionFirst)}
            />
            <Input
              name="confirmPassword"
              onChange={handleChange}
              value={registration?.data?.confirmPassword}
              placeholder="Повторите пароль*"
              error={errors.confirmPassword}
              type={passActionSecond}
              imgSrc={lock}
              autoComplete={'new-password'}
              rigthImg={glaz}
              rigthImgActive={noglaz}
              rigthImgActiveAction={passActionSecond === 'text'}
              rigthImgClick={() => clickRigthImgSecond(passActionSecond)}
            />
          </div>
        </div>
      </div>
      <div className={styles.Maybe}>
        <div className={styles.MaybeInner}>
          <div className={styles.lineOne}></div>
          <div className={styles.CentralContainer}>
            <p>ИЛИ</p>
          </div>
          <div className={styles.lineTwo}></div>
        </div>
      </div>
      <div className={styles.loginButtonSfedu}>
        <button>
          <img src="/img/SfeduLogo.svg" alt="Sfedu Logo" />
          Войти через аккаунт @sfedu
        </button>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>Зарегистрироваться</button>
      </div>
      <div className={styles.noAccount}>
        <p>Уже есть аккаунт?</p>
        <p onClick={() => navigate('/login/authorization')} className={styles.link}>
          Авторизируйтесь
        </p>
      </div>
    </section>
  );
}

export default Register;
