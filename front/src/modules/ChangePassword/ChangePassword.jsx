import { useState } from 'react';
import styles from './ChangePassword.module.scss';
import Input from '../../ui/Input/Input';
import glaz from '@assets/img/UI/glaz.svg';
import noglaz from '@assets/img/UI/noglaz.svg';
import listErrorNoHover from '@assets/img/UI/listErrorNoActive.svg';
import listErrorOnHover from '@assets/img/UI/listError.svg';
import {
  funCapitalLetter,
  funDigit,
  funEightSymbols,
  funSixteenSymbols,
  funSpecialSymbol,
  validateLatinSymbols,
} from '../../utils/functions/PasswordValidation';
import { apiChangePassword } from '../../apirequests/apirequests';
import confitmIcon from '@assets/img/confirm.svg';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function ChangePassword() {
  const { t } = useTranslation('changePassword');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputTypes, setInputTypes] = useState({
    currentPassword: 'password',
    newpassword: 'password',
    rewnewpassword: 'password',
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newpassword: '',
    rewnewpassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newpassword: '',
    rewnewpassword: '',
  });

  const [errorListPassword, setErrorListPassword] = useState([
    {
      id: '0',
      text: t('rules.min8'),
      done: false,
      functionCheck: funEightSymbols,
    },
    {
      id: '4',
      text: t('rules.min16'),
      done: true,
      functionCheck: funSixteenSymbols,
    },
    {
      id: '1',
      text: t('rules.capitalLetter'),
      done: false,
      functionCheck: funCapitalLetter,
    },
    {
      id: '2',
      text: t('rules.digit'),
      done: false,
      functionCheck: funDigit,
    },
    {
      id: '3',
      text: t('rules.specialSymbol'),
      done: false,
      functionCheck: funSpecialSymbol,
    },
    {
      id: '5',
      text: t('rules.latinOnly'),
      done: false,
      functionCheck: validateLatinSymbols,
    },
  ]);

  const clickRigthImg = name => {
    if (inputTypes[name] === 'password') {
      setInputTypes({ ...inputTypes, [name]: 'text' });
    } else {
      setInputTypes({ ...inputTypes, [name]: 'password' });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    // Проверка обязательных полей
    ['currentPassword', 'newpassword', 'rewnewpassword'].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = t('fieldRequired');
        isValid = false;
      }
    });

    if (errorListPassword.find(el => !el.done)) {
      newErrors.newpassword = t('invalidPassword');
      newErrors.rewnewpassword = t('invalidPassword');
      isValid = false;
    }
    // Проверка совпадения паролей
    if (formData.newpassword !== formData.rewnewpassword) {
      newErrors.newpassword = t('passwordsMismatch');
      newErrors.rewnewpassword = t('passwordsMismatch');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  //! изменение пароля
  const funEditPassword = () => {
    if (validate()) {
      const data = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newpassword,
        repeatPassword: formData.rewnewpassword,
      };
      apiChangePassword(data).then(res => {
        if (res?.status === 200) {
          setIsModalOpen(true);
        } else {
          if (res?.response?.data?.errNum === 204) {
            setErrors({
              currentPassword: t('wrongPassword'),
            });
          }
        }
      });
    }
  };

  const funClickCloseModal = () => {
    setIsModalOpen(false);
    navigate('/account/profile');
  };

  return (
    <div className={styles.ChangePassword}>
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modal}>
            <motion.div
              className={styles.container}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <h2 className={styles.modalText}>{t('modalSuccess')}</h2>
              <img src={confitmIcon} alt="✅" />
              <button onClick={funClickCloseModal}>{t('goToProfile')}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className={styles.container}>
        <Input
          name={'currentPassword'}
          onChange={handleChange}
          value={formData.currentPassword}
          placeholder=""
          error={errors.currentPassword}
          labelText={t('currentPassword')}
          type={inputTypes.currentPassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.currentPassword === 'text'}
          rigthImgClick={() => clickRigthImg('currentPassword')}
          autoComplete={'off'}
        />
        <Input
          errorList={errorListPassword}
          setErrorList={setErrorListPassword}
          errorListImgHover={listErrorOnHover}
          errorListImgNoHover={listErrorNoHover}
          name={'newpassword'}
          onChange={handleChange}
          value={formData.newpassword}
          placeholder=""
          error={errors.newpassword}
          labelText={t('newPassword')}
          type={inputTypes.newpassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.newpassword === 'text'}
          rigthImgClick={() => clickRigthImg('newpassword')}
          autoComplete={'off'}
        />
        <Input
          name={'rewnewpassword'}
          onChange={handleChange}
          value={formData.rewnewpassword}
          placeholder=""
          error={errors.rewnewpassword}
          labelText={t('repeatPassword')}
          type={inputTypes.rewnewpassword}
          rigthImg={glaz}
          rigthImgActive={noglaz}
          rigthImgActiveAction={inputTypes.rewnewpassword === 'text'}
          rigthImgClick={() => clickRigthImg('rewnewpassword')}
          autoComplete={'off'}
        />
        <button className={styles.changebtn} onClick={funEditPassword}>
          {t('title')}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
