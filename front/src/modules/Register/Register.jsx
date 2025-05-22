import { useContext, useEffect, useRef, useState } from 'react';
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
  funSixteenSymbols,
  funSpecialSymbol,
  validateLatinSymbols,
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
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation('register');
  const dispach = useDispatch();
  const registration = useSelector(state => state.registration);
  const context = useContext(DataContext);
  const [openList, setOpenList] = useState('');
  const [passActionFirst, setPassActionFirst] = useState('password');
  const [passActionSecond, setPassActionSecond] = useState('password');
  const [modalTitle, setModalTitle] = useState(null);

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

  const errorList = [
    {
      id: '0',
      text: t('validate1'),
      loc: 'validate1',
      done: false,
      functionCheck: funEightSymbols,
    },
    {
      id: '4',
      text: t('validate2'),
      loc: 'validate2',
      done: true,
      functionCheck: funSixteenSymbols,
    },
    {
      id: '1',
      text: t('validate3'),
      loc: 'validate3',
      done: false,
      functionCheck: funCapitalLetter,
    },
    {
      id: '2',
      text: t('validate4'),
      loc: 'validate4',
      done: false,
      functionCheck: funDigit,
    },
    {
      id: '3',
      text: t('validate5'),
      loc: 'validate5',
      done: false,
      functionCheck: funSpecialSymbol,
    },
    {
      id: '5',
      text: t('validate6'),
      loc: 'validate6',
      done: false,
      functionCheck: validateLatinSymbols,
    },
  ];

  const [errorListPassword, setErrorListPassword] = useState(errorList);

  const funSelectedElement = (key, value) => {
    setErrors({ ...errors, [key]: '' });
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
      'organization',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'academicTitle',
      'degree',
    ].forEach(field => {
      if (!registration?.data?.[field]) {
        newErrors[field] = t('error1');
        isValid = false;
      }
    });
    // Проверка корректности Email
    if (registration?.data?.email && !/\S+@\S+\.\S+/.test(registration?.data?.email)) {
      newErrors.email = t('invalidEmail');
      isValid = false;
    }
    // Проверка номера телефона
    if (
      registration?.data?.phone &&
      !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(registration?.data?.phone)
    ) {
      newErrors.phone = t('invalidPhone');
      isValid = false;
    }
    // Проверка совпадения паролей
    if (registration?.data?.password !== registration?.data?.confirmPassword) {
      newErrors.confirmPassword = t('passwordNotEqual');
      isValid = false;
    }
    const paseerors = errorListPassword.find(el => !el.done);
    if (paseerors) {
      newErrors.password = paseerors.text;
      isValid = false;
    }

    if (!validateFIO(registration?.data?.name)) {
      newErrors.name = t('invalidName');
      isValid = false;
    }

    if (!validateFIO(registration?.data?.surname)) {
      newErrors.surname = t('invalidSurname');
      isValid = false;
    }

    if (!validateFIO(registration?.data?.patronymic)) {
      newErrors.patronymic = t('invalidPatronymic');
      isValid = false;
    }

    if (!validateLength(registration?.data?.surname, 2, 50)) {
      newErrors.surname = t('invalidSurname');
      isValid = false;
    }
    if (!validateLength(registration?.data?.name, 2, 50)) {
      newErrors.name = t('invalidName');
      isValid = false;
    }
    if (!validateLength(registration?.data?.patronymic, 5, 50)) {
      newErrors.patronymic = t('invalidPatronymic');
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
        } else {
          if (res?.response?.data?.message === 'email or phone entity already exists') {
            setModalTitle(t('alreadyExists'));
            return;
          }
          if (res?.response?.data?.message?.includes('password')) {
            setModalTitle(t('invalidPassword'));
            return;
          }
          if (res?.response?.data?.message?.includes('name')) {
            setModalTitle(`${t('invalidName')}!`);
            return;
          }
          if (res?.response?.data?.message?.includes('surname')) {
            setModalTitle(`${t('invalidSurname')}!`);
            return;
          }
          if (res?.response?.data?.message?.includes('patronymic')) {
            setModalTitle(`${t('invalidPatronymic')}!`);
            return;
          }
          if (res?.response?.data?.message?.includes('organization')) {
            setModalTitle(t('invalidOrganization'));
            return;
          }
          if (res?.response?.data?.message?.includes('position')) {
            setModalTitle(t('invalidPosition'));
            return;
          }
          if (res?.response?.data?.message?.includes('speciality')) {
            setModalTitle(t('invalidSpeciality'));
            return;
          }
          if (res?.response?.data?.message === 'email parameter is invalid') {
            setModalTitle(t('invalidEmail2'));
            return;
          }
          if (res?.response?.data?.message === 'phone parameter is invalid') {
            setModalTitle(t('invalidPhone2'));
            return;
          }

          setModalTitle(t('errorRegister'));
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
      <ErrorModal open={modalTitle} close={() => setModalTitle(null)} title={modalTitle} />
      <div className={styles.LoginLogo}>
        <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      </div>
      <div className={styles.LoginTitle}>
        <p>{t('title')}</p>
        <p>{t('h2')}</p>
      </div>
      <div className={styles.input}>
        <div className={styles.inputInner}>
          <div className={styles.first}>
            <Input
              name="name"
              onChange={handleChange}
              value={registration?.data?.name}
              placeholder={t('name')}
              error={errors.name}
              autoComplete={'new-password'}
            />
            <Input
              name="surname"
              onChange={handleChange}
              value={registration?.data?.surname}
              placeholder={t('surname')}
              error={errors.surname}
              autoComplete={'new-password'}
            />
            <Input
              name="patronymic"
              onChange={handleChange}
              value={registration?.data?.patronymic}
              placeholder={t('patronymic')}
              error={errors.patronymic}
              autoComplete={'new-password'}
            />
            <InputList
              name="academicTitle"
              onChange={handleChange}
              value={registration?.data?.academicTitle}
              placeholder={t('academicTitle')}
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
              placeholder={t('degree')}
              open={openList === 'degree'}
              funOpen={funOpenList}
              divRef={refList[2]}
              error={errors.degree}
              list={stepenList}
              funSelectElement={funSelectedElement}
            />

            <Input
              name="position"
              onChange={handleChange}
              value={registration?.data?.position}
              placeholder={t('position')}
              error={errors.position}
              autoComplete={'new-password'}
            />
          </div>
          <div className={styles.secind}>
            <Input
              name="organization"
              onChange={handleChange}
              value={registration?.data?.organization}
              placeholder={t('organization')}
              error={errors.organization}
              autoComplete={'new-password'}
            />
            <Input
              name="email"
              onChange={handleChange}
              value={registration?.data?.email}
              placeholder={t('email')}
              error={errors.email}
              autoComplete={'new-password'}
            />
            <Input
              name="phone"
              onChange={handleChange}
              value={registration?.data?.phone}
              placeholder={t('phone')}
              error={errors.phone}
              autoComplete={'new-password'}
            />
            <Input
              name="password"
              onChange={handleChange}
              value={registration?.data?.password}
              placeholder={t('password')}
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
              placeholder={t('confirmPassword')}
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
            <p>{t('or')}</p>
          </div>
          <div className={styles.lineTwo}></div>
        </div>
      </div>
      <div className={styles.loginButtonSfedu}>
        <button>
          <img src="/img/SfeduLogo.svg" alt="Sfedu Logo" />
          {t('sfedu')}
        </button>
      </div>
      <div className={styles.submitButton}>
        <button onClick={handleSubmit}>{t('register')}</button>
      </div>
      <div className={styles.noAccount}>
        <p>{t('alreadyAccount')}</p>
        <p onClick={() => navigate('/login/authorization')} className={styles.link}>
          {t('authorization')}
        </p>
      </div>
    </section>
  );
}

export default Register;
