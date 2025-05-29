import styles from './EnteringEmail.module.scss';
import logoIcon from '@assets/img/logo.png';
import { ReactComponent as Men } from '@assets/img/UI/men.svg';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../../utils/functions/Validations';
import { useState } from 'react';
import { apiSandReset } from '../../../apirequests/apirequests';
import { useDispatch } from 'react-redux';
import { setEmailSand } from '../../../store/userSlice/user.Slice';
import { useTranslation } from 'react-i18next';
import { setDataKey } from '../../../store/registrationSlice/registrationSlice';

function EnteringEmail() {
  const { t } = useTranslation('recoveryPassword');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const funChangeEmail = e => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value)) {
      setError(false);
    }
  };

  const funNextClick = () => {
    if (validateEmail(email)) {
      const data = {
        email: email,
      };
      apiSandReset(data).then(res => {
        if (res?.status === 200) {
          dispatch(setEmailSand({ email: email }));
          dispatch(setDataKey({ key: 'email', value: email }));
          // sessionStorage.setItem('confirmEmail', email);
          setError(false);
          navigate('checkemail');
        } else {
          setError(true);
        }
      });
    } else {
      setError(true);
    }
  };

  return (
    <div className={styles.EnteringEmail}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={logoIcon} alt="Логотип" onClick={() => navigate('/')} />
        </div>
        <h2>{t('par1')}</h2>
        <p>{t('par2')}</p>
        <div className={`${styles.email_input_container} ${error ? styles.error_box : ''}`}>
          {error && (
            <div className={styles.error}>
              <span>{t('par3')}</span>
            </div>
          )}
          <Men className={error ? styles.error_icon : ''} />
          <input
            value={email}
            onChange={funChangeEmail}
            className={styles.email_input}
            type="email"
            placeholder="Email"
            onFocus={e => (e.target.placeholder = '')}
            onBlur={e => (e.target.placeholder = 'Email')}
          />
        </div>
        <button className={styles.next_button} onClick={funNextClick}>
          {t('par4')}
        </button>
      </div>
    </div>
  );
}

export default EnteringEmail;
